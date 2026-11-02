// Bridges OpenCode tool/session events to the Claude-shaped bash hooks in
// .opencode/hooks. The hook scripts stay upstream-compatible; this file owns the
// translation, so porting a script never means rewriting its logic.
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { readdir, readFile } from "node:fs/promises"
import { join, relative, isAbsolute } from "node:path"

const HOOK_TIMEOUT = 15000

// Windows does not put Git Bash on PATH by default; the template's hooks are
// POSIX shell, so find the bundled executable before giving up.
function bashPath() {
  if (process.platform !== "win32") return "bash"
  const candidates = [
    process.env.OPENCODE_BASH,
    process.env.OPENCODE_GIT_BASH_PATH,
    process.env.CLAUDE_CODE_GIT_BASH_PATH,
    "C:\\Program Files\\Git\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Programs", "Git", "bin", "bash.exe"),
    process.env.ProgramW6432 && join(process.env.ProgramW6432, "Git", "bin", "bash.exe"),
  ].filter(Boolean)
  return candidates.find((p) => existsSync(p)) ?? "bash"
}

export function expandBraces(pattern) {
  const m = pattern.match(/\{([^{}]+)\}/)
  if (!m) return [pattern]
  return m[1].split(",").flatMap((part) => expandBraces(pattern.replace(m[0], part)))
}

export function globToRegExp(glob) {
  let re = ""
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]
    if (c === "*" && glob[i + 1] === "*") {
      if (glob[i + 2] === "/") {
        re += "(?:.*/)?"
        i += 2
      } else {
        re += ".*"
        i += 1
      }
    } else if (c === "*") re += "[^/]*"
    else if (c === "?") re += "[^/]"
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  }
  return new RegExp("^" + re + "$", "i")
}

export default {
  id: "ccgs-hooks",
  async setup(ctx) {
    const root = ctx.location.directory
    const started = new Set()
    const notes = new Map()
    const loadedRules = new Map()

    // ---------------------------------------------------------------- helpers
    function runHook(name, payload, timeout = HOOK_TIMEOUT) {
      return new Promise((resolve) => {
        const script = join(root, ".opencode", "hooks", name)
        let child
        try {
          child = spawn(bashPath(), [script], {
            cwd: root,
            env: { ...process.env, OPENCODE_PROJECT_DIR: root, CLAUDE_PROJECT_DIR: root, CCGS_ROOT: root },
            stdio: ["pipe", "pipe", "pipe"],
            windowsHide: true,
          })
        } catch (error) {
          resolve({ code: -1, out: "", err: String(error) })
          return
        }
        let out = ""
        let err = ""
        child.stdout.on("data", (d) => (out += d))
        child.stderr.on("data", (d) => (err += d))
        const timer = setTimeout(() => child.kill(), timeout)
        child.on("error", (error) => {
          clearTimeout(timer)
          resolve({ code: -1, out, err: String(error) })
        })
        child.on("close", (code) => {
          clearTimeout(timer)
          resolve({ code: code ?? -1, out, err })
        })
        child.stdin.on("error", () => {})
        child.stdin.end(JSON.stringify(payload))
      })
    }

    // Hooks answer with one JSON object, plain text, or nothing.
    function answer(result) {
      const text = result.out.trim()
      if (!text) return {}
      const last = text.split("\n").filter(Boolean).pop()
      try {
        const json = JSON.parse(last)
        return {
          block: json.hookSpecificOutput?.permissionDecision === "deny",
          message: json.hookSpecificOutput?.permissionDecisionReason || json.systemMessage || "",
          context: json.hookSpecificOutput?.additionalContext || json.systemMessage || "",
          json,
        }
      } catch {
        return { text }
      }
    }

    function remember(event, text) {
      if (!text) return
      const list = notes.get(event.id) ?? []
      list.push(text)
      notes.set(event.id, list)
    }

    async function check(event, name, payload) {
      const result = await runHook(name, payload)
      const a = answer(result)
      if (result.code === 2) {
        notes.delete(event.id)
        throw new Error((result.err || a.message || `${name} refused this action`).trim())
      }
      if (result.code !== 0) return
      remember(event, a.context)
    }

    // ------------------------------------------------------- Claude payloads
    const inputPath = (input) => input.path ?? input.filePath ?? input.file_path ?? ""
    const commandText = (input) => input.command ?? input.cmd ?? ""

    function base(event, hookEventName) {
      return {
        session_id: event.sessionID,
        cwd: root,
        transcript_path: "",
        hook_event_name: hookEventName,
      }
    }

    function toolPayload(event, tool) {
      const input = event.input ?? {}
      if (tool === "shell" || tool === "bash")
        return { ...base(event, "PreToolUse"), tool_name: "Bash", tool_input: { command: commandText(input) } }
      if (tool === "read")
        return {
          ...base(event, "PreToolUse"),
          tool_name: "Read",
          tool_input: { file_path: inputPath(input), offset: input.offset, limit: input.limit },
        }
      if (tool === "write")
        return { ...base(event, "PreToolUse"), tool_name: "Write", tool_input: { file_path: inputPath(input), content: input.content } }
      if (tool === "edit")
        return {
          ...base(event, "PreToolUse"),
          tool_name: "Edit",
          tool_input: {
            file_path: inputPath(input),
            old_string: input.oldString ?? input.old_string,
            new_string: input.newString ?? input.new_string,
            replace_all: input.replaceAll ?? input.replace_all ?? false,
          },
        }
      if (tool === "patch")
        return { ...base(event, "PreToolUse"), tool_name: "Edit", tool_input: { file_path: inputPath(input) } }
      return null
    }

    function subagentPayload(event, hookEventName) {
      const input = event.input ?? {}
      return {
        ...base(event, hookEventName),
        agent_id: event.id,
        agent_type: input.agent ?? input.subagent_type ?? input.subagent ?? "unknown",
        agent_transcript_path: "",
        last_assistant_message: "",
      }
    }

    // ------------------------------------------------- path-scoped rules
    let ruleCache
    async function rules() {
      if (ruleCache) return ruleCache
      const dir = join(root, ".opencode", "rules")
      const files = (await readdir(dir)).filter((f) => f.endsWith(".md"))
      ruleCache = []
      for (const file of files) {
        const text = await readFile(join(dir, file), "utf8")
        const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
        if (!m) continue
        const paths = []
        let inPaths = false
        for (const line of m[1].split(/\r?\n/)) {
          if (/^paths:/.test(line)) {
            inPaths = true
            continue
          }
          if (inPaths) {
            const item = line.match(/^\s+-\s+(.*)$/)
            if (!item) break
            paths.push(item[1].trim().replace(/^["']|["']$/g, ""))
          }
        }
        ruleCache.push({
          id: file.replace(/\.md$/, ""),
          body: text.slice(m[0].length).trim(),
          patterns: paths.flatMap(expandBraces).map(globToRegExp),
        })
      }
      return ruleCache
    }

    function relPath(file) {
      if (!file) return ""
      const abs = isAbsolute(file) ? file : join(root, file)
      return relative(root, abs).replace(/\\/g, "/")
    }

    async function applyRules(event, file) {
      const rel = relPath(file)
      if (!rel || rel.startsWith("..")) return
      const set = loadedRules.get(event.sessionID) ?? new Set()
      loadedRules.set(event.sessionID, set)
      for (const rule of await rules()) {
        if (set.has(rule.id)) continue
        if (!rule.patterns.some((p) => p.test(rel))) continue
        set.add(rule.id)
        await ctx.session.instructions.entry
          .put({ sessionID: event.sessionID, key: `ccgs-rule:${rule.id}`, value: rule.body })
          .catch(() => {})
      }
    }

    // ------------------------------------------------------------ pre-tool
    await ctx.tool.hook("execute.before", async (event) => {
      const tool = event.tool
      if (tool === "shell" || tool === "bash") {
        const payload = toolPayload(event, tool)
        await check(event, "validate-commit.sh", payload)
        await check(event, "validate-push.sh", payload)
      } else if (tool === "read") {
        await check(event, "validate-read.sh", toolPayload(event, tool))
        await applyRules(event, inputPath(event.input ?? {}))
      } else if (tool === "write" || tool === "edit" || tool === "patch") {
        await check(event, "validate-registry.sh", toolPayload(event, tool))
        await check(event, "validate-write.sh", toolPayload(event, tool))
        await applyRules(event, inputPath(event.input ?? {}))
      } else if (tool === "subagent" || tool === "task") {
        await runHook("log-agent.sh", subagentPayload(event, "SubagentStart"))
      }
    })

    // ----------------------------------------------------------- post-tool
    await ctx.tool.hook("execute.after", async (event) => {
      const tool = event.tool
      const payload = toolPayload(event, tool)
      if (tool === "write" || tool === "edit" || tool === "patch") {
        if (payload) {
          const assets = await runHook("validate-assets.sh", { ...payload, hook_event_name: "PostToolUse" })
          const a = answer(assets)
          if (assets.code !== 2) remember(event, a.context || a.text)
        }
        const skill = await runHook("validate-skill-change.sh", {
          ...base(event, "PostToolUse"),
          tool_name: "Edit",
          tool_input: { file_path: inputPath(event.input ?? {}) },
        })
        const s = answer(skill)
        if (skill.code !== 2) remember(event, s.context || s.text)
      } else if (tool === "subagent" || tool === "task") {
        await runHook("log-agent-stop.sh", subagentPayload(event, "SubagentStop"))
      }

      const text = notes.get(event.id)
      notes.delete(event.id)
      if (!text?.length || event.status !== "completed") return
      const update = text.join("\n\n").trim()
      if (!update) return
      const result = event.result
      if (typeof result.content === "string") result.content += "\n\n" + update
      else if (Array.isArray(result.content)) result.content.push({ type: "text", text: update })
      else result.content = update
    })

    // ------------------------------------------------- session orientation
    const orientation = async (event) => {
      const first = await runHook("session-start.sh", { session_id: event.sessionID, cwd: root, hook_event_name: "SessionStart" })
      const gaps = await runHook("detect-gaps.sh", { session_id: event.sessionID, cwd: root, hook_event_name: "SessionStart" })
      return [first.out, gaps.out].join("\n").trim()
    }

    await ctx.session.hook("context", async (event) => {
      if (started.has(event.sessionID)) return
      started.add(event.sessionID)
      const text = await orientation(event)
      if (text) event.system.push({ type: "text", text })
    })

    // Claude re-runs SessionStart after compaction; do the same on the next step.
    await ctx.session.hook("compaction", async (event) => {
      await runHook("pre-compact.sh", { session_id: event.sessionID, cwd: root, hook_event_name: "PreCompact" })
      started.delete(event.sessionID)
    })

    // -------------------------------------------------------------- events
    const controller = new AbortController()
    void (async () => {
      try {
        for await (const event of ctx.event.subscribe({
          signal: controller.signal,
          types: ["session.idle", "permission.asked"],
        })) {
          const sessionID = event.data?.sessionID ?? event.properties?.sessionID ?? ""
          if (event.type === "session.idle") {
            void runHook("session-stop.sh", { session_id: sessionID, cwd: root, hook_event_name: "Stop" })
          } else if (event.type === "permission.asked") {
            const data = event.data ?? {}
            const what = [data.action, ...(data.resources ?? [])].filter(Boolean).join(" ")
            void runHook("notify.sh", { message: `Permission required: ${what}`, session_id: sessionID })
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) console.error("ccgs-hooks event stream:", error)
      }
    })()
    return () => controller.abort()
  },
}
