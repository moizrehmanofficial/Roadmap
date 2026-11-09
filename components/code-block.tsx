"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { Check, Copy, Play } from "lucide-react";

const RUNNABLE = new Set(["js", "javascript", "ts", "typescript", "jsx", "tsx"]);
const LABEL: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript",
  tsx: "TSX", jsx: "JSX", bash: "Bash", sh: "Shell", shell: "Shell", zsh: "Shell",
  sql: "SQL", json: "JSON", yaml: "YAML", yml: "YAML", hcl: "HCL", terraform: "Terraform",
  dockerfile: "Dockerfile", docker: "Dockerfile", python: "Python", py: "Python", go: "Go",
  html: "HTML", css: "CSS", nginx: "Nginx", ini: "INI", toml: "TOML", text: "Text",
  plaintext: "Text", rego: "Rego", powershell: "PowerShell", http: "HTTP", diff: "Diff",
  env: ".env", graphql: "GraphQL", xml: "XML", csv: "CSV", regex: "Regex",
};

type PreProps = ComponentProps<"pre"> & { "data-raw"?: string; "data-lang"?: string };

export function CodeBlock({ children, ...props }: PreProps) {
  const raw = props["data-raw"] ?? "";
  const lang = (props["data-lang"] ?? "text").toLowerCase();
  const [copied, setCopied] = useState(false);
  // The playground runs browser-style JS/TS. Node-only code (modules, process, require) gets no Run button.
  const runnable =
    RUNNABLE.has(lang) &&
    !/^\s*(import|export)\s/m.test(raw) &&
    !/\b(process\.(env|argv|exit|on)|require\(|__dirname|__filename)/.test(raw);

  async function copy() {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <div className={`code-block ${copied ? "flash" : ""}`}>
      <div className="code-bar">
        <span className="code-lang">{LABEL[lang] ?? lang}</span>
        <div className="code-actions">
          {runnable && (
            <Link
              className="code-btn"
              href={`/playground?lang=${lang.startsWith("t") ? "ts" : "js"}&code=${encodeURIComponent(raw)}`}
            >
              <Play aria-hidden size={13} />
              <span>Run</span>
            </Link>
          )}
          <button type="button" className="code-btn" onClick={copy} aria-label="Copy code">
            {copied ? <Check aria-hidden size={13} className="pop-in text-ok" /> : <Copy aria-hidden size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre {...props} data-raw={undefined}>
        {children}
      </pre>
    </div>
  );
}
