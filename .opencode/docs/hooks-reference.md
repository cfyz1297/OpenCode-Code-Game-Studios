# Active Hooks

The hook scripts live in `.opencode/hooks/` and are driven by one OpenCode
plugin, `.opencode/plugins/ccgs-hooks/index.js`. The scripts keep their original
Claude-shaped JSON input and exit-code contract; the plugin translates OpenCode
events into that contract. There is no `settings.json` wiring to edit: the plugin
loads automatically from `.opencode/plugins/`.

| OpenCode event | Hook scripts |
| ---- | ---- |
| `tool.execute.before` (`shell`) | `validate-commit.sh`, `validate-push.sh` |
| `tool.execute.before` (`write`, `edit`, `patch`) | `validate-registry.sh`, `validate-write.sh` |
| `tool.execute.before` (`read`) | `validate-read.sh` |
| `tool.execute.after` (`write`, `edit`, `patch`) | `validate-assets.sh`, `validate-skill-change.sh` |
| `tool.execute.before`/`after` (`subagent`) | `log-agent.sh`, `log-agent-stop.sh` |
| session context request, first step | `session-start.sh`, `detect-gaps.sh` |
| compaction request | `pre-compact.sh` (re-arms session start for the next step) |
| `session.idle` | `session-stop.sh` |
| `permission.asked` | `notify.sh` |

The hook table below describes what each script does. Its "Event" column names
the original Claude event; the mapping table above is what actually fires.

| Hook | Event | Trigger | Action |
| ---- | ----- | ------- | ------ |
| `validate-commit.sh` | PreToolUse (Bash, PowerShell) | `git commit` commands | Validates design doc sections, JSON data files, hardcoded values, TODO format |
| `validate-push.sh` | PreToolUse (Bash, PowerShell) | `git push`, `git tag`, `git merge` and release commands | Warns on pushes to protected branches (`main`, `master` and `release/*`), and on the steps that ask first: `git tag` (not a listing), `git merge` (not `--abort`), `gh release`, `butler push` and `steamcmd` with `+run_app_build`. Which commands count is `bash .opencode/scripts/write-guard.sh git` |
| `validate-registry.sh` | PreToolUse (Write/Edit) | Writes and edits of `design/registry/entities.yaml` and `docs/architecture/tr-registry.yaml` | Warns, and never blocks, when the change would delete or renumber an entry or set a status outside the values the file's header lists. It runs before the write, while the old file can still be compared; the check itself is `bash .opencode/scripts/registry.sh compare`. The skills that write a registry also run `registry.sh validate` after writing, because hooks do not run in every tool |
| `validate-write.sh` | PreToolUse (Write/Edit) | Writes and edits the rules below name | Warns, and never blocks, when a write would replace a file skills never overwrite (an existing `EPIC.md`, `project.godot`, `tests/helpers/*`, the tech-debt register, an engine reference doc, the files `/test-setup` creates), set a config value outside its list or a key `project.local.yaml` cannot hold, set the review mode, leave a prototype file without its `PROTOTYPE` or `VERTICAL SLICE` header or reach between `prototypes/` and the code root, change a string table during an active freeze, or, from a subagent, write anything but a new file under `production/`, `docs/` or `tests/`. The check is `bash .opencode/scripts/write-guard.sh check`, which the skills that write these files also run themselves |
| `validate-read.sh` | PreToolUse (Read) | A Read with no offset and no limit under `design/`, `docs/architecture/` or `production/session-state/` | Blocks a whole-file read of a doc over 40 KB (`features.read_guard_kb`) and answers with the doc's headings by line, so the retry reads one section; a ranged read always passes. `features.read_guard: off` turns it off. The check is `bash .opencode/scripts/read-guard.sh check` |
| `validate-agent-artifact.sh` | SubagentStop | A subagent stops | Warns you, and never blocks, when the file its return contract named ("Write your full output to `<path>`") is not on disk, a failed phase however its reply reads. **OpenCode does not expose a subagent transcript path**, so this check cannot inspect the contract here; the orchestrator still checks the path itself. |
| `validate-assets.sh` | PostToolUse (Write/Edit) | Asset file changes | Checks data-file JSON under `assets/`, `Assets/` or `Content/`, and asset naming in Godot's `assets/` only |
| `session-start.sh` | SessionStart | Session begins | Loads sprint context, milestone, git activity; detects and previews active session state file for recovery, with one line when its checkpoint names a different branch from the one you are on; one line when a newer release is out, from a cache `update-check.sh` refreshes in the background at most once a day (`updates.check` in `effects-map.md`) |
| `detect-gaps.sh` | SessionStart | Session begins | Detects fresh projects (suggests /start) and missing documentation when code/prototypes exist, suggests /reverse-document or /project-stage-detect |
| `pre-compact.sh` | PreCompact | Context compression | Appends one line to `production/session-logs/compaction-log.txt` and prints nothing: OpenCode does not add PreCompact output to the conversation. `session-start.sh`, which runs again after every compaction, is what restores context |
| `notify.sh` | Notification (`permission_prompt`) | A permission prompt opens | Shows Windows toast notification via PowerShell. OpenCode has no idle-prompt event, so the idle reminder is not wired |
| `session-stop.sh` | `session.idle` | **Every response ends** — not once per session | Updates the session log and writes the subagent spawn tally to `production/session-logs/session-cost.md`; prints nothing. Archives `active.md` only when its content hash changed; without that guard a long session appended the whole file on every turn. Runs in the background, so the turn does not wait for it |
| `log-agent.sh` | `tool.execute.before` (`subagent`) | Agent spawned | Audit trail start — logs subagent invocation with timestamp and session id |
| `log-agent-stop.sh` | `tool.execute.after` (`subagent`) | Agent stops | Audit trail stop — completes subagent record |
| `validate-skill-change.sh` | PostToolUse (Write/Edit) | Skill file changes | Advises running `/skill-test` after any `.opencode/skills/` file is written or edited |

Warnings from the `validate-*` hooks are shown to you and appended to the tool
result the model sees, as hook JSON (`hook_warn` in `yaml-helper.sh`); only a
problem that must be fixed now exits 2, and the read guard's refusal. See
`hooks-reference/hook-input-schemas.md` for why stderr is not enough.

### Subagent cost visibility

The three hooks above form one chain. `log-agent.sh` writes a record per spawn
to `production/session-logs/agent-audit.log` in a fixed three-field shape:

```
YYYYMMDD_HHMMSS | <session_id> | Agent invoked: <agent_type>
```

`session-stop.sh` greps the literal string `" | $SESSION_ID | Agent invoked: "`
to tally the current session, then writes a count plus a per-agent breakdown to
`production/session-logs/session-cost.md`.

The field order of that record is fixed. `session-stop.sh` matches it literally,
so a different order silently zeroes the spawn count instead of raising an error.

When the hook input has no session id, `session-stop.sh` writes no total. A
total spanning every session in the log would look plausible and be wrong, which
is worse than none.

`agent_type` — not `agent_name` — is the field carrying the agent name. See
`hooks-reference/hook-input-schemas.md`.

## Fidelity notes

The bridge reproduces every hook the runtime can express. Three things differ:

| Item | Why |
| ---- | --- |
| `validate-agent-artifact.sh` transcript scan | OpenCode does not expose a subagent transcript path, so the hook receives an empty one and stays silent. The orchestrating skill still checks its named artifact. |
| Idle-prompt notification | OpenCode has no "idle about a minute" event. The permission-prompt toast is wired to `permission.asked`. |
| `SubagentStart` on resume / agent-team messages | OpenCode emits one `subagent` tool call per spawn. Resume-style spawns are not a separate event, so the audit trail counts actual launches only. |

Hook input stays Claude-shaped on purpose: `.opencode/docs/hooks-reference/hook-input-schemas.md`
and the scripts themselves are shared with the upstream template. The plugin is
the only place that knows about OpenCode.

To add a hook, register it in `.opencode/plugins/ccgs-hooks/index.js` and keep
its state in `.opencode/hooks/` or `.opencode/scripts/`; do not reintroduce a
harness-specific event file.

Hook reference documentation: `.opencode/docs/hooks-reference/`
Hook input schema documentation: `.opencode/docs/hooks-reference/hook-input-schemas.md`
