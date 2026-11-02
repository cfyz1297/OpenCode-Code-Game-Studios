# OpenCode Game Studios -- Game Studio Agent Architecture

Indie game development managed through 49 coordinated OpenCode subagents.
Each agent owns a specific domain, enforcing separation of concerns and quality.

## OpenCode Runtime

This template runs on OpenCode, not on a provider-specific harness. The pieces
that make the studio work are:

- `opencode.jsonc` — project config: `instructions`, `permissions`, `plugins`.
- `.opencode/agents/` — 49 subagents (frontmatter uses OpenCode's `mode`,
  `steps`, and `permissions`; every agent inherits the session model).
- `.opencode/skills/` — 74 skills, auto-advertised to the model.
- `.opencode/commands/` — one slash command per skill (`/start`, `/dev-story`, …).
- `.opencode/plugins/ccgs-hooks/` — the event bridge that runs the bash
  validators in `.opencode/hooks/` and loads path-scoped rules from
  `.opencode/rules/`.
- `.opencode/scripts/` — deterministic helpers the skills call directly.

Hooks and validators still speak the Claude-shaped JSON contract described in
`.opencode/docs/hooks-reference.md`; the bridge translates OpenCode tool events
into that contract, so the scripts themselves stay portable.

## Technology Stack

- **Engine**: [CHOOSE: Godot 4 / Unity / Unreal Engine 5]
- **Language**: [CHOOSE: GDScript / C# / C++ / Blueprint]
- **Version Control**: Git with trunk-based development
- **Build System**: [SPECIFY after choosing engine]
- **Asset Pipeline**: [SPECIFY after choosing engine]

> **Note**: Engine-specialist agents exist for Godot, Unity, and Unreal with
> dedicated sub-specialists. Use the set matching your engine.

## Project Structure

`.opencode/docs/directory-structure.md` — loaded on every session through the
`instructions` array in `opencode.jsonc`.

## Engine Version Reference

`docs/engine-reference/<engine>/VERSION.md` — loaded on every session through
the `docs/engine-reference/...` entry in `opencode.jsonc`. It defaults to Godot
(the template's example engine); `/setup-engine` rewrites that entry for the
chosen engine, so a Unity or Unreal project stops loading the Godot reference.
Skills that need the pinned version read `docs/engine-reference/<engine>/VERSION.md`
on demand regardless of this entry.


## Technical Preferences

`project.yaml` at the repo root is the primary config store — engine, specialists,
naming, platform, performance, modes. Skills resolve it via `resolve_config`
(see `.opencode/docs/config-resolution.md`).

`.opencode/docs/technical-preferences.md` is the **legacy fallback**, read on demand
when a key is absent from `project.yaml`. It is not imported here: before
`/setup-engine` runs it is almost entirely `[TO BE CONFIGURED]` placeholders, and
after it runs `project.yaml` holds the real values.

## Coordination Rules

`.opencode/docs/coordination-rules.md` — loaded through `opencode.jsonc`.

## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
  (exempt: `active.md` appends, agent memory, a subagent's new file at the path
  its orchestrating skill named; see `.opencode/rules/agent-memory.md`)
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction
- A skipped or dismissed question is not an answer: act on nothing, re-ask in
  plain text and wait
- Started outside this file's folder? Warn first: hooks, deny rules and the
  ask-first mode load only when OpenCode starts in the project root

See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol and examples.

> **First session?** If the project has no engine configured and no game concept,
> run `/start` to begin the guided onboarding flow.

## Coding Standards

`.opencode/docs/coding-standards.md` — loaded through `opencode.jsonc`.

## Context Management

Read `.opencode/docs/context-management.md` on demand — it is a reference, not
session context. Two of its conventions are load-bearing and cited by name
elsewhere in the repo, so they are restated here rather than lost:

- **`production/session-state/active.md` is the session checkpoint.** The file is
  the memory, not the conversation. Read it first after any compaction, crash, or
  a fresh session.
- **Helpers in `.opencode/scripts/` emit observations, never verdicts.** A script
  that scores or judges will eventually contradict a mode or override it cannot
  see. (Cited by `artifact-check.sh` and `adr-dep-graph.sh`.)
