"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { Check, ChevronRight, Copy, ExternalLink, Pencil, Play, RotateCcw, Square } from "lucide-react";
import { prepare, run, type LogLine } from "@/lib/runner";

const RUNNABLE = new Set(["js", "javascript", "ts", "typescript"]);
const LABEL: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript",
  tsx: "TSX", jsx: "JSX", bash: "Bash", sh: "Shell", shell: "Shell", zsh: "Shell",
  sql: "SQL", json: "JSON", yaml: "YAML", yml: "YAML", hcl: "HCL", terraform: "Terraform",
  dockerfile: "Dockerfile", docker: "Dockerfile", python: "Python", py: "Python", go: "Go",
  html: "HTML", css: "CSS", nginx: "Nginx", ini: "INI", toml: "TOML", text: "Text",
  plaintext: "Text", rego: "Rego", powershell: "PowerShell", http: "HTTP", diff: "Diff",
  output: "Output", env: ".env", graphql: "GraphQL", xml: "XML", csv: "CSV", regex: "Regex",
};

const LOG_CLASS: Record<LogLine["type"], string> = {
  log: "",
  info: "run-info",
  warn: "run-warn",
  error: "run-error",
  system: "run-system",
};

/** ```jsx preview: the example is a React component; render its default export with React from /vendor. */
const REACT_PREVIEW_STYLE =
  "body{margin:0;padding:16px;font-family:system-ui,sans-serif;color:#1f2937;line-height:1.5}" +
  "button{font:inherit;padding:6px 12px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:inherit;cursor:pointer}" +
  "input,select,textarea{font:inherit;padding:6px 8px;border:1px solid #cbd5e1;border-radius:8px}";

function reactPreviewDoc(code: string): string {
  const safe = code.replace(/<\/script/gi, "<\\/script");
  return (
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>${REACT_PREVIEW_STYLE}</style></head>` +
    `<body><div id="root"></div><script type="text/jsx">${safe}</script>` +
    `<script src="/vendor/react-preview.js"></script></body></html>`
  );
}

type PreProps = ComponentProps<"pre"> & {
  "data-raw"?: string;
  "data-lang"?: string;
  "data-preview"?: string;
  "data-preview-height"?: string;
};

export function CodeBlock({ children, ...props }: PreProps) {
  const raw = props["data-raw"] ?? "";
  const lang = (props["data-lang"] ?? "text").toLowerCase();
  const preview = props["data-preview"];
  const isReactPreview = !!preview && (lang === "jsx" || lang === "tsx");
  const toDoc = (src: string) => (isReactPreview ? reactPreviewDoc(src) : src);
  const previewHeight = Number(props["data-preview-height"] ?? 200);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(raw);
  const [editing, setEditing] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [logs, setLogs] = useState<LogLine[] | null>(null);
  const [running, setRunning] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const isTs = lang.startsWith("t");
  // Runs browser-style JS/TS in a sandboxed worker. Node-only code (modules, process, require) can't run here.
  const runnable =
    RUNNABLE.has(lang) &&
    !/^\s*(import|export)\s/m.test(raw) &&
    !/\b(process\.(env|argv|exit|on)|require\(|__dirname|__filename)/.test(raw);

  useEffect(() => () => stopRef.current?.(), []);

  useEffect(() => {
    const ta = taRef.current;
    if (editing && ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [editing, code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(editing ? code : raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  async function execute() {
    stopRef.current?.();
    setLogs([]);
    setRunning(true);
    let js: string;
    try {
      js = await prepare(editing ? code : raw, isTs ? "ts" : "js");
    } catch (e) {
      setLogs([{ type: "error", text: `Could not compile: ${(e as Error).message}` }]);
      setRunning(false);
      return;
    }
    stopRef.current = run(
      js,
      (l) => setLogs((prev) => [...(prev ?? []), l]),
      () => setRunning(false)
    );
  }

  function stop() {
    stopRef.current?.();
    stopRef.current = null;
    setRunning(false);
  }

  function reset() {
    setCode(raw);
    setEditing(false);
    setLogs(null);
  }

  const changed = editing && code !== raw;
  const editable = runnable || !!preview;
  const [previewDoc, setPreviewDoc] = useState(() => toDoc(raw));
  // Live result for HTML/CSS examples: refresh shortly after the user stops typing.
  useEffect(() => {
    if (!preview) return;
    const src = editing ? code : raw;
    const t = setTimeout(() => setPreviewDoc(isReactPreview ? reactPreviewDoc(src) : src), 250);
    return () => clearTimeout(t);
  }, [preview, isReactPreview, editing, code, raw]);

  return (
    <div className={`code-block ${lang === "output" ? "is-output" : ""} ${copied ? "flash" : ""} ${runnable ? "is-runnable" : ""} ${preview ? "is-preview" : ""}`}>
      <div className="code-bar">
        <span className="code-lang">{preview ? `${LABEL[lang] ?? lang} example` : LABEL[lang] ?? lang}</span>
        <div className="code-actions">
          {runnable && (
            <>
              {running ? (
                <button type="button" className="code-btn code-btn-run" onClick={stop}>
                  <Square aria-hidden size={12} />
                  <span>Stop</span>
                </button>
              ) : (
                <button type="button" className="code-btn code-btn-run" onClick={execute} title="Run this code here">
                  <Play aria-hidden size={13} />
                  <span>Run</span>
                </button>
              )}
            </>
          )}
          {editable &&
            (!editing ? (
              <button type="button" className="code-btn" onClick={() => setEditing(true)} title="Change the code and see what happens">
                <Pencil aria-hidden size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <button type="button" className="code-btn" onClick={reset} title="Undo your changes">
                <RotateCcw aria-hidden size={13} />
                <span>Reset</span>
              </button>
            ))}
          {runnable && (
            <Link
              className="code-btn code-btn-icon"
              href={`/playground?lang=${isTs ? "ts" : "js"}&code=${encodeURIComponent(editing ? code : raw)}`}
              title="Open in the playground"
              aria-label="Open in the playground"
            >
              <ExternalLink aria-hidden size={13} />
            </Link>
          )}
          <button type="button" className="code-btn" onClick={copy} aria-label="Copy code">
            {copied ? <Check aria-hidden size={13} className="pop-in text-ok" /> : <Copy aria-hidden size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      {preview && (
        <div className="code-preview">
          <div className="code-preview-bar">
            <span>Result</span>
            <span className="code-preview-hint">{changed ? "your version, updates as you type" : "live, rendered by your browser"}</span>
          </div>
          <iframe
            title="Result of the example"
            srcDoc={previewDoc}
            sandbox={preview === "js" || isReactPreview ? "allow-scripts allow-forms allow-modals" : "allow-forms"}
            loading="lazy"
            style={{ height: previewHeight }}
          />
        </div>
      )}
      {preview && !editing && (
        <button type="button" className="code-toggle" onClick={() => setShowCode((v) => !v)} aria-expanded={showCode}>
          <ChevronRight aria-hidden size={14} className={showCode ? "rot" : ""} />
          {showCode ? "Hide the code" : "Show the code"}
        </button>
      )}
      {(!preview || showCode || editing) && (
        <>
      {editing ? (
        <textarea
          ref={taRef}
          className="code-edit"
          value={code}
          spellCheck={false}
          aria-label="Editable code"
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              execute();
            } else if (e.key === "Tab" && !e.shiftKey) {
              e.preventDefault();
              const t = e.currentTarget;
              const { selectionStart: a, selectionEnd: b } = t;
              setCode(code.slice(0, a) + "  " + code.slice(b));
              requestAnimationFrame(() => t.setSelectionRange(a + 2, a + 2));
            }
          }}
        />
      ) : (
        <pre {...props} data-raw={undefined} data-preview={undefined} data-preview-height={undefined}>
          {children}
        </pre>
      )}
        </>
      )}
      {logs !== null && (
        <div className="run-out" aria-live="polite">
          <div className="run-out-bar">
            <span>{changed ? "Live output of your version" : "Live output"}</span>
            {running && <span className="run-dot" aria-label="Running" />}
          </div>
          <div className="run-lines">
            {logs.length === 0 && !running && <div className="run-system">(nothing was printed)</div>}
            {logs.map((l, i) => (
              <div key={i} className={LOG_CLASS[l.type]}>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
