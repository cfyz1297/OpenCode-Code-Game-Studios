# Model Selection

OpenCode selects a model per session. Every subagent and every skill runs on
that model unless a definition sets a different one.

## This template's default: inherit

The 49 agents in `.opencode/agents/` declare no `model:`, and the 74 skills keep
their old `model:` lines only as historical metadata (OpenCode ignores them).
Consequences:

- one provider and one model power the whole studio;
- switching model mid-session switches the whole studio;
- there is no hidden Opus/Sonnet/Haiku spend split;
- context-window size is whatever the session's model has.

The tiers in the upstream template expressed seniority of role, not a required
model. That intent survives in the agent prompts and delegation map.

## Pinning a subagent (optional)

If you want one agent on a different model, add a line to its frontmatter:

```yaml
model: anthropic/claude-sonnet-5-5
```

Use `provider/model`, optionally with `#variant`. Do not guess the ID: list the
models your OpenCode install can see and copy the exact value. A subagent uses
its own model when set, otherwise the parent session's.

## Pinning a command (optional)

A command can force a model for one slash invocation:

```yaml
---
description: Deep architecture review
model: anthropic/claude-opus-5#high
---
```

Model selection order: command `model`, then the selected agent's `model`, then
the current session model. Because all 74 commands were generated without a
model, they follow the session.
