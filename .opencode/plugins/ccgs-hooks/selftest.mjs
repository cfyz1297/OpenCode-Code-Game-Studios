import assert from "node:assert/strict"
import plugin, { expandBraces, globToRegExp } from "./index.js"

const match = (glob, file) => expandBraces(glob).some((p) => globToRegExp(p).test(file))

assert.equal(match("src/gameplay/**", "src/gameplay/combat/melee.gd"), true)
assert.equal(match("src/gameplay/**", "src/ui/hud.gd"), false)
assert.equal(match("Assets/**/{Gameplay,gameplay}/**/*.cs", "Assets/Scripts/Gameplay/Combat/Hit.cs"), true)
assert.equal(match("Assets/**/{Gameplay,gameplay}/**/*.cs", "Assets/Scripts/UI/Hud.cs"), false)
assert.equal(match("Source/**/{Gameplay,gameplay}/**/*.{h,cpp}", "Source/Game/Gameplay/AI/Agent.cpp"), true)
assert.equal(match("**/*.tscn", "levels/forest.tscn"), true)
assert.equal(match("**/*.tscn", "levels/forest.tres"), false)
assert.equal(match("design/gdd/**", "design/gdd/combat.md"), true)
assert.equal(match("*.env*", ".env.local"), true)

// Wiring test: run the real hooks through the plugin with a fake host.
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const hooks = {}
const injected = []
const fake = {
  location: { directory: resolve(dirname(fileURLToPath(import.meta.url)), "../../..") },
  tool: { hook: async (name, fn) => void (hooks[name] = fn) },
  session: {
    hook: async (name, fn) => void (hooks["session." + name] = fn),
    instructions: { entry: { put: async (input) => void injected.push(input) } },
  },
  event: {
    subscribe: async function* () {},
  },
}
await plugin.setup(fake)

const event = {
  tool: "shell",
  sessionID: "ses_test",
  agent: "build",
  messageID: "msg_test",
  id: "call_test",
  input: { command: "git push origin main" },
}
await hooks["execute.before"](event)
const result = { content: "ok" }
await hooks["execute.after"]({ ...event, status: "completed", result })
assert.match(result.content, /Push to protected branch/)

const request = { sessionID: "ses_test", agent: "build", model: {}, system: [], messages: [], options: {} }
await hooks["session.context"](request)
assert.ok(request.system.length > 0)
assert.match(request.system[0].text, /Session Context/)

// Path-scoped rules: a gameplay read injects gameplay-code once, and only once.
const readEvent = (file) => ({ tool: "read", sessionID: "ses_rules", agent: "build", messageID: "m", id: "r", input: { path: file } })
await hooks["execute.before"](readEvent("src/gameplay/combat/melee.gd"))
const gameplay = injected.filter((i) => i.key === "ccgs-rule:gameplay-code")
assert.equal(gameplay.length, 1)
assert.match(gameplay[0].value, /Gameplay Code Rules/)
await hooks["execute.before"](readEvent("src/gameplay/combat/hit.gd"))
assert.equal(injected.filter((i) => i.key === "ccgs-rule:gameplay-code").length, 1)
await hooks["execute.before"](readEvent("design/gdd/combat.md"))
assert.equal(injected.filter((i) => i.key === "ccgs-rule:design-docs").length, 1)
assert.equal(injected.filter((i) => i.key === "ccgs-rule:ui-code").length, 0)

console.log("ccgs-hooks self-test: ok")
