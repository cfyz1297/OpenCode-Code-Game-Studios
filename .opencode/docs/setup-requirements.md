# Setup Requirements

This template requires a few tools to be installed for full functionality.
Hooks carry on without an optional tool and lose only the check it powers. The
required ones are required: without Python 3 every setting falls back to its
default and a commit that stages data JSON is blocked, and without Bash no hook
runs at all.

## Required

| Tool | Purpose | Install |
| ---- | ---- | ---- |
| **Git** | Version control, branch management | [git-scm.com](https://git-scm.com/) |
| **OpenCode** | AI agent CLI | See [opencode.ai](https://opencode.ai). Install the CLI and sign in to at least one provider. |
| **Python 3** | Reads `project.yaml` for every skill and hook | [python.org](https://www.python.org/). Without it every setting silently falls back to its default, and a commit that stages data JSON is blocked because it cannot be validated |
| **Bash** | Runs every hook | Built into macOS and Linux. On Windows, install [Git for Windows](https://git-scm.com/downloads/win) — OpenCode runs without it, but no CCGS hook does |

## Recommended

| Tool | Used By | Purpose | Install |
| ---- | ---- | ---- | ---- |
| **jq** | Hooks | JSON parsing in commit/push/asset/agent hooks | See below |

### Installing jq

**Windows** (any of these):
```
winget install jqlang.jq
choco install jq
scoop install jq
```

**macOS**:
```
brew install jq
```

**Linux**:
```
sudo apt install jq     # Debian/Ubuntu
sudo dnf install jq     # Fedora
sudo pacman -S jq       # Arch
```

## Platform Notes

### Windows
- Git for Windows includes **Git Bash**, which provides the `bash` executable
  used by the hook scripts
- The `ccgs-hooks` plugin already looks in the default Git install locations.
  If yours is elsewhere, set `OPENCODE_BASH` (or `OPENCODE_GIT_BASH_PATH`) to its
  `bash.exe` in the environment you start OpenCode from
- Skills call helpers as `bash .opencode/hooks/…` and `bash .opencode/scripts/…`.
  If `bash` is not on `PATH`, add `<Git>\bin` to `PATH` so those calls work too

### macOS / Linux
- Bash is available natively
- Install `jq` via your package manager for full hook support

## Verifying Your Setup

Run these commands to check prerequisites:

```bash
git --version          # Should show git version
bash --version         # Should show bash version
jq --version           # Should show jq version (optional)
python --version       # Required: Python 3 (python3 or py also work)
```

## What Happens Without Optional Tools

| Missing Tool | Effect |
| ---- | ---- |
| **jq** | Nothing is lost: every hook falls back to `grep` to read its JSON input. jq is only more robust with unusual input. |
| **Python 3** | Not optional (see Required). Every setting falls back to its default, because `project.yaml` is read through Python; the asset hook skips JSON validation and says so; a commit that stages data JSON is blocked. |
| **Both** | As without Python. |

## Permissions

`opencode.jsonc` at the repo root ships the project's permission rules:

- edits ask for approval;
- most shell commands ask, while read-only commands and the repo's own helpers
  (`bash .opencode/hooks/*`, `bash .opencode/scripts/*`) are allowed;
- force push, `rm -rf`, recursive `Remove-Item`, `reset --hard`, `clean -f`,
  `.env` reads and binary asset edits are denied.

Rules are evaluated in order and the last match wins, so a `deny` near the end of
the array beats an earlier `allow`. Personal exceptions belong in your global
config (`~/.config/opencode/opencode.jsonc`); see `personal-overrides.md`.

The ask-first behaviour is a permission rule, not a guarantee. These routes go
around it:

- **Starting in a subfolder** such as `design/` or the code root (`src/`,
  `Assets/` or `Source/`, depending on the engine). OpenCode discovers project
  config from the folder it starts in; start at the root so `opencode.jsonc`,
  the agents, the commands and the plugin all load.
- **Switching to the `plan` agent** for read-only exploration is intentional and
  safe: plan denies edits. Switching the session to a wider permission set is a
  deliberate choice, not the shipped default.
- **Answering "Allow always"** saves a project-scoped allow rule. It never
  overrides a configured `deny`.

In a session that accepts edits without asking, the framework's "May I write?"
is an instruction to the model, not a stop.

## Performance and Compaction

CCGS ships no runtime tuning of its own. Model choice, context compaction and
provider settings are OpenCode settings; configure them in your global or
project `opencode.jsonc` per [the OpenCode docs](https://opencode.ai/v2/docs/config).
`modes.rigor` and its six knobs in `project.yaml` control how much *process* the
skills enforce, not how the runtime behaves.

## Recommended IDE

OpenCode ships a terminal UI, a desktop app and integrations for editors. The
template is editor-agnostic:
- **OpenCode TUI** — the primary surface, and what the slash-command list targets
- **VS Code / Cursor** — any OpenCode integration you use
- The repository is plain Markdown, JSON and bash beyond that
