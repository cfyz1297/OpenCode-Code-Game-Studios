# Path-Specific Rules

Rules in `.opencode/rules/` carry `paths:` frontmatter. The `ccgs-hooks` plugin
checks those globs on every `read`, `write`, `edit` and `patch` call and injects
a rule the first time a session touches a matching file. It also injects on a
write, so a brand-new file gets the rule even when no existing file in that
folder was opened.

Three consequences:

1. **Context, not enforcement.** A loaded rule is guidance the model weighs, the
   same as `AGENTS.md`. Anything that must hold regardless of what the model
   decides belongs in a hook — `.opencode/hooks/` already enforces JSON validity
   and commit shape that way.
2. **Loaded once per session.** The plugin remembers which rules a session has
   seen. A rule that matches later files is not re-injected.
3. **A rule with no `paths:` loads every session**, at the same priority as
   `AGENTS.md`. That is the lever for a rule that must always apply; it costs
   context in every session, so it is a deliberate trade, not a default.

Where a rule duplicates guidance an agent definition already carries, the two
must agree. Contradicting instructions are resolved arbitrarily, so a rule and
an agent stating different versions of the same standard is worse than either
alone.

To see which instruction files loaded, run `bash .opencode/hooks/log-instructions.sh`
(the opt-in diagnostic) — it records every instruction file and its load reason
to `production/session-logs/instructions-loaded.log`. Nothing calls it
automatically.

**Globs match regardless of case.** The plugin compiles `paths:` to a
case-insensitive matcher, so `Assets/**/UI/**` also matches a Godot project's
`assets/ui/` art. That is why the Unity and Unreal code globs below name their
file types.

Paths are listed Godot · Unity · Unreal. Folder names are shown in one case;
each rule's own globs list the case variants (`{AI,Ai,ai}`).

| Rule File | Path Pattern | Enforces |
| ---- | ---- | ---- |
| `gameplay-code.md` | `src/gameplay/**` · `Assets/**/Gameplay/**/*.cs` · `Source/**/Gameplay/**/*.{h,cpp}` | Data-driven values, delta time, no UI references |
| `engine-code.md` | `src/core/**` · `Assets/**/Core/**/*.cs` · `Source/**/Core/**/*.{h,cpp}` | Zero allocs in hot paths, thread safety, API stability |
| `ai-code.md` | `src/ai/**` · `Assets/**/AI/**/*.cs` · `Source/**/AI/**/*.{h,cpp}` | Performance budgets, debuggability, data-driven params |
| `network-code.md` | `src/networking/**` · `Assets/**/Network(ing)/**/*.cs` · `Source/**/Network(ing)/**/*.{h,cpp}` | Server-authoritative, versioned messages, security |
| `ui-code.md` | `src/ui/**` · `Assets/**/UI/**/*.cs` · `Source/**/UI/**/*.{h,cpp}` | No game state ownership, localization-ready, accessibility |
| `design-docs.md` | `design/gdd/**` | Required sections per `modes.workflow` (8 at `full`, 5 at `standard`), formula format, edge cases |
| `narrative.md` | `design/narrative/**` | Lore consistency, character voice, canon levels |
| `data-files.md` | `assets/data/**/*.json` · `Assets/**/Data/**/*.json` · `Content/**/Data/**/*.json` | JSON validity, naming conventions, schema rules |
| `test-standards.md` | `tests/**` · `Assets/Tests/**/*.cs` · `Source/**/Tests/**/*.{h,cpp}` | Test naming, coverage requirements, fixture patterns |
| `prototype-code.md` | `prototypes/**` | Relaxed standards, README required, hypothesis documented |
| `shader-code.md` | `assets/shaders/**`, `**/*.gdshader` · `Assets/**/*.{shader,hlsl,cginc,compute,shadergraph}` · `Shaders/**`, `**/*.{usf,ush}` | Naming conventions, performance targets, cross-platform rules |
| `scene-files.md` | `**/*.tscn`, `**/*.tres` · `**/*.unity`, `**/*.prefab`, `Assets/**/*.asset` · — | Hand-edit limits for editor-written scene and asset files; Unreal `.uasset`/`.umap` are binary, and `opencode.jsonc` denies edits to them |
| `agent-memory.md` | `.opencode/agent-memory/**` | The one place an agent may write unasked — and why a temporary absence must never be recorded as a durable fact |
| `skill-authoring.md` | `.opencode/skills/**`, `.opencode/agents/**` | A check must be able to report that it did not run — the five obligations for verdicts, defaults, skips, sourcing and derived coverage |

Each engine-facing rule loads on all three engines:

- **Code rules** (`gameplay`, `engine`, `ai`, `network`, `ui`) match
  `Assets/**/<System>/**/*.cs` and `Source/**/<System>/**/*.{h,cpp}` (`Core`,
  `AI`, `Networking`/`Network`, `UI` for the others).
- **`data-files.md`** matches `Assets/**/Data/**/*.json` and `Content/**/Data/**/*.json`
  — JSON only, so C# or C++ in a `Data/` folder does not pick up its file-naming rule.
- **`shader-code.md`** matches shader files by type: `.gdshader`, `.shader`,
  `.hlsl`, `.cginc`, `.compute`, `.shadergraph`, `.usf`, `.ush`, plus `Shaders/**`.
- **`test-standards.md`** matches `Assets/Tests/**/*.cs` and `Source/**/Tests/**/*.{h,cpp}`.
- **`scene-files.md`** is the exception: Godot and Unity scene and asset files are text and have
  rules; Unreal's are binary, so a deny rule blocks edits instead of a rule guiding them.

> **`skill-authoring.md` is the odd one out and deliberately so.** Every other
> rule here scopes a *game* directory; that one scopes the **framework's own**
> authoring paths. It exists because one failure shape kept recurring across
> unrelated subsystems — a step that could not run producing output
> indistinguishable from a step that ran and found nothing. The same mistake in
> nine places is a missing design rule, not nine mistakes.
