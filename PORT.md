# Port to OpenCode

This fork is **[Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios)
v1.2.0**, retargeted from Claude Code to [OpenCode](https://opencode.ai).

Upstream history is intact. Everything this port changes is on top of the
`v1.2.0` release commit, so the change set is exactly:

```bash
git remote add upstream https://github.com/Donchitos/Claude-Code-Game-Studios.git
git fetch upstream
git diff upstream/main --stat
```

The studio itself is unchanged: 49 subagents, 74 skills, 74 slash commands, the
7-phase pipeline, the gates, the 62 templates, the project config resolution and
the bash validators. What changed is the harness layer around them.

## Renames

| Upstream | This fork |
| --- | --- |
| `.claude/` | `.opencode/` |
| `CLAUDE.md` | `AGENTS.md` |
| `.claude/settings.json` | `opencode.jsonc` (permissions) + `.opencode/plugins/ccgs-hooks/` (hooks) |
| `.claude/agents/*.md` | `.opencode/agents/*.md` |
| `.claude/skills/<id>/SKILL.md` | `.opencode/skills/<id>/SKILL.md` (+ `.opencode/commands/<id>.md`) |
| `.claude/rules/*.md` | `.opencode/rules/*.md` (loaded on demand, not every session) |
| `.claude/hooks/*.sh` | `.opencode/hooks/*.sh` (unchanged scripts, new driver) |
| `.claude/docs/CLAUDE-local-template.md` | `.opencode/docs/personal-agents-template.md` |
| `.claude/docs/settings-local-template.md` | `.opencode/docs/personal-overrides.md` |
| `.claude/statusline.sh` | removed — OpenCode has its own status bar |

## Added

- **`opencode.jsonc`** — `instructions` (AGENTS.md, coordination rules, coding
  standards, the engine reference), 118 ordered `permissions` rules, the plugin.
- **`.opencode/commands/`** — 74 slash commands, one per skill. Each is three
  lines: a `description`, then "Load the `<id>` skill with the skill tool …
  `$ARGUMENTS`". Upstream's slash commands *were* the skills; OpenCode needs one
  command file per skill, because skills are invoked by the model and commands
  by the user.
- **`.opencode/plugins/ccgs-hooks/index.js`** — the only new logic. It maps
  OpenCode events onto the existing bash hooks, so the scripts keep their
  Claude-shaped JSON contract and stay diffable against upstream:

  | OpenCode | Hook scripts |
  | --- | --- |
  | `tool.execute.before` (`shell`) | `validate-commit.sh`, `validate-push.sh` |
  | `tool.execute.before` (`write`/`edit`/`patch`) | `validate-registry.sh`, `validate-write.sh` |
  | `tool.execute.before` (`read`) | `validate-read.sh` |
  | `tool.execute.after` (`write`/`edit`/`patch`) | `validate-assets.sh`, `validate-skill-change.sh` |
  | `tool.execute.before/after` (`subagent`) | `log-agent.sh`, `log-agent-stop.sh` |
  | session context request (first step) | `session-start.sh`, `detect-gaps.sh` |
  | compaction request | `pre-compact.sh` |
  | `session.idle` | `session-stop.sh` |
  | `permission.asked` | `notify.sh` |
  | first matching read/edit | the path-scoped rule file (`rules/*.md` `paths:`) |

  It also resolves Git Bash on Windows (`OPENCODE_BASH`, `OPENCODE_GIT_BASH_PATH`,
  the standard install paths) and runs hooks with `windowsHide`.
- **`.opencode/plugins/ccgs-hooks/selftest.mjs`** — asserts the glob matcher and
  drives the real hooks through a fake host: a `git push` must be refused, the
  session context must inject, and a gameplay read must inject exactly one
  rule. Run `node .opencode/plugins/ccgs-hooks/selftest.mjs`.

## Changed

- **Agent frontmatter**: `tools` / `disallowedTools` / `maxTurns` /
  `isolation` / `model` → `mode: subagent`, `steps`, and a `permissions` list.
  A granted `Write`/`Edit` becomes `edit: allow` (upstream pre-approved its own
  tool list), followed by `*.env*`, `*.uasset` and `*.umap` denies so the global
  denies are not reopened by last-match-wins. A tool upstream withheld becomes an
  explicit `deny`.
- **Agent `skills:` preload**: OpenCode agents cannot preload a skill, so the
  five agents that listed one now say "Before starting, load `<id>` with the
  skill tool".
- **Skill bodies**: the Claude-only `` !`cmd` `` prelude became an explicit "run
  this helper" step, and `${CLAUDE_SKILL_DIR}` became the real repo-relative
  path. `AskUserQuestion` → `question`, `subagent_type:` → `agent:`.
- **`/setup-engine`** now rewrites the engine-reference entry in
  `opencode.jsonc` `instructions` instead of an `@`-import in `CLAUDE.md`; the
  session-start mismatch warning reads the same place.
- **Docs rewritten for OpenCode**: `quick-start.md`, `setup-requirements.md`,
  `model-tiers.md`, `hooks-reference.md` (+ `hook-input-schemas.md`),
  `config-resolution.md`, `rules-reference.md`, `agent-teams.md`,
  `effects-map.md`, `skills-reference.md`, `README.md`, `CHANGELOG.md`
  (`[2.0.0]` entry), and `studio-tests/` where it asserted Claude-only tooling.
- **`compat-inventory.sh`** reads `opencode.json(c)` and understands both the V1
  permission map and the V2 `permissions` array; its portable-key lists know
  `permission` and `metadata`.
- **`.gitignore` / `.worktreeinclude`** lost the `settings.local.json` and
  `AGENTS.local.md` entries (OpenCode has no project-local variants) and kept
  `project.local.yaml`.

## Behaviour differences you can feel

| Upstream | This fork | Why |
| --- | --- | --- |
| Path rules load for every session | A rule loads the first time a session reads or edits a matching file | `instructions` would cost ~28 KB in every session |
| Per-agent model pins (opus / sonnet / inherit) | Every agent and skill runs on the session model | Keeps the port provider-agnostic; add `model:` to one agent to pin it back |
| Per-skill `allowed-tools` enforced | Not enforceable per skill | OpenCode permissions are per agent; the agent's grant is the boundary |
| `statusline.sh` (context %, stage, epic) | OpenCode's own status bar | No status-line API to plug a script into |
| Agent teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`) | Ordinary subagents or several sessions | OpenCode has no agent-team feature |
| `prototyper` isolated in a worktree | Same checkout | Subagents do not get worktree isolation |

## Not wired

Two upstream hooks have no OpenCode input. Both are left silent rather than
faked:

- **`validate-agent-artifact.sh`** — it reads the subagent transcript path, which
  OpenCode does not expose. The orchestrating skill still checks its named
  artifact file itself.
- **Idle-prompt toast** — there is no "idle about a minute" event. The
  permission-prompt toast is wired to `permission.asked`.

## Install

```bash
git clone https://github.com/cfyz1297/Claude-Code-Game-Studios.git
cd Claude-Code-Game-Studios
opencode
```

Requirements and platform notes: `.opencode/docs/setup-requirements.md`
(Git, OpenCode, Python 3, Bash; `jq` recommended). Start OpenCode in the repo
root — it discovers `opencode.jsonc`, the agents, the commands and the plugin
from there.

## Verified on

- OpenCode **2.2.5**: the plugin reports `active` via `GET /api/plugin`, 49
  agents / 74 skills / 74 commands load, 211 frontmatter blocks parse as YAML,
  `compat-inventory.sh` runs clean in all three scopes, the hooks self-test
  passes.
- OpenCode **1.x** is *not* covered: the plugin targets the V2 plugin API, so on
  V1 the agents, skills and commands still work and the hooks do not load.

## Found in another fork

[thekingoffamily/Open-Code-Game-Studios](https://github.com/thekingoffamily/Open-Code-Game-Studios)
is an earlier, independent port of the same upstream commit. It is worth reading
for its README and CHANGELOG, and this fork took its adapted
`compat-inventory.sh`, its `windowsHide` spawn flag and its `OPENCODE_BASH`
variable naming. Three of its choices were deliberately not taken, because they
reduce behaviour rather than port it:

- its plugin uses the V1 API (`@opencode-ai/plugin`, `experimental.chat.system.transform`),
  so on OpenCode 2.x it is discovered as a local plugin but never activates —
  the validators, read guard and write guard are silently absent;
- it loads all 14 path-scoped rules through `instructions` in every session;
- it pre-approves `edit: "*": allow` for agents *after* the global denies, which
  reopens `.env` and binary-asset edits (last matching rule wins).
