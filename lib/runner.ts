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
  if (t === "string") return depth ? (v.includes("'") ? JSON.stringify(v) : "'" + JSON.stringify(v).slice(1, -1).replace(/\\\\"/g, '"') + "'") : v;
  if (t === "number" && Object.is(v, -0)) return "-0";
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
let indent = "";
const out = (type, text) => postMessage({ type, text: indent ? text.split("\\n").map((l) => indent + l).join("\\n") : text });
const send = (type) => (...args) => out(type, args.map((a) => fmt(a)).join(" "));
const cell = (v) => (v === undefined ? "" : typeof v === "string" ? "'" + v + "'" : fmt(v, 1));
function table(data) {
  if (data === null || typeof data !== "object") return send("log")(data);
  const rows = Object.keys(data), cols = [], hasValues = rows.some((r) => data[r] === null || typeof data[r] !== "object");
  rows.forEach((r) => { const v = data[r]; if (v && typeof v === "object") Object.keys(v).forEach((k) => cols.includes(k) || cols.push(k)); });
  const head = ["(index)", ...cols, ...(hasValues ? ["Values"] : [])];
  const body = rows.map((r) => { const v = data[r]; const o = v && typeof v === "object"; return [r, ...cols.map((k) => (o ? cell(v[k]) : "")), ...(hasValues ? [o ? "" : cell(v)] : [])]; });
  const w = head.map((h, i) => Math.max(h.length, ...body.map((b) => b[i].length)) + 2);
  const line = (l, m, r) => l + w.map((n) => "─".repeat(n)).join(m) + r;
  const row = (cells) => "│" + cells.map((x, i) => " " + x.padEnd(w[i] - 1)).join("│") + "│";
  out("log", [line("┌", "┬", "┐"), row(head), line("├", "┼", "┤"), ...body.map(row), line("└", "┴", "┘")].join("\\n"));
}
const counts = {}, timers = {};
const c = {
  log: send("log"), info: send("info"), warn: send("warn"), error: send("error"), debug: send("log"), dir: send("log"), table,
  group: (...a) => { if (a.length) send("log")(...a); indent += "  "; },
  groupCollapsed: (...a) => { if (a.length) send("log")(...a); indent += "  "; },
  groupEnd: () => { indent = indent.slice(2); },
  count: (l = "default") => { counts[l] = (counts[l] || 0) + 1; out("log", l + ": " + counts[l]); },
  countReset: (l = "default") => { counts[l] = 0; },
  assert: (ok, ...a) => { if (!ok) out("error", "Assertion failed" + (a.length ? ": " + a.map((x) => fmt(x)).join(" ") : "")); },
  time: (l = "default") => { timers[l] = performance.now(); },
  timeLog: (l = "default") => out("log", l + ": " + (performance.now() - timers[l]).toFixed(3) + "ms"),
  timeEnd: (l = "default") => { out("log", l + ": " + (performance.now() - timers[l]).toFixed(3) + "ms"); delete timers[l]; },
};
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
