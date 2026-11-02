<p align="center">
  <a name="english"></a>
  <h1 align="center">OpenCode Game Studios</h1>
  <p align="center">
    Turn a single OpenCode session into a full game development studio.
    <br />
    49 agents. 74 skills. One coordinated AI team.
  </p>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href=".opencode/agents"><img src="https://img.shields.io/badge/agents-49-blueviolet" alt="49 Agents"></a>
  <a href=".opencode/skills"><img src="https://img.shields.io/badge/skills-74-green" alt="74 Skills"></a>
  <a href=".opencode/plugins/ccgs-hooks"><img src="https://img.shields.io/badge/hooks-15-orange" alt="15 Hooks"></a>
  <a href=".opencode/rules"><img src="https://img.shields.io/badge/rules-14-red" alt="14 Rules"></a>
  <a href="https://opencode.ai"><img src="https://img.shields.io/badge/built%20for-OpenCode-f5f5f5" alt="Built for OpenCode"></a>
  <a href="https://www.buymeacoffee.com/donchitos3"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20this%20project-FFDD00?logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee"></a>
  <a href="https://github.com/sponsors/Donchitos"><img src="https://img.shields.io/badge/GitHub%20Sponsors-Support%20this%20project-ea4aaa?logo=githubsponsors&logoColor=white" alt="GitHub Sponsors"></a>
</p>

<p align="center">
  <b>English</b> · <a href="#русский">Русский</a>
</p>

---

## Why This Exists

Building a game solo with AI is powerful — but a single chat session has no structure. No one stops you from hardcoding magic numbers, skipping design docs, or writing spaghetti code. There's no QA pass, no design review, no one asking "does this actually fit the game's vision?"

**OpenCode Game Studios** solves this by giving your AI session the structure of a real studio. Instead of one general-purpose assistant, you get 49 specialized agents organized into a studio hierarchy — directors who guard the vision, department leads who own their domains, and specialists who do the hands-on work. Each agent has defined responsibilities, escalation paths, and quality gates.

The result: you still make every decision, but now you have a team that asks the right questions, catches mistakes early, and keeps your project organized from first brainstorm to launch.

---

## Table of Contents

- [What's Included](#whats-included)
- [Studio Hierarchy](#studio-hierarchy)
- [Slash Commands](#slash-commands)
- [Does it produce games, or documents?](#does-it-produce-games-or-documents)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Upgrading](#upgrading)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [OpenCode Port Notes](#opencode-port-notes)
- [Design Philosophy](#design-philosophy)
- [Customization](#customization)
- [Platform Support](#platform-support)
- [Community](#community)
- [Supporting This Project](#supporting-this-project)
- [License](#license)

---

## What's Included

| Category | Count | Description |
|----------|-------|-------------|
| **Agents** | 49 | Specialized subagents across design, programming, art, audio, narrative, QA, and production |
| **Skills** | 74 | Slash commands for every workflow phase (`/start`, `/design-system`, `/create-epics`, `/create-stories`, `/dev-story`, `/story-done`, etc.) |
| **Hooks** | 15 | Automated validation on commits, pushes, asset changes, design-doc reads, writes and registries, session lifecycle, agent audit trail, and gap detection. One (`validate-agent-artifact.sh`) has no OpenCode input and stays dormant |
| **Rules** | 14 | Path-scoped coding standards enforced when editing gameplay, engine, AI, UI, network code, scene and asset files, and more |
| **Templates** | 62 | Document templates for GDDs, UX specs, ADRs, sprint plans, HUD design, accessibility, and more |

## Studio Hierarchy

Agents are organized into three tiers, matching how real studios operate:

```
Tier 1 — Directors
  creative-director    technical-director    producer

Tier 2 — Department Leads
  game-designer        lead-programmer       art-director
  audio-director       narrative-director    qa-lead
  release-manager      localization-lead

Tier 3 — Specialists
  gameplay-programmer  engine-programmer     ai-programmer
  network-programmer   tools-programmer      ui-programmer
  systems-designer     level-designer        economy-designer
  technical-artist     sound-designer        writer
  world-builder        ux-designer           prototyper
  performance-analyst  devops-engineer       analytics-engineer
  security-engineer    qa-tester             accessibility-specialist
  live-ops-designer    community-manager
```

Each agent declares `mode: subagent` and inherits the model selected in your
OpenCode session. There is no per-agent model pin, so the studio runs on
whatever provider and model you already chose; the tiers express seniority of
role, not billing.

### Engine Specialists

The template includes agent sets for all three major engines. Use the set that matches your project:

| Engine | Lead Agent | Sub-Specialists |
|--------|-----------|-----------------|
| **Godot 4** | `godot-specialist` | GDScript, Shaders, GDExtension |
| **Unity** | `unity-specialist` | DOTS/ECS, Shaders/VFX, Addressables, UI Toolkit |
| **Unreal Engine 5** | `unreal-specialist` | GAS, Blueprints, Replication, UMG/CommonUI |

## Slash Commands

Type `/` in OpenCode to access all 74 skills:

**Onboarding & Navigation**
`/start` `/help` `/project-stage-detect` `/setup-engine` `/adopt` `/settings`

**Game Design**
`/brainstorm` `/map-systems` `/design-system` `/quick-design` `/review-all-gdds` `/propagate-design-change`

**Art & Assets**
`/art-bible` `/asset-spec` `/asset-audit`

**UX & Interface Design**
`/ux-design` `/ux-review`

**Architecture**
`/create-architecture` `/architecture-decision` `/architecture-review` `/create-control-manifest`

**Stories & Sprints**
`/create-epics` `/create-stories` `/dev-story` `/sprint-plan` `/sprint-status` `/story-readiness` `/story-done` `/estimate`

**Reviews & Analysis**
`/design-review` `/code-review` `/balance-check` `/content-audit` `/scope-check` `/perf-profile` `/tech-debt` `/gate-check` `/consistency-check` `/security-audit`

**QA & Testing**
`/qa-plan` `/smoke-check` `/soak-test` `/regression-suite` `/test-setup` `/test-helpers` `/test-evidence-review` `/test-flakiness` `/skill-test` `/skill-improve`

**Production**
`/milestone-review` `/retrospective` `/bug-report` `/bug-triage` `/reverse-document` `/playtest-report`

**Release**
`/release-checklist` `/launch-checklist` `/changelog` `/patch-notes` `/hotfix` `/day-one-patch`

**Creative & Content**
`/prototype` `/vertical-slice` `/onboard` `/localize`

**Team Orchestration** (coordinate multiple agents on a single feature)
`/team-combat` `/team-narrative` `/team-ui` `/team-release` `/team-polish` `/team-audio` `/team-level` `/team-live-ops` `/team-qa`

## Does it produce games, or documents?

A fair question, and the answer is a measurement rather than a sample project.
Four games were built from one brief at different `modes.rigor` levels and the
documents each wrote **before its first line of game code** were counted:

| `modes.rigor` | Docs before first line of game code | Time |
|---|---:|---:|
| `minimal` | **1** (the one-page brief) | 0 min |
| `standard` | 30 | 58 min |

All of them produced a running, tested game. Two blind reviewers and a human
playtest then ranked the `standard` build **last** — the extra 29 documents
bought traceability, not a better game.

### It runs the game and looks at it

The measurement above is about cost. The other half is whether the thing works,
and for a game that means someone has to *look* at it — a passing test says
nothing about a menu drawn off-screen. So a story that changes anything the
player sees is not closed until the game has been launched, observed, and a
screenshot retained in `production/qa/evidence/`. A parse check is not a run.
This holds at every rigor level, including `minimal`, where automated tests are
waived but the look is not.

The games themselves are deliberately **not** shipped here: this is a template
you clone to start your own project, and somebody else's game in your repo is
clutter, not evidence.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [OpenCode](https://opencode.ai) — install the CLI and sign in to at least one provider. The hooks bridge targets the V2 plugin API; on an older V1 install the agents, skills and commands still work, but hooks do not load
- [Python 3](https://www.python.org/) — reads `project.yaml` for every skill and hook; without it every setting silently falls back to its default
- Bash — runs every hook; built into macOS and Linux, and on Windows it comes with [Git for Windows](https://git-scm.com/downloads/win). The plugin finds `C:\Program Files\Git\bin\bash.exe` automatically, or set `OPENCODE_BASH`
- **Recommended**: [jq](https://jqlang.github.io/jq/) (for hook validation)

Hooks fail gracefully if optional tools are missing — you just lose validation — with one deliberate exception: a commit that stages data JSON is blocked when there is no Python to validate it.

### Setup

1. **Clone or use as template**:
   ```bash
   git clone https://github.com/cfyz1297/OpenCode-Code-Game-Studios.git my-game
   cd my-game
   ```
   This tree is the OpenCode port of
   [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios)
   v1.2.0. What it changes, and what it deliberately does not, is in
   [PORT.md](PORT.md).

2. **Open OpenCode in the project's root folder** (the one holding
   `AGENTS.md` and `project.yaml`) and start a session:
   ```bash
   opencode
   ```
   OpenCode loads `opencode.jsonc`, the agents, the skills, the slash commands
   and the hooks plugin from that folder. Start in a subfolder and the project
   config is not discovered the same way.

3. **Run `/start`** — the system asks where you are (no idea, vague concept,
   clear design, existing work) and guides you to the right workflow. No assumptions.

   Or jump directly to a specific skill if you already know what you need:
   - `/brainstorm` — explore game ideas from scratch
   - `/setup-engine godot 4.7` — configure your engine if you already know
   - `/project-stage-detect` — analyze an existing project

## Configuration

`project.yaml` at the repo root is the single source of truth for how the
studio behaves on your project — engine, naming conventions, and a `modes`
block that controls how much process every skill enforces. `/start` writes it
for you; you rarely need to hand-edit it.

The one question that matters most is **`modes.rigor`** — `minimal`, `standard`,
or `full`. It's a single front door over six separate knobs (`workflow` —
which GDD sections are required, `docs.density`, `qa.level`,
`story_granularity`, `review_mode` — how many director agents review your work,
and `team.size`), so `/start` asks it once instead of six times:

- **`minimal`** (default) — jam-game speed. No GDDs required, terse docs, minimal QA evidence, solo review. `/start` → `/setup-engine` → `/brainstorm` (a one-page brief) → `/create-stories` → `/dev-story` ↔ `/story-done`.
- **`standard`** — 5 required GDD sections, balanced doc depth, standard QA evidence, lean review.
- **`full`** — all 8 GDD sections, thorough docs, full QA evidence on every story type, full director review.

`minimal` is the default because the heavier tier costs more to reach working
code without producing a better result, and gives nothing back when someone new
picks the project up. Raise it in one `/settings` call when your project grows
— `/help` and `/gate-check` will suggest it when they see the signs.

Two escape hatches keep one setting from being a blunt instrument.
**`system_overrides`** holds a single system to a higher standard than the rest
of the project — your combat system gets the full treatment while everything
else stays light. **`testing.strict`** sets, per test type (logic, integration,
visual, UI, config), whether missing evidence blocks a story or merely warns.

Any of the six underlying knobs can still be set individually if you want a mix
(e.g. `workflow: full` with `docs.density: terse` — comprehensive but compact).
Two of them — `review_mode` (`full` / `lean` / `solo`) and `team.size` — are
also **personal**: rigor sets the team-wide default, but you can override them
per-developer in a gitignored `project.local.yaml` without touching the shared
config. `modes.automation` (how often the AI pauses to ask before it acts) sits
outside rigor and is likewise personally overridable.

View or change any setting with the `/settings` skill:

```
/settings                              # view effective config
/settings modes.review_mode            # view one setting
/settings modes.rigor=full             # write to project.yaml (team-wide)
/settings --local modes.review_mode=solo   # write to project.local.yaml (just you)
```

Full schema and per-setting behavior: `.opencode/docs/effects-map.md`.

## Upgrading

Already using an older version of this template? See [UPGRADING.md](UPGRADING.md)
for step-by-step migration instructions, a breakdown of what changed between
versions, and which files are safe to overwrite vs. which need a manual merge.

## Project Structure

```
AGENTS.md                           # Master configuration (OpenCode loads it)
opencode.jsonc                      # Instructions, permissions, plugin config
.opencode/
  agents/                           # 49 agent definitions (markdown + YAML frontmatter)
  commands/                         # 74 slash commands (one wrapper per skill)
  skills/                           # 74 skills (subdirectory per skill)
  plugins/ccgs-hooks/               # Event bridge: tool/session events -> bash hooks
  hooks/                            # 18 bash scripts the bridge runs
  rules/                            # 14 path-scoped coding standards (loaded on demand)
  docs/
    workflow-catalog.yaml           # 7-phase pipeline definition (read by /help)
    templates/                      # 62 document templates (+ per-section guidance)
src/                                # Game source code (Godot). The code root is
                                    #   ENGINE-SPECIFIC: Unity compiles only
                                    #   Assets/, Unreal builds from Source/<Module>/
assets/                             # Art, audio, VFX, shaders, data files
design/                             # GDDs, narrative docs, level designs
docs/                               # Technical documentation and ADRs
tests/                              # Test suites (unit, integration, performance, playtest)
tools/                              # Build and pipeline tools
prototypes/                         # Throwaway prototypes (isolated from src/)
production/                         # Sprint plans, milestones, release tracking
studio-tests/                       # QA for the skills and agents themselves — see below
```

### Testing your customizations

CCGS is a template you are meant to edit. `studio-tests/` is how
you check that an edited or newly written skill still holds up — a catalog of all
74 skills and 49 agents, per-category quality rubrics, behavioral specs, and
templates for writing specs of your own.

```
/skill-test static [name]     # structural linter — 7 compliance checks
/skill-test category [name]   # category-specific quality rubric
/skill-test spec [name]       # behavioral spec assertions
/skill-test audit             # coverage report across skills and agents
/skill-improve [name]         # test-fix-retest loop; keeps or reverts on score change
```

It tests the *framework*, never your game — game tests live in `tests/`.

## How It Works

### Agent Coordination

Agents follow a structured delegation model:

1. **Vertical delegation** — directors delegate to leads, leads delegate to specialists
2. **Horizontal consultation** — same-tier agents can consult each other but can't make binding cross-domain decisions
3. **Conflict resolution** — disagreements escalate up to the shared parent (`creative-director` for design, `technical-director` for technical)
4. **Change propagation** — cross-department changes are coordinated by `producer`
5. **Domain boundaries** — agents don't modify files outside their domain without explicit delegation

### Collaborative, Not Autonomous

This is **not** an auto-pilot system. Every agent follows a strict collaboration protocol:

1. **Ask** — agents ask questions before proposing solutions
2. **Present options** — agents show 2-4 options with pros/cons
3. **You decide** — the user always makes the call
4. **Draft** — agents show work before finalizing
5. **Approve** — nothing gets written without your sign-off

You stay in control. The agents provide structure and expertise, not autonomy.

That is how a session started at the project root behaves out of the box. The
`guided` and `autonomous` automation settings trade some of these prompts for
speed; `modes.automation` in `project.yaml` selects one, and
[setup-requirements.md](.opencode/docs/setup-requirements.md) explains the
permission layer behind it.

### Automated Safety

**Hooks** run automatically through `.opencode/plugins/ccgs-hooks/`. The plugin
maps OpenCode tool and session events onto the bash scripts in
`.opencode/hooks/`, so the scripts stay portable and the wiring is one file:

| Hook | OpenCode trigger | What It Does |
|------|------------------|--------------|
| `validate-commit.sh` | shell tool | Checks for hardcoded values, TODO format, JSON validity, design doc sections — exits early if the command is not `git commit` |
| `validate-push.sh` | shell tool | Warns on pushes to protected branches, and on `git tag`, `git merge`, `gh release`, `butler push` and `steamcmd +run_app_build` — exits early for any other command |
| `validate-read.sh` | read tool | Refuses a whole-file read of a design doc over 40 KB and answers with its headings, so the retry reads one section (`features.read_guard`) |
| `validate-write.sh` | write/edit tools | Warns, never blocks, when a write would break a rule the skills state: a file they never overwrite, the config guard, the prototype boundary, a localization freeze |
| `validate-registry.sh` | write/edit tools | Warns when a write to the entity or TR-ID registry would delete or renumber an entry, or set a status its header does not list |
| `validate-assets.sh` | write/edit tools (after) | Checks data-file JSON under `assets/`, `Assets/` or `Content/`, and asset naming in Godot's `assets/` only — exits early if the file is under none of them |
| `session-start.sh` | first model step of a session | Shows current branch and recent commits for orientation |
| `detect-gaps.sh` | first model step of a session | Detects fresh projects (suggests `/start`) and missing design docs when code or prototypes exist |
| `pre-compact.sh` | compaction request | Logs the compaction; session start runs again on the next step and restores context |
| `notify.sh` | permission prompt | Shows Windows toast notification via PowerShell |
| `session-stop.sh` | session idle | Archives `active.md` to session log and records git activity |
| `log-agent.sh` | `subagent` tool call | Audit trail start — logs subagent invocation |
| `log-agent-stop.sh` | `subagent` tool result | Audit trail stop — completes subagent record |
| `validate-agent-artifact.sh` | not run | OpenCode exposes no subagent transcript path, so this check has no input. The orchestrating skill still checks its named artifact. |
| `validate-skill-change.sh` | write/edit tools (after) | Advises running `/skill-test` after any `.opencode/skills/` change |

> **Note**: the shell, read and write hooks run on every matching tool call and
> exit immediately (exit 0) when the command or file path is not relevant. This
> is normal hook behavior — not a performance concern.

**Permission rules** live in `opencode.jsonc`, not in a harness-specific
settings file. They ask before edits and most shell commands, auto-allow the
read-only commands and the repo's own helpers, and deny force push, `rm -rf`,
recursive `Remove-Item`, `reset --hard`, `clean -f`, `.env` reads and binary
asset edits. The `git` deny patterns match anywhere in the command, so a commit
message that merely contains `push + pull` is denied too: reword it.

### Path-Scoped Rules

Coding standards are automatically enforced based on file location. The
`ccgs-hooks` plugin reads each rule's `paths:` frontmatter and injects the rule
the first time a session reads or edits a matching file, so unrelated work does
not pay for it. The paths below are Godot's. Each rule also matches the Unity and Unreal layouts: the code
rules match C# under `Assets/**/Gameplay/` and C++ under `Source/**/Gameplay/` (and `Core`,
`AI`, `Networking`, `UI`), data matches JSON under `Assets/**/Data/` and
`Content/**/Data/`, shaders match by file type, and tests match
C# under `Assets/Tests/` and C++ under `Source/**/Tests/`.

| Path | Enforces |
|------|----------|
| `src/gameplay/**` | Data-driven values, delta time usage, no UI references |
| `src/core/**` | Zero allocations in hot paths, thread safety, API stability |
| `src/ai/**` | Performance budgets, debuggability, data-driven parameters |
| `src/networking/**` | Server-authoritative, versioned messages, security |
| `src/ui/**` | No game state ownership, localization-ready, accessibility |
| `design/gdd/**` | Required sections per `modes.workflow`, formula format, edge cases |
| `design/narrative/**` | Lore consistency, character voice, canon levels |
| `assets/data/**/*.json` | JSON validity, naming conventions, schema rules |
| `assets/shaders/**` | Naming conventions, performance targets, cross-platform rules |
| `**/*.tscn`, `**/*.tres` | Scene and resource files changed in the editor where possible; safe hand-edit rules |
| `tests/**` | Test naming, coverage requirements, fixture patterns |
| `prototypes/**` | Relaxed standards, README required, hypothesis documented |

## OpenCode Port Notes

This repository is a full port of the original Claude Code template to OpenCode.
The complete change set against upstream v1.2.0 — renames, additions, behaviour
differences, what is not wired, and how to review the diff — is in
**[PORT.md](PORT.md)**.

What maps one-to-one, and what does not:

| Feature | Port |
|---------|------|
| 49 agents | Markdown agents in `.opencode/agents/`, `mode: subagent`, `steps` from `maxTurns`, tool grants translated to `permissions`. A granted Write/Edit becomes `edit: allow` (the upstream pre-approval), followed by the three edit denies so `.env` and binary assets stay closed; a missing tool becomes a `deny` |
| 74 skills | `.opencode/skills/<id>/SKILL.md`, auto-advertised like any OpenCode skill |
| Slash commands | `.opencode/commands/<id>.md`, one per skill; the command loads the skill and passes its arguments |
| 15 hooks | One plugin (`.opencode/plugins/ccgs-hooks/`, OpenCode V2 plugin API) runs the original bash validators; no `settings.json` wiring |
| 14 path-scoped rules | Plugin injects a rule on the first matching read or edit |
| Dangerous-command denies | Converted to `permissions` in `opencode.jsonc`. The primary session asks before an edit or a shell command; a subagent write is pre-approved by its own grant, as it was upstream |
| Per-agent model pins (opus/sonnet/haiku) | **Dropped**: every agent inherits the session model, so the studio is provider-agnostic |
| Per-skill `allowed-tools` | **Not enforceable per skill**: OpenCode permissions are per agent. The agent's own grant is the boundary |
| Agent `isolation: worktree` (prototyper) | **Not available**: OpenCode subagents run in the same checkout |
| Skill `!`…`` shell preludes | Converted to an explicit "run this helper" step the model executes |
| Status line script (context%, stage, epic) | **Replaced** by OpenCode's built-in status bar; the script is removed |
| Idle-prompt toast | **Not wired**: OpenCode has no idle event; the permission-prompt toast remains |
| Agent teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`) | **Not ported**: use ordinary subagents; the team-* skills still orchestrate them sequentially |

Everything below the fidelity table—workflow, gates, templates, scripts and
skill logic—is unchanged.

## Design Philosophy

This template is grounded in professional game development practices:

- **MDA Framework** — Mechanics, Dynamics, Aesthetics analysis for game design
- **Self-Determination Theory** — Autonomy, Competence, Relatedness for player motivation
- **Flow State Design** — Challenge-skill balance for player engagement
- **Bartle Player Types** — Audience targeting and validation
- **Verification-Driven Development** — Tests first, then implementation

## Customization

This is a **template**, not a locked framework. Everything is meant to be customized:

- **Add/remove agents** — delete agent files you don't need, add new ones for your domains
- **Edit agent prompts** — tune agent behavior, add project-specific knowledge
- **Modify skills** — adjust workflows to match your team's process
- **Add rules** — create new path-scoped rules for your project's directory structure
- **Tune hooks** — adjust validation strictness, add new checks
- **Pick your engine** — use the Godot, Unity, or Unreal agent set (or none)
- **Tune process weight** — `modes.rigor` and its underlying knobs in `project.yaml` (see [Configuration](#configuration)). Override per-run with `--review solo` on any skill.

## Platform Support

Primary development on **Windows 10** with Git Bash. The hooks and scripts are also tested on **macOS** — its stock bash 3.2 and BSD tools, with and without `jq` — and on **Linux**. All hooks use POSIX-compatible patterns (`grep -E`, not `grep -P`) and include fallbacks for missing tools. On Windows the plugin looks for Git Bash in the default install locations; set `OPENCODE_BASH` if yours is elsewhere. `notify.sh` uses PowerShell for Windows toast notifications and is a no-op elsewhere. Please file issues for any platform-specific breakage.

## Community

- **Discussions** — [GitHub Discussions](https://github.com/Donchitos/Claude-Code-Game-Studios/discussions) for questions, ideas, and showcasing what you've built
- **Issues** — [Bug reports and feature requests](https://github.com/Donchitos/Claude-Code-Game-Studios/issues)

---

## Supporting This Project

OpenCode Game Studios is free and open source. If it saves you time or helps you ship your game, consider supporting continued development:

<p>
  <a href="https://www.buymeacoffee.com/donchitos3"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>
  &nbsp;
  <a href="https://github.com/sponsors/Donchitos"><img src="https://img.shields.io/badge/GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors"></a>
</p>

- **[Buy Me a Coffee](https://www.buymeacoffee.com/donchitos3)** — one-time support
- **[GitHub Sponsors](https://github.com/sponsors/Donchitos)** — recurring support through GitHub

Sponsorships help fund time spent maintaining skills, adding new agents, keeping up with OpenCode and engine API changes, and responding to community issues.

---

*Built for OpenCode. Maintained and extended — contributions welcome via [GitHub Discussions](https://github.com/Donchitos/Claude-Code-Game-Studios/discussions).*

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <a href="#english">English</a> · <b>Русский</b>
</p>

# <a name="русский"></a>OpenCode Game Studios

<p align="center">
  Превращает одну сессию OpenCode в полноценную студию разработки игр.
  <br />
  49 агентов. 74 навыка. Одна согласованная команда ИИ.
</p>

> Это перевод README. Единственный источник истины — английская версия выше.
> Репозиторий: [cfyz1297/OpenCode-Code-Game-Studios](https://github.com/cfyz1297/OpenCode-Code-Game-Studios),
> порт [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) v1.2.0.

## Зачем это нужно

Строить игру в одиночку с ИИ — это мощно, но у одной сессии чата нет структуры.
Никто не мешает вам хардкодить магические числа, пропускать дизайн-документы или
писать спагетти-код. Здесь нет этапа QA, нет ревью дизайна, никто не спрашивает:
«а это вообще соответствует видению игры?»

**OpenCode Game Studios** решает это, давая вашей сессии структуру настоящей
студии. Вместо одного универсального помощника вы получаете 49
специализированных агентов, организованных в иерархию студии: директора,
которые охраняют видение, руководители отделов, которые отвечают за свои
домены, и специалисты, которые делают руками работу. У каждого агента есть
определённые обязанности, путь эскалации и контрольные точки качества.

Результат: все решения по-прежнему принимаете вы, но теперь у вас есть
команда, которая задаёт правильные вопросы, ловит ошибки рано и держит проект
в порядке от первого брейншторма до релиза.

---

## Содержание

- [Что входит в комплект](#что-входит-в-комплект)
- [Иерархия студии](#иерархия-студии)
- [Слэш-команды](#слэш-команды)
- [Это создаёт игры или документы?](#это-создаёт-игры-или-документы)
- [Начало работы](#начало-работы)
- [Настройка](#настройка)
- [Обновление](#обновление)
- [Структура проекта](#структура-проекта)
- [Как это работает](#как-это-работает)
- [Заметки о портировании на OpenCode](#заметки-о-портировании-на-opencode)
- [Философия дизайна](#философия-дизайна)
- [Кастомизация](#кастомизация)
- [Поддержка платформ](#поддержка-платформ)
- [Сообщество](#сообщество)
- [Поддержка проекта](#поддержка-проекта)
- [Лицензия](#лицензия)

---

## Что входит в комплект

| Категория | Количество | Описание |
|----------|-------|-------------|
| **Агенты** | 49 | Специализированные субагенты по дизайну, программированию, арту, звуку, нарративу, QA и продакшену |
| **Навыки** | 74 | Слэш-команды для каждой фазы процесса (`/start`, `/design-system`, `/create-epics`, `/create-stories`, `/dev-story`, `/story-done` и другие) |
| **Хуки** | 15 | Автоматическая валидация коммитов, пушей, изменений ассетов, чтения дизайн-документов, записей и реестров, жизненного цикла сессии, аудита агентов и поиска пробелов. Один из них (`validate-agent-artifact.sh`) не получает входных данных от OpenCode и остаётся спящим |
| **Правила** | 14 | Стандарты кодирования, привязанные к путям: применяются при правке геймплейного кода, движка, ИИ, UI, сетевого кода, сцен и ассетов |
| **Шаблоны** | 62 | Шаблоны документов для GDD, UX-спецификаций, ADR, планов спринтов, дизайна HUD, доступности и другого |

## Иерархия студии

Агенты организованы в три уровня — так же, как работают настоящие студии:

```
Уровень 1 — Директора
  creative-director    technical-director    producer

Уровень 2 — Руководители отделов
  game-designer        lead-programmer       art-director
  audio-director       narrative-director    qa-lead
  release-manager      localization-lead

Уровень 3 — Специалисты
  gameplay-programmer  engine-programmer     ai-programmer
  network-programmer   tools-programmer      ui-programmer
  systems-designer     level-designer        economy-designer
  technical-artist     sound-designer        writer
  world-builder        ux-designer           prototyper
  performance-analyst  devops-engineer       analytics-engineer
  security-engineer    qa-tester             accessibility-specialist
  live-ops-designer    community-manager
```

Каждый агент объявлен как `mode: subagent` и наследует модель, выбранную в
вашей сессии OpenCode. Модели на агента не пиннятся, поэтому студия работает на
том провайдере и модели, которые вы уже выбрали; уровни выражают старшинство
роли, а не тарификацию.

### Специалисты по движкам

В шаблоне есть наборы агентов для всех трёх основных движков. Используйте тот,
что подходит вашему проекту:

| Движок | Ведущий агент | Суб-специалисты |
|--------|-----------|-----------------|
| **Godot 4** | `godot-specialist` | GDScript, шейдеры, GDExtension |
| **Unity** | `unity-specialist` | DOTS/ECS, шейдеры/VFX, Addressables, UI Toolkit |
| **Unreal Engine 5** | `unreal-specialist` | GAS, Blueprints, репликация, UMG/CommonUI |

## Слэш-команды

Введите `/` в OpenCode, чтобы получить доступ ко всем 74 навыкам:

**Онбординг и навигация**
`/start` `/help` `/project-stage-detect` `/setup-engine` `/adopt` `/settings`

**Гейм-дизайн**
`/brainstorm` `/map-systems` `/design-system` `/quick-design` `/review-all-gdds` `/propagate-design-change`

**Арт и ассеты**
`/art-bible` `/asset-spec` `/asset-audit`

**UX и дизайн интерфейсов**
`/ux-design` `/ux-review`

**Архитектура**
`/create-architecture` `/architecture-decision` `/architecture-review` `/create-control-manifest`

**Истории и спринты**
`/create-epics` `/create-stories` `/dev-story` `/sprint-plan` `/sprint-status` `/story-readiness` `/story-done` `/estimate`

**Ревью и анализ**
`/design-review` `/code-review` `/balance-check` `/content-audit` `/scope-check` `/perf-profile` `/tech-debt` `/gate-check` `/consistency-check` `/security-audit`

**QA и тестирование**
`/qa-plan` `/smoke-check` `/soak-test` `/regression-suite` `/test-setup` `/test-helpers` `/test-evidence-review` `/test-flakiness` `/skill-test` `/skill-improve`

**Продакшен**
`/milestone-review` `/retrospective` `/bug-report` `/bug-triage` `/reverse-document` `/playtest-report`

**Релиз**
`/release-checklist` `/launch-checklist` `/changelog` `/patch-notes` `/hotfix` `/day-one-patch`

**Творчество и контент**
`/prototype` `/vertical-slice` `/onboard` `/localize`

**Оркестрация команды** (координация нескольких агентов на одной фиче)
`/team-combat` `/team-narrative` `/team-ui` `/team-release` `/team-polish` `/team-audio` `/team-level` `/team-live-ops` `/team-qa`

## Это создаёт игры или документы?

Справедливый вопрос, и ответ на него — измерение, а не пример проекта.
Четыре игры были сделаны по одному брифу на разных уровнях `modes.rigor`, и
посчитали документы, которые каждая написала **до первой строки игрового кода**:

| `modes.rigor` | Документов до первой строки игрового кода | Время |
|---|---:|---:|
| `minimal` | **1** (тот самый одностраничный бриф) | 0 мин |
| `standard` | 30 | 58 мин |

Все они дали работающую, протестированную игру. Два слепых ревьюера и
плейтест с человеком затем поставили сборку `standard` на **последнее** место:
лишние 29 документов купили прослеживаемость, но не лучшую игру.

### Оно запускает игру и смотрит на неё

Измерение выше — про стоимость. Вторая половина — работает ли вещь вообще, а
для игры это значит, что кто-то должен на неё *посмотреть*: проходящий тест
ничего не говорит о меню, нарисованном за экраном. Поэтому история, которая
меняет что-то видимое игроку, не закрывается, пока игра не запущена, не
пронаблюдена и пока в `production/qa/evidence/` не сохранён скриншот. Проверка
парсинга — это не запуск. Это действует на любом уровне rigor, включая
`minimal`, где автоматические тесты не требуются, а визуальная проверка — да.

Сами игры здесь сознательно **не** поставляются: это шаблон, который вы
клонируете под свой проект, а чужая игра в вашем репозитории — мусор, а не
доказательство.

## Начало работы

### Требования

- [Git](https://git-scm.com/)
- [OpenCode](https://opencode.ai) — установите CLI и войдите хотя бы в одного провайдера. Мост хуков рассчитан на V2 plugin API; на старой установке V1 агенты, навыки и команды работают, а хуки не загружаются
- [Python 3](https://www.python.org/) — читает `project.yaml` для каждого навыка и хука; без него любая настройка молча сваливается в значение по умолчанию
- Bash — запускает все хуки; встроен в macOS и Linux, а на Windows идёт вместе с [Git for Windows](https://git-scm.com/downloads/win). Плагин сам находит `C:\Program Files\Git\bin\bash.exe`, либо задайте `OPENCODE_BASH`
- **Рекомендуется**: [jq](https://jqlang.github.io/jq/) (для валидации в хуках)

Если необязательных инструментов нет, хуки деградируют мягко — вы просто теряете
часть валидации. Одно намеренное исключение: коммит, который стейджит data-JSON,
блокируется, если нет Python, чтобы этот JSON проверить.

### Установка

1. **Клонируйте или используйте как шаблон**:
   ```bash
   git clone https://github.com/cfyz1297/OpenCode-Code-Game-Studios.git my-game
   cd my-game
   ```
   Это дерево — порт
   [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios)
   v1.2.0 на OpenCode. Что именно изменено и что сознательно не изменено —
   в [PORT.md](PORT.md).

2. **Откройте OpenCode в корневой папке проекта** (там, где лежат `AGENTS.md`
   и `project.yaml`), и запустите сессию:
   ```bash
   opencode
   ```
   OpenCode загружает `opencode.jsonc`, агентов, навыки, слэш-команды и плагин
   хуков именно из этой папки. Если запустить из подпапки, конфигурация проекта
   обнаружится иначе.

3. **Выполните `/start`** — система спросит, где вы находитесь (нет идей, есть
   смутная задумка, есть чёткий дизайн, есть готовый проект) и направит вас в
   нужный процесс. Без предположений.

   Или перейдите сразу к нужной команде, если уже знаете, что нужно:
   - `/brainstorm` — исследовать идеи игры с нуля
   - `/setup-engine godot 4.7` — настроить движок, если вы уже выбрали
   - `/project-stage-detect` — проанализировать существующий проект

## Настройка

`project.yaml` в корне репозитория — единственный источник истины о том, как
студия ведёт себя на вашем проекте: движок, соглашения об именовании и блок
`modes`, который решает, сколько процесса требует каждый навык. `/start` пишет
его за вас; вручную править почти никогда не нужно.

Самый важный вопрос — **`modes.rigor`**: `minimal`, `standard` или `full`. Это
одна входная дверь над шестью отдельными ручками (`workflow` — какие разделы
GDD обязательны, `docs.density`, `qa.level`, `story_granularity`,
`review_mode` — сколько директоров ревьюят вашу работу, и `team.size`), поэтому
`/start` спрашивает один раз, а не шесть:

- **`minimal`** (по умолчанию) — скорость джема. GDD не обязательны, документы
  краткие, доказательства QA минимальны, ревью в одиночку. `/start` →
  `/setup-engine` → `/brainstorm` (одностраничный бриф) → `/create-stories` →
  `/dev-story` ↔ `/story-done`.
- **`standard`** — 5 обязательных разделов GDD, сбалансированная глубина
  документов, стандартные доказательства QA, лёгкое ревью.
- **`full`** — все 8 разделов GDD, подробные документы, полные доказательства
  QA для историй любого типа, полное ревью директоров.

`minimal` — значение по умолчанию, потому что тяжёлый уровень дороже ведёт к
рабочему коду, не давая лучшего результата, и ничего не возвращает, когда за
проект берётся новый человек. Поднимайте его одним вызовом `/settings`, когда
проект растёт — `/help` и `/gate-check` сами подскажут, когда увидят признаки.

Две лазейки не дают одной настройке быть грубым инструментом.
**`system_overrides`** держит одну систему на более высоком стандарте, чем
остальной проект: ваша боевая система получает полный процесс, пока всё
остальное остаётся лёгким. **`testing.strict`** задаёт для каждого типа тестов
(логика, интеграция, визуал, UI, конфиг), блокирует ли отсутствие доказательств
историю или только предупреждает.

Любую из шести ручек всё ещё можно задать отдельно, если нужен микс (например,
`workflow: full` с `docs.density: terse` — всесторонне, но компактно). Две из
них — `review_mode` (`full` / `lean` / `solo`) и `team.size` — ещё и
**личные**: rigor задаёт общий для команды дефолт, но вы можете переопределить
их для конкретного разработчика в игнорируемом git файле `project.local.yaml`,
не трогая общий конфиг. `modes.automation` (как часто ИИ останавливается, чтобы
спросить перед действием) стоит вне rigor и тоже переопределяется лично.

Посмотреть или изменить любую настройку можно навыком `/settings`:

```
/settings                              # посмотреть действующую конфигурацию
/settings modes.review_mode            # посмотреть одну настройку
/settings modes.rigor=full             # записать в project.yaml (для всей команды)
/settings --local modes.review_mode=solo   # записать в project.local.yaml (только вам)
```

Полная схема и поведение каждой настройки: `.opencode/docs/effects-map.md`.

## Обновление

Уже используете более старую версию этого шаблона? Смотрите
[UPGRADING.md](UPGRADING.md): пошаговые инструкции по миграции, разбор того, что
изменилось между версиями, и какие файлы безопасно перезаписать, а какие
требуют ручного слияния.

## Структура проекта

```
AGENTS.md                           # Мастер-конфигурация (её читает OpenCode)
opencode.jsonc                      # Инструкции, права, конфигурация плагина
.opencode/
  agents/                           # 49 определений агентов (markdown + YAML frontmatter)
  commands/                         # 74 слэш-команды (по обёртке на навык)
  skills/                           # 74 навыка (подпапка на навык)
  plugins/ccgs-hooks/               # Мост событий: события инструментов/сессий -> bash-хуки
  hooks/                            # 18 bash-скриптов, которые запускает мост
  rules/                            # 14 стандартов кодирования по путям (грузятся по необходимости)
  docs/
    workflow-catalog.yaml           # Определение 7-фазного процесса (читает /help)
    templates/                      # 62 шаблона документов (+ подсказки по разделам)
src/                                # Исходный код игры (Godot). Корень кода
                                    #   ЗАВИСИТ ОТ ДВИЖКА: Unity компилирует только
                                    #   Assets/, Unreal собирает из Source/<Module>/
assets/                             # Арт, звук, VFX, шейдеры, файлы данных
design/                             # GDD, нарративные документы, дизайн уровней
docs/                               # Техническая документация и ADR
tests/                              # Наборы тестов (юнит, интеграция, производительность, плейтест)
tools/                              # Инструменты сборки и пайплайна
prototypes/                         # Одноразовые прототипы (изолированы от src/)
production/                         # Планы спринтов, вехи, трекинг релиза
studio-tests/                       # QA для самих навыков и агентов — см. ниже
```

### Тестирование ваших изменений

CCGS — шаблон, который предполагается править. `studio-tests/` — это способ
проверить, что отредактированный или новый навык всё ещё держится: каталог всех
74 навыков и 49 агентов, рубрики качества по категориям, поведенческие
спецификации и шаблоны для написания собственных спецификаций.

```
/skill-test static [name]     # структурный линтер — 7 проверок соответствия
/skill-test category [name]   # рубрика качества для категории
/skill-test spec [name]       # проверки поведенческой спецификации
/skill-test audit             # отчёт о покрытии навыков и агентов
/skill-improve [name]         # цикл тест-фикс-перетест; сохраняет или откатывает по изменению оценки
```

Он тестирует **фреймворк**, а не вашу игру — тесты игры живут в `tests/`.

## Как это работает

### Координация агентов

Агенты следуют структурной модели делегирования:

1. **Вертикальное делегирование** — директора делегируют руководителям, руководители — специалистам
2. **Горизонтальные консультации** — агенты одного уровня могут советоваться друг с другом, но не принимают связывающих решений за пределами своего домена
3. **Разрешение конфликтов** — разногласия эскалируются к общему родителю (`creative-director` для дизайна, `technical-director` для технических вопросов)
4. **Распространение изменений** — сквозные изменения между отделами координирует `producer`
5. **Границы доменов** — агенты не меняют файлы вне своего домена без явного делегирования

### Совместная работа, а не автопилот

Это **не** автопилот. Каждый агент следует строгому протоколу сотрудничества:

1. **Спросить** — агенты задают вопросы до того, как предложить решение
2. **Показать варианты** — агенты дают 2–4 варианта с плюсами и минусами
3. **Вы решаете** — решение всегда за вами
4. **Черновик** — агенты показывают работу до финализации
5. **Утверждение** — ничего не записывается без вашего согласия

Контроль остаётся у вас. Агенты дают структуру и экспертизу, а не автономию.

Так ведёт себя сессия, запущенная в корне проекта, из коробки. Настройки
автоматизации `guided` и `autonomous` обменивают часть этих пауз на скорость;
`modes.automation` в `project.yaml` выбирает одну из них, а
[setup-requirements.md](.opencode/docs/setup-requirements.md) объясняет слой
прав, который за этим стоит.

### Автоматическая безопасность

**Хуки** запускаются автоматически через `.opencode/plugins/ccgs-hooks/`. Плагин
отображает события инструментов и сессий OpenCode на bash-скрипты в
`.opencode/hooks/`, поэтому скрипты остаются переносимыми, а вся обвязка — один
файл:

| Хук | Триггер в OpenCode | Что делает |
|------|------------------|--------------|
| `validate-commit.sh` | инструмент shell | Проверяет хардкод значений, формат TODO, валидность JSON, разделы дизайн-документов — выходит сразу, если команда не `git commit` |
| `validate-push.sh` | инструмент shell | Предупреждает о пушах в защищённые ветки, а также о `git tag`, `git merge`, `gh release`, `butler push` и `steamcmd +run_app_build` — выходит сразу для любой другой команды |
| `validate-read.sh` | инструмент read | Отказывает в чтении дизайн-документа больше 40 КБ целиком и возвращает его заголовки, чтобы повторное чтение взяло один раздел (`features.read_guard`) |
| `validate-write.sh` | инструменты write/edit | Предупреждает, но никогда не блокирует, если запись нарушит правило навыков: файл, который никогда не перезаписывается, защита конфига, граница прототипов, заморозка локализации |
| `validate-registry.sh` | инструменты write/edit | Предупреждает, если запись в реестр сущностей или TR-ID удалит или перенумерует запись, либо поставит статус, которого нет в заголовке реестра |
| `validate-assets.sh` | инструменты write/edit (после) | Проверяет JSON файлов данных в `assets/`, `Assets/` или `Content/`, и именование ассетов только в Godot-папке `assets/` — выходит сразу, если файл не в этих папках |
| `session-start.sh` | первый шаг модели в сессии | Показывает текущую ветку и последние коммиты для ориентировки |
| `detect-gaps.sh` | первый шаг модели в сессии | Определяет свежие проекты (подсказывает `/start`) и отсутствующие дизайн-документы, когда код или прототипы уже есть |
| `pre-compact.sh` | запрос компакции | Пишет компакцию в лог; запуск сессии повторится на следующем шаге и восстановит контекст |
| `notify.sh` | запрос разрешения | Показывает toast-уведомление Windows через PowerShell |
| `session-stop.sh` | простой сессии | Архивирует `active.md` в лог сессии и записывает активность git |
| `log-agent.sh` | вызов инструмента `subagent` | Начало аудита — логирует запуск субагента |
| `log-agent-stop.sh` | результат инструмента `subagent` | Конец аудита — завершает запись о субагенте |
| `validate-agent-artifact.sh` | не запускается | OpenCode не отдаёт путь к транскрипту субагента, поэтому у этой проверки нет входных данных. Оркестрирующий навык всё равно проверяет свой именованный артефакт |
| `validate-skill-change.sh` | инструменты write/edit (после) | Советует запустить `/skill-test` после любого изменения в `.opencode/skills/` |

> **Примечание**: хуки shell, read и write запускаются на каждом подходящем
> вызове инструмента и сразу выходят (код 0), если команда или путь файла не
> относятся к делу. Это нормальное поведение хуков, а не проблема
> производительности.

**Правила прав** живут в `opencode.jsonc`, а не в отдельном файле настроек
харнесса. Они спрашивают перед правками и большинством shell-команд,
автоматически разрешают команды только на чтение и собственные хелперы
репозитория, и запрещают force push, `rm -rf`, рекурсивный `Remove-Item`,
`reset --hard`, `clean -f`, чтение `.env` и правку бинарных ассетов. Шаблоны
запрета для `git` совпадают в любом месте команды, поэтому коммит-сообщение,
где просто встречается `push + pull`, тоже будет запрещено: переформулируйте.

### Правила по путям

Стандарты кодирования применяются автоматически в зависимости от расположения
файла. Плагин `ccgs-hooks` читает frontmatter `paths:` каждого правила и
подмешивает правило в первый раз, когда сессия читает или правит подходящий
файл, поэтому посторонняя работа за это не платит. Пути ниже — для Godot.
Каждое правило также покрывает раскладку Unity и Unreal: правила для кода
покрывают C# в `Assets/**/Gameplay/` и C++ в `Source/**/Gameplay/` (а также
`Core`, `AI`, `Networking`, `UI`), правила данных — JSON в
`Assets/**/Data/` и `Content/**/Data/`, шейдеры — по типу файла, тесты — C# в
`Assets/Tests/` и C++ в `Source/**/Tests/`.

| Путь | Что проверяет |
|------|----------|
| `src/gameplay/**` | Значения из данных, использование delta time, отсутствие ссылок на UI |
| `src/core/**` | Ноль аллокаций в горячих путях, потокобезопасность, стабильность API |
| `src/ai/**` | Бюджеты производительности, отлаживаемость, параметры из данных |
| `src/networking/**` | Авторитет сервера, версионирование сообщений, безопасность |
| `src/ui/**` | Никакого владения состоянием игры, готовность к локализации, доступность |
| `design/gdd/**` | Обязательные разделы по `modes.workflow`, формат формул, граничные случаи |
| `design/narrative/**` | Согласованность лора, голос персонажей, уровни канона |
| `assets/data/**/*.json` | Валидность JSON, соглашения об именовании, правила схемы |
| `assets/shaders/**` | Соглашения об именовании, цели производительности, кросс-платформенность |
| `**/*.tscn`, `**/*.tres` | Файлы сцен и ресурсов меняются в редакторе, где это возможно; правила безопасной ручной правки |
| `tests/**` | Именование тестов, требования к покрытию, паттерны фикстур |
| `prototypes/**` | Ослабленные стандарты, обязательный README, зафиксированная гипотеза |

## Заметки о портировании на OpenCode

Этот репозиторий — полный порт оригинального шаблона для Claude Code на
OpenCode. Полный набор изменений относительно upstream v1.2.0 —
переименования, добавления, отличия в поведении, что не подключено и как
посмотреть диф — в **[PORT.md](PORT.md)**.

Что переносится один к одному, а что нет:

| Возможность | Как в порту |
|---------|------|
| 49 агентов | Markdown-агенты в `.opencode/agents/`, `mode: subagent`, `steps` вместо `maxTurns`, права инструментов переведены в `permissions`. Выданный Write/Edit становится `edit: allow` (это и было пред-одобрение upstream), после чего идут три запрета на правку, чтобы `.env` и бинарные ассеты остались закрыты; отсутствующий инструмент становится `deny` |
| 74 навыка | `.opencode/skills/<id>/SKILL.md`, объявляются автоматически, как любой навык OpenCode |
| Слэш-команды | `.opencode/commands/<id>.md`, по одной на навык; команда загружает навык и передаёт ему аргументы |
| 15 хуков | Один плагин (`.opencode/plugins/ccgs-hooks/`, OpenCode V2 plugin API) запускает исходные bash-валидаторы; обвязки в `settings.json` нет |
| 14 правил по путям | Плагин подмешивает правило при первом совпавшем чтении или правке |
| Запреты опасных команд | Переведены в `permissions` в `opencode.jsonc`. Основная сессия спрашивает перед правкой или shell-командой; запись субагента пред-одобрена его собственным грантом, как было и в upstream |
| Пины модели на агента (opus/sonnet/haiku) | **Убраны**: каждый агент наследует модель сессии, поэтому студия не зависит от провайдера |
| `allowed-tools` на уровне навыка | **Не обеспечивается на уровне навыка**: права в OpenCode задаются на агента. Граница — грант самого агента |
| `isolation: worktree` у агента (prototyper) | **Недоступно**: субагенты OpenCode работают в той же рабочей копии |
| Shell-прелюдии `` !`…` `` в навыках | Переведены в явный шаг «выполните этот хелпер», который делает модель |
| Скрипт статус-строки (context%, стадия, эпик) | **Заменён** встроенной статус-строкой OpenCode; скрипт удалён |
| Toast при простое | **Не подключён**: в OpenCode нет события простоя; toast на запрос разрешения остался |
| Команды агентов (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`) | **Не перенесены**: используйте обычных субагентов; навыки team-* по-прежнему оркестрируют их последовательно |

Всё, что ниже таблицы соответствия — процесс, гейты, шаблоны, скрипты и логика
навыков — не изменено.

## Философия дизайна

Шаблон опирается на профессиональные практики разработки игр:

- **Фреймворк MDA** — анализ Mechanics, Dynamics, Aesthetics для гейм-дизайна
- **Теория самодетерминации** — автономия, компетентность, связанность как мотивация игрока
- **Дизайн состояния потока** — баланс сложности и навыка для вовлечённости
- **Типы игроков по Бартлу** — таргетинг и проверка аудитории
- **Разработка через верификацию** — сначала тесты, потом реализация

## Кастомизация

Это **шаблон**, а не запертый фреймворк. Всё предполагается менять:

- **Добавляйте и удаляйте агентов** — удалите файлы агентов, которые не нужны, добавьте новых под свои домены
- **Правьте промпты агентов** — настраивайте поведение, добавляйте знания о вашем проекте
- **Меняйте навыки** — подгоняйте процессы под то, как работает ваша команда
- **Добавляйте правила** — создавайте правила по путям под структуру папок проекта
- **Настраивайте хуки** — меняйте строгость валидации, добавляйте новые проверки
- **Выбирайте движок** — набор агентов Godot, Unity или Unreal (или никакой)
- **Настраивайте вес процесса** — `modes.rigor` и его ручки в `project.yaml` (см. [Настройка](#настройка)). Переопределяйте на один запуск через `--review solo` в любом навыке.

## Поддержка платформ

Основная разработка — на **Windows 10** с Git Bash. Хуки и скрипты также
проверяются на **macOS** — со штатным bash 3.2 и BSD-утилитами, с `jq` и без
него — и на **Linux**. Все хуки используют POSIX-совместимые паттерны
(`grep -E`, не `grep -P`) и содержат запасные пути на случай отсутствия
инструментов. На Windows плагин ищет Git Bash в стандартных местах установки;
задайте `OPENCODE_BASH`, если он у вас в другом месте. `notify.sh` использует
PowerShell для toast-уведомлений Windows и ничего не делает на других системах.
Сообщайте об ошибках, специфичных для платформы, через issues.

## Сообщество

- **Обсуждения** — [GitHub Discussions](https://github.com/Donchitos/Claude-Code-Game-Studios/discussions) для вопросов, идей и показа того, что вы сделали
- **Issues** — [баг-репорты и запросы возможностей](https://github.com/Donchitos/Claude-Code-Game-Studios/issues)

---

## Поддержка проекта

OpenCode Game Studios бесплатен и открыт. Если он экономит вам время или помогает
выпустить игру, поддержите дальнейшую разработку:

<p>
  <a href="https://www.buymeacoffee.com/donchitos3"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>
  &nbsp;
  <a href="https://github.com/sponsors/Donchitos"><img src="https://img.shields.io/badge/GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors"></a>
</p>

- **[Buy Me a Coffee](https://www.buymeacoffee.com/donchitos3)** — разовая поддержка
- **[GitHub Sponsors](https://github.com/sponsors/Donchitos)** — регулярная поддержка через GitHub

Спонсорство помогает оплачивать время на поддержку навыков, добавление новых
агентов, отслеживание изменений в OpenCode и API движков, и ответы сообществу.

---

*Сделано для OpenCode. Поддерживается и расширяется — вклад приветствуется через [GitHub Discussions](https://github.com/Donchitos/Claude-Code-Game-Studios/discussions).*

## Лицензия

MIT License. Подробности в [LICENSE](LICENSE).

