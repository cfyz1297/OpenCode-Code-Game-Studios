# Parallel Work

> On-demand reference. Demoted out of `coordination-rules.md` (an always-loaded
> AGENTS.md instruction) in v1.1 — read this when actually considering parallel
> work, not on every turn.

OpenCode has no "agent teams" feature. The supported parallelisms are:

- **Subagents** launched by the primary agent, one child session each. They run
  foreground or background and report back to the parent.
- **Several sessions** in the TUI, each with its own context window and token
  budget, coordinated by you in the tab strip.

## Use parallel work when

- Work spans multiple subsystems that will not touch the same files
- Each workstream would take >30 minutes and benefits from true parallelism
- A senior role (technical-director, producer) coordinates 3+ specialists on
  different epics simultaneously

## Do not use parallel work when

- One session's output is required as input for another (run subagents in order)
- The task fits in a single session's context (use one subagent instead)
- Cost is a concern — each session burns tokens independently

## Boundaries

Two sessions editing the same file will race. The repo's `git worktree` setup and
the worktree-per-feature habit are the safe way to run writers in parallel; a
reviewer or analyst session can share the checkout. The `ccgs-hooks` plugin does
not coordinate across sessions, and `production/session-state/active.md` is a
single shared checkpoint — do not run two writers that both update it.
