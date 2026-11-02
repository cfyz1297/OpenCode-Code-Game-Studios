# Personal Overrides

OpenCode has no per-project `settings.local.json`. Personal preferences have two
supported homes:

- **Global config** — `~/.config/opencode/opencode.jsonc`, merged into every
  project. Use it for permission rules and plugins you want everywhere.
- **Project config** — `opencode.jsonc` at the repo root. It is shared with the
  team, so do not put personal choices here.

The studio's own per-developer settings (`modes.review_mode`,
`modes.automation`, `testing.strict.*`, …) live in a gitignored
`project.local.yaml` and are documented in `effects-map.md`. That file is the
right place for "just me" process choices; it does not affect tool permissions.

## Personal permission rules

Add rules to the global config. Later rules win, and a `deny` cannot be
overridden by a project `allow`.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": [
    { "action": "shell", "resource": "git add *", "effect": "allow" },
    { "action": "shell", "resource": "git commit *", "effect": "allow" },
    { "action": "shell", "resource": "npm run *", "effect": "allow" }
  ]
}
```

Keep the `*` after the subcommand: `git commit *` allows commits, `git *` would
also allow `git push`. The project's own deny rules in `opencode.jsonc` still
apply after the global array.

## Read-only work

OpenCode has agents, not Claude Code permission modes. For review work, switch to
the built-in **plan** agent: it explores and reads but does not edit project
files. For prototyping, keep the `build` agent and approve edits as they come;
there is no per-directory accept-edits mode, so the `prototypes/` rule in
`opencode.jsonc` is the boundary that matters.

## Personal hooks

There is no hook block in a settings file. Write a small plugin instead — either
in the project (`.opencode/plugins/my-hook/index.js`) or globally in
`~/.config/opencode/plugins/`. The project's own bridge in
`.opencode/plugins/ccgs-hooks/index.js` is the worked example: register
`ctx.tool.hook("execute.after", …)`, `ctx.session.hook("context", …)` or
subscribe to `ctx.event.subscribe({ types: [...] })`.

A `session.idle` subscription is the equivalent of the old `Stop` hook: it fires
at the end of every response, not once per session.
