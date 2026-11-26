/* Isolated Web Worker running CPython 3.12 via Pyodide v0.26.4 (zero DOM access). */
"use strict";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const MAX_OUTPUT_CHARS = 65536;
importScripts(PYODIDE_INDEX_URL + "pyodide.js");

let pyodideReadyPromise = null;

async function ensurePyodide() {
  if (!pyodideReadyPromise) {
    self.postMessage({ type: "status", status: "loading", detail: "Loading Python 3.12..." });
    pyodideReadyPromise = loadPyodide({ indexURL: PYODIDE_INDEX_URL })
      .then((py) => {
        self.postMessage({ type: "status", status: "ready", detail: "Python 3.12 Ready" });
        return py;
      })
      .catch((err) => {
        pyodideReadyPromise = null;
        throw err;
      });
  }
  return pyodideReadyPromise;
}

function appendCapped(state, line) {
  if (state.truncated) return;
  const s = String(line);
  if (state.chars + s.length > MAX_OUTPUT_CHARS) {
    const rem = Math.max(0, MAX_OUTPUT_CHARS - state.chars);
    if (rem > 0) state.lines.push(s.slice(0, rem));
    state.lines.push("...[Output truncated at 64 KB]");
    state.truncated = true;
    state.chars = MAX_OUTPUT_CHARS;
    return;
  }
  state.lines.push(s);
  state.chars += s.length + 1;
}

self.onmessage = async (event) => {
  const msg = event.data || {};
  if (msg.type === "warmup") {
    try {
      await ensurePyodide();
    } catch (err) {
      self.postMessage({ type: "status", status: "error", detail: "Runtime load failed (click Run to retry)" });
    }
    return;
  }
  if (msg.type !== "run") return;

  const runId = Number(msg.runId || 0);
  const code = String(msg.code || "");
  const stdinLines = String(msg.stdin || "").replace(/\r\n/g, "\n").split("\n");
  if (stdinLines.length > 0 && stdinLines[stdinLines.length - 1] === "") {
    stdinLines.pop();
  }

  const outState = { lines: [], chars: 0, truncated: false };
  const errState = { lines: [], chars: 0, truncated: false };
  const t0 = performance.now();

  try {
    const py = await ensurePyodide();
    py.setStdout({ batched: (line) => appendCapped(outState, line) });
    py.setStderr({ batched: (line) => appendCapped(errState, line) });
    py.globals.set("__fb_stdin_lines", py.toPy(stdinLines));
    py.globals.set("__fb_user_code", code);

    await py.runPythonAsync(`
import builtins as _fb_builtins

_fb_idx = 0
def _fb_input(prompt=""):
    global _fb_idx
    if _fb_idx >= len(__fb_stdin_lines):
        raise EOFError("input() requested another line, but the Test Inputs box has no more lines. Add an input line and click Run again.")
    val = str(__fb_stdin_lines[_fb_idx])
    _fb_idx += 1
    if prompt:
        print(f"{prompt}{val}")
    return val

_fb_builtins.input = _fb_input
_fb_ns = {"__name__": "__main__"}
try:
    exec(compile(__fb_user_code, "lesson.py", "exec"), _fb_ns)
finally:
    for _k in ("__fb_stdin_lines", "__fb_user_code"):
        globals().pop(_k, None)
`);
    const elapsedMs = Math.round(performance.now() - t0);
    self.postMessage({
      type: "result",
      runId,
      ok: true,
      elapsedMs,
      stdout: outState.lines.join("\n"),
      stderr: errState.lines.join("\n"),
    });
  } catch (err) {
    const elapsedMs = Math.round(performance.now() - t0);
    const errText = String(err && err.message ? err.message : err);
    const errCombined = errState.lines.length ? errState.lines.join("\n") + "\n" + errText : errText;
    self.postMessage({
      type: "result",
      runId,
      ok: false,
      elapsedMs,
      stdout: outState.lines.join("\n"),
      stderr: errCombined.slice(0, MAX_OUTPUT_CHARS),
    });
  }
};
