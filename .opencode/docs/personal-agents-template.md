# Personal AGENTS.md Template

OpenCode loads one global instruction file, `~/.config/opencode/AGENTS.md`, in
every project, plus the project's own `AGENTS.md`. It does **not** read an
`AGENTS.local.md` from the repo root.

Use the global file for preferences that follow you across projects; use
`project.local.yaml` for personal process settings inside this project (see
`personal-overrides.md`).

```markdown
# Personal Preferences

## Workflow Preferences
- Always run tests after code changes
- Compact context proactively before a long task
- Start unrelated work in a new session

## Local Environment
- Python command: python (or py / python3)
- Shell: Git Bash on Windows
- Editor: whatever OpenCode is attached to

## Communication Style
- Keep responses concise
- Show file paths in all code references
- Explain architectural decisions briefly

## Personal Shortcuts
- When I say "review", run /code-review on the last changed files
- When I say "status", show git status + sprint progress
```

## Setup

1. Copy the block above into `~/.config/opencode/AGENTS.md` (create the file if
   it does not exist).
2. Edit to match your preferences.
3. Keep project-wide rules in the repo's `AGENTS.md` and commit them; the global
   file is for you alone and never enters the repository.
