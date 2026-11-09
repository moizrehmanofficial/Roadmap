"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Square, Trash2, Copy, Check, Link2, TriangleAlert } from "lucide-react";
import { TEMPLATES } from "@/lib/playground-templates";
import { prepare, run, type LogLine } from "@/lib/runner";

type Lang = "js" | "ts";

const LOG_STYLE: Record<LogLine["type"], string> = {
  log: "text-ink",
  info: "text-[var(--info)]",
  warn: "text-[var(--warn)] bg-[var(--warn-soft)]",
  error: "text-[var(--danger)] bg-[var(--danger-soft)]",
  system: "text-muted",
};

export function Playground() {
  const params = useSearchParams();
  const fromUrl = params.get("code");
  const [lang, setLang] = useState<Lang>(params.get("lang") === "ts" ? "ts" : fromUrl ? "js" : TEMPLATES.variables.lang);
  const [code, setCode] = useState(fromUrl ?? TEMPLATES.variables.code);
  const [template, setTemplate] = useState(fromUrl ? "" : "variables");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = code.split("\n").length;

  const execute = useCallback(async () => {
    stopRef.current?.();
    setLogs([]);
    setRunning(true);
    let js: string;
    try {
      js = await prepare(code, lang);
    } catch (e) {
      setLogs([{ type: "error", text: `TypeScript could not be compiled: ${(e as Error).message}` }]);
      setRunning(false);
      return;
    }
    stopRef.current = run(
      js,
      (l) => setLogs((prev) => [...prev, l]),
      (ms, reason) => {
        setRunning(false);
        if (reason === "done") setLogs((prev) => [...prev, { type: "system", text: `Finished in ${ms} ms` }]);
      }
    );
  }, [code, lang]);

  function stop() {
    stopRef.current?.();
    stopRef.current = null;
    setRunning(false);
    setLogs((prev) => [...prev, { type: "system", text: "Stopped." }]);
  }

  useEffect(() => () => stopRef.current?.(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [execute]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [logs]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = ta;
    const next = code.slice(0, s) + "  " + code.slice(end);
    setCode(next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = s + 2;
    });
  }

  function pickTemplate(key: string) {
    const t = TEMPLATES[key];
    if (!t) return;
    setTemplate(key);
    setCode(t.code);
    setLang(t.lang);
    setLogs([]);
  }

  async function copy(kind: "code" | "link") {
    const text =
      kind === "code"
        ? code
        : `${location.origin}/playground?lang=${lang}&code=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  const btn =
    "inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink";

  return (
    <main className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-rule px-3 py-2 sm:px-4">
        <h1 className="mr-2 font-serif text-xl font-semibold text-ink">Playground</h1>
        <label className="sr-only" htmlFor="tpl">
          Starter program
        </label>
        <select
          id="tpl"
          value={template}
          onChange={(e) => pickTemplate(e.target.value)}
          className="h-10 max-w-[13rem] rounded-md border border-rule bg-surface px-2 text-sm text-ink"
        >
          <option value="" disabled>
            Starter program…
          </option>
          {Object.entries(TEMPLATES).map(([k, t]) => (
            <option key={k} value={k}>
              {t.label}
            </option>
          ))}
        </select>
        <div role="radiogroup" aria-label="Language" className="flex rounded-md border border-rule bg-surface p-0.5">
          {(["js", "ts"] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={lang === l}
              onClick={() => setLang(l)}
              className={`h-9 rounded px-3 font-mono text-xs ${lang === l ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
            >
              {l === "js" ? "JS" : "TS"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className={btn} onClick={() => copy("code")} aria-label="Copy code">
            {copied === "code" ? <Check aria-hidden size={15} /> : <Copy aria-hidden size={15} />}
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button type="button" className={btn} onClick={() => copy("link")} aria-label="Copy share link">
            {copied === "link" ? <Check aria-hidden size={15} /> : <Link2 aria-hidden size={15} />}
            <span className="hidden sm:inline">Share</span>
          </button>
          {running ? (
            <button type="button" onClick={stop} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-ink px-4 text-sm font-medium text-ink">
              <Square aria-hidden size={14} /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={execute}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-paper hover:opacity-90"
            >
              <Play aria-hidden size={14} /> Run
              <kbd className="hidden font-mono text-[10px] opacity-70 sm:inline">Ctrl ↵</kbd>
            </button>
          )}
        </div>
      </div>

      {fromUrl && template === "" && (
        <p className="flex items-center gap-2 border-b border-rule bg-[var(--warn-soft)] px-4 py-2 text-sm text-[var(--warn)]">
          <TriangleAlert aria-hidden size={15} className="shrink-0" />
          This code was loaded from a link. Read it before you run it.
        </p>
      )}

      {/* Panes */}
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-cols-2 lg:grid-rows-1">
        <div className="relative flex min-h-0 border-b border-rule bg-surface lg:border-b-0 lg:border-r">
          <div
            ref={gutterRef}
            aria-hidden
            className="select-none overflow-hidden py-4 pl-3 pr-2 text-right font-mono text-[13px] leading-[1.7] text-muted/70"
          >
            {Array.from({ length: lines }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <label htmlFor="editor" className="sr-only">
            Code editor
          </label>
          <textarea
            id="editor"
            ref={taRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            onKeyDown={onKeyDown}
            onScroll={(e) => {
              if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            wrap="off"
            className="min-h-0 flex-1 resize-none bg-transparent py-4 pr-4 font-mono text-[13px] leading-[1.7] text-ink outline-none"
          />
        </div>

        <section aria-label="Console output" className="flex min-h-0 flex-col bg-paper">
          <div className="flex items-center justify-between border-b border-rule px-4 py-1.5">
            <span className="eyebrow">Console</span>
            <button type="button" onClick={() => setLogs([])} className={btn} aria-label="Clear console">
              <Trash2 aria-hidden size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
          <div ref={outRef} role="log" aria-live="polite" className="min-h-0 flex-1 overflow-auto py-2 font-mono text-[13px] leading-[1.6]">
            {logs.length === 0 && (
              <p className="px-4 py-2 text-muted">
                Press Run to execute. <code>console.log</code>, <code>fetch</code>, <code>async/await</code> and timers all work.
                Code runs in an isolated worker and is stopped after 5 seconds.
              </p>
            )}
            {logs.map((l, i) => (
              <pre key={i} className={`whitespace-pre-wrap break-words border-b border-rule/60 px-4 py-1 ${LOG_STYLE[l.type]}`}>
                {l.text}
              </pre>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
