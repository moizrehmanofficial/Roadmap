"use client";

/**
 * Runs user code inside a dedicated Web Worker.
 * - The worker has no DOM, no cookies and no access to localStorage.
 * - It is terminated after TIME_LIMIT ms, so infinite loops cannot freeze the page.
 */

export type LogType = "log" | "info" | "warn" | "error" | "system";
export interface LogLine {
  type: LogType;
  text: string;
}

export const TIME_LIMIT = 5000;

const WORKER_SRC = `
const seen = () => new WeakSet();
function fmt(v, depth = 0, s = seen()) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  const t = typeof v;
  if (t === "string") return depth ? JSON.stringify(v) : v;
  if (t === "number" || t === "boolean" || t === "bigint") return String(v) + (t === "bigint" ? "n" : "");
  if (t === "symbol") return v.toString();
  if (t === "function") return "[Function: " + (v.name || "anonymous") + "]";
  if (v instanceof Error) return v.name + ": " + v.message;
  if (s.has(v)) return "[Circular]";
  s.add(v);
  if (depth > 4) return Array.isArray(v) ? "[Array]" : "[Object]";
  const pad = "  ".repeat(depth + 1), end = "  ".repeat(depth);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    const items = v.map((x) => fmt(x, depth + 1, s));
    const one = "[ " + items.join(", ") + " ]";
    return one.length < 72 ? one : "[\\n" + items.map((i) => pad + i).join(",\\n") + "\\n" + end + "]";
  }
  if (v instanceof Map) return "Map(" + v.size + ") " + fmt(Object.fromEntries(v), depth, s);
  if (v instanceof Set) return "Set(" + v.size + ") " + fmt([...v], depth, s);
  if (v instanceof Date) return v.toISOString();
  if (v instanceof Promise) return "Promise { <pending> }";
  const keys = Object.keys(v);
  const name = v.constructor && v.constructor.name !== "Object" ? v.constructor.name + " " : "";
  if (!keys.length) return name + "{}";
  const items = keys.map((k) => (/^[A-Za-z_$][\\w$]*$/.test(k) ? k : JSON.stringify(k)) + ": " + fmt(v[k], depth + 1, s));
  const one = name + "{ " + items.join(", ") + " }";
  return one.length < 72 ? one : name + "{\\n" + items.map((i) => pad + i).join(",\\n") + "\\n" + end + "}";
}
const send = (type) => (...args) => postMessage({ type, text: args.map((a) => fmt(a)).join(" ") });
const c = { log: send("log"), info: send("info"), warn: send("warn"), error: send("error"), debug: send("log"), table: send("log") };
self.console = Object.assign(self.console || {}, c);
self.addEventListener("unhandledrejection", (e) => { e.preventDefault(); postMessage({ type: "error", text: "Uncaught (in promise) " + fmt(e.reason) }); });
self.onerror = (msg) => { postMessage({ type: "error", text: String(msg) }); return true; };
onmessage = async (e) => {
  try {
    const fn = new Function("console", '"use strict"; return (async () => {\\n' + e.data + '\\n})()');
    await fn(c);
  } catch (err) {
    postMessage({ type: "error", text: (err && err.name ? err.name + ": " + err.message : String(err)) });
  }
  postMessage({ type: "__done" });
};
`;

let workerUrl: string | null = null;

export async function prepare(code: string, lang: "js" | "ts"): Promise<string> {
  if (lang === "js") return code;
  const { transform } = await import("sucrase");
  return transform(code, { transforms: ["typescript"], disableESTransforms: true }).code;
}

export function run(
  code: string,
  onLog: (l: LogLine) => void,
  onFinish: (ms: number, reason: "done" | "timeout") => void
): () => void {
  workerUrl ??= URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
  const worker = new Worker(workerUrl);
  const t0 = performance.now();
  let finished = false;

  const finish = (reason: "done" | "timeout") => {
    if (finished) return;
    finished = true;
    onFinish(Math.round(performance.now() - t0), reason);
  };

  // Hard stop: infinite loops, forgotten intervals, etc.
  const kill = setTimeout(() => {
    if (!finished) {
      onLog({ type: "error", text: `Stopped after ${TIME_LIMIT / 1000}s. Is there an infinite loop, or a promise that never settles?` });
      finish("timeout");
    }
    worker.terminate();
  }, TIME_LIMIT);

  worker.onmessage = (e: MessageEvent<{ type: string; text?: string }>) => {
    if (e.data.type === "__done") finish("done");
    else onLog({ type: e.data.type as LogType, text: e.data.text ?? "" });
  };
  worker.onerror = (e) => {
    onLog({ type: "error", text: e.message || "Worker error" });
    finish("done");
  };
  worker.postMessage(code);

  return () => {
    clearTimeout(kill);
    worker.terminate();
  };
}
