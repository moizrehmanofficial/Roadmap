"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { topics } from "@/lib/data";
import { ChevronLeft, ChevronRight, Copy, Check, Play, ExternalLink, Terminal } from "lucide-react";

// Token types and their colors (inline styles — no Tailwind dynamic class issues)
const COLORS = {
  keyword:  "#c084fc", // purple
  string:   "#86efac", // green
  comment:  "#6b7280", // gray
  number:   "#fb923c", // orange
  function: "#fde047", // yellow
  type:     "#67e8f9", // cyan
  operator: "#94a3b8", // slate
  plain:    "#e2e8f0", // light
  jsx:      "#f97316", // orange for JSX tags
};

type Token = { type: keyof typeof COLORS; text: string };

function tokenize(code: string, language: string): Token[][] {
  const lines = code.split("\n");
  
  const JS_KEYWORDS = new Set([
    "const","let","var","function","return","if","else","for","while","do",
    "class","extends","new","typeof","instanceof","in","of","import","export",
    "default","from","async","await","try","catch","finally","throw","switch",
    "case","break","continue","delete","void","this","super","static","get","set",
    // TS keywords
    "interface","type","enum","namespace","declare","implements","readonly",
    "abstract","override","satisfies","as","is","keyof","infer","never","unknown",
    // values
    "null","undefined","true","false","NaN","Infinity",
  ]);

  const SQL_KEYWORDS = new Set([
    "SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE",
    "JOIN","LEFT","RIGHT","INNER","OUTER","ON","AND","OR","NOT","NULL","IS",
    "CREATE","TABLE","PRIMARY","KEY","REFERENCES","ORDER","BY","LIMIT","OFFSET",
    "GROUP","HAVING","DISTINCT","AS","SERIAL","VARCHAR","INTEGER","TEXT","BOOLEAN",
    "TIMESTAMP","DEFAULT","UNIQUE","CONSTRAINT","INDEX","CASCADE","INTERVAL",
    "DROP","ALTER","ADD","COLUMN","NOW","COUNT","SUM","AVG","MAX","MIN",
    "ASC","DESC","IN","BETWEEN","LIKE","EXISTS","UNION","ALL","CASE","WHEN","THEN","END",
  ]);

  const keywords = language === "sql" ? SQL_KEYWORDS : JS_KEYWORDS;

  return lines.map(line => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // Single-line comment
      if ((line[i] === "/" && line[i+1] === "/") || (language === "sql" && line[i] === "-" && line[i+1] === "-")) {
        tokens.push({ type: "comment", text: line.slice(i) });
        break;
      }

      // Template literal (backtick strings) — simplified
      if (line[i] === "`") {
        let j = i + 1;
        while (j < line.length && line[j] !== "`") j++;
        tokens.push({ type: "string", text: line.slice(i, j + 1) });
        i = j + 1;
        continue;
      }

      // Regular strings
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) {
          if (line[j] === "\\") j++;
          j++;
        }
        tokens.push({ type: "string", text: line.slice(i, j + 1) });
        i = j + 1;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(line[i]) && (i === 0 || /[\s,(:=<>!+\-*\/[\]{}]/.test(line[i-1]))) {
        let j = i;
        while (j < line.length && /[0-9._xbBoO]/.test(line[j])) j++;
        if (line[j] === "n") j++; // BigInt
        tokens.push({ type: "number", text: line.slice(i, j) });
        i = j;
        continue;
      }

      // Words (keywords, identifiers, function calls)
      if (/[a-zA-Z_$]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
        const word = line.slice(i, j);

        // Check if followed by ( = function call
        let k = j;
        while (k < line.length && line[k] === " ") k++;
        const isCall = line[k] === "(";

        // Check for JSX tags like <Component
        const prevChar = i > 0 ? line[i-1] : "";

        if (keywords.has(word)) {
          tokens.push({ type: "keyword", text: word });
        } else if (isCall) {
          tokens.push({ type: "function", text: word });
        } else if (/^[A-Z]/.test(word) && language !== "sql") {
          tokens.push({ type: "type", text: word }); // PascalCase = type
        } else {
          tokens.push({ type: "plain", text: word });
        }
        i = j;
        continue;
      }

      // Operators and punctuation — keep as plain
      tokens.push({ type: "plain", text: line[i] });
      i++;
    }

    return tokens;
  });
}

function CodeBlock({ code, language, title }: { code: string; language: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tokenizedLines = tokenize(code, language);

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-border-dim bg-[#0a0e18]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-tertiary border-b border-border-dim">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          {title && (
            <span className="text-xs text-text-secondary font-mono">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-dim px-2 py-0.5 rounded bg-bg-card">{language}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-bg-hover text-text-dim hover:text-text-secondary transition-colors"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>
      {/* Code */}
      <div className="overflow-x-auto">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 select-none py-4 pl-4 pr-3 text-right border-r border-border-dim/40">
            {tokenizedLines.map((_, i) => (
              <div key={i} style={{ color: "#374151", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.75rem" }}>
                {i + 1}
              </div>
            ))}
          </div>
          {/* Code lines */}
          <pre style={{ margin: 0, padding: "16px 20px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.75rem", overflow: "visible" }}>
            {tokenizedLines.map((tokens, lineIdx) => (
              <div key={lineIdx} style={{ minHeight: "1.75rem" }}>
                {tokens.length === 0 ? "\n" : tokens.map((token, tokenIdx) => (
                  <span key={tokenIdx} style={{ color: COLORS[token.type] }}>
                    {token.text}
                  </span>
                ))}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

function TagBadge({ type, text }: { type: "what" | "why" | "when" | "how"; text: string }) {
  const configs = {
    what: { label: "📌 WHAT", className: "tag-what" },
    why: { label: "💡 WHY", className: "tag-why" },
    when: { label: "⏰ WHEN / WHERE", className: "tag-when" },
    how: { label: "🔧 HOW", className: "tag-how" },
  };
  const { label, className } = configs[type];

  return (
    <div className="mb-4">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-2 ${className}`}>
        {label}
      </span>
      <p className="text-text-secondary leading-relaxed pl-1">{text}</p>
    </div>
  );
}

interface PageProps {
  params: { topicId: string; conceptId: string };
}

export default function ConceptPage({ params }: PageProps) {
  const { topicId, conceptId } = params;

  const topic = topics.find(t => t.id === topicId);
  if (!topic) notFound();

  const conceptIndex = topic.concepts.findIndex(c => c.id === conceptId);
  if (conceptIndex === -1) notFound();

  const concept = topic.concepts[conceptIndex];
  const prevConcept = conceptIndex > 0 ? topic.concepts[conceptIndex - 1] : null;
  const nextConcept = conceptIndex < topic.concepts.length - 1 ? topic.concepts[conceptIndex + 1] : null;

  // Find prev/next topic
  const topicIndex = topics.findIndex(t => t.id === topicId);
  const prevTopic = !prevConcept && topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic = !nextConcept && topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;

  const prevLink = prevConcept
    ? `/guide/${topicId}/${prevConcept.id}`
    : prevTopic
    ? `/guide/${prevTopic.id}/${prevTopic.concepts[prevTopic.concepts.length - 1].id}`
    : null;

  const nextLink = nextConcept
    ? `/guide/${topicId}/${nextConcept.id}`
    : nextTopic
    ? `/guide/${nextTopic.id}/${nextTopic.concepts[0].id}`
    : null;

  const prevLabel = prevConcept?.title ?? prevTopic?.concepts[prevTopic.concepts.length - 1].title;
  const nextLabel = nextConcept?.title ?? nextTopic?.concepts[0].title;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-dim mb-8">
        <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/guide/${topic.id}/${topic.concepts[0].id}`} className="hover:text-text-secondary transition-colors">
          {topic.title}
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{concept.title}</span>
      </div>

      {/* Topic badge */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-mono font-bold"
          style={{ background: `${topic.color}15`, color: topic.color, border: `1px solid ${topic.color}25` }}
        >
          {topic.icon} {topic.title}
        </span>
        <span className="text-text-dim text-sm">{conceptIndex + 1} / {topic.concepts.length}</span>
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-8 leading-tight">
        {concept.title}
      </h1>

      {/* WWWH grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="p-5 rounded-xl bg-bg-card border border-border-dim">
          <TagBadge type="what" text={concept.what} />
        </div>
        <div className="p-5 rounded-xl bg-bg-card border border-border-dim">
          <TagBadge type="why" text={concept.why} />
        </div>
        <div className="p-5 rounded-xl bg-bg-card border border-border-dim">
          <TagBadge type="when" text={concept.when} />
        </div>
        <div className="p-5 rounded-xl bg-bg-card border border-border-dim">
          <TagBadge type="how" text={concept.how} />
        </div>
      </div>

      {/* Terms glossary */}
      {concept.terms && concept.terms.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-accent-purple/20 flex items-center justify-center text-xs text-accent-purple">📚</span>
            Key Terms
          </h2>
          <div className="grid gap-3">
            {concept.terms.map(term => (
              <div key={term.term} className="flex gap-4 p-4 rounded-xl bg-bg-card border border-border-dim">
                <div className="flex-shrink-0">
                  <code className="text-accent-cyan text-sm font-mono font-bold">{term.term}</code>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">— {term.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Examples */}
      <div className="mb-10">
        <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-accent-cyan/20 flex items-center justify-center text-xs text-accent-cyan">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 3a2 2 0 00-2 2v4a2 2 0 01-2 2H3v2h1a2 2 0 012 2v4a2 2 0 002 2h2v-2H8v-5a2 2 0 00-2-2 2 2 0 002-2V5h2V3H8zm8 0h2a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3z"/></svg>
          </span>
          Code Examples
        </h2>
        {concept.examples.map((example, i) => (
          <div key={i} className="mb-6">
            {example.title && (
              <h3 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
                <span className="text-accent-cyan">#{i + 1}</span>
                {example.title}
              </h3>
            )}
            <CodeBlock code={example.code} language={example.language} title={example.title} />
            <div className="mt-2 flex justify-end">
              <Link
                href={`/playground?code=${encodeURIComponent(example.code)}&lang=${example.language}`}
                className="inline-flex items-center gap-1.5 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
              >
                <Play size={11} />
                Try in Playground
                <ExternalLink size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Practice CTA */}
      <div className="mb-10 p-5 rounded-2xl gradient-border bg-bg-card">
        <div className="flex items-center gap-3 mb-3">
          <Terminal size={20} className="text-accent-cyan" />
          <h3 className="font-display font-bold text-text-primary">Practice This Concept</h3>
        </div>
        <p className="text-text-secondary text-sm mb-4">Open the playground, paste any example, and experiment. The best way to learn is by breaking things.</p>
        <Link
          href={`/playground?code=${encodeURIComponent(concept.examples[0]?.code || "console.log('Hello, World!')")}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/20 transition-all"
        >
          <Play size={14} />
          Open in Playground
        </Link>
      </div>

      {/* Prev/Next navigation */}
      <div className="flex gap-4">
        {prevLink ? (
          <Link
            href={prevLink}
            className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border-dim hover:border-border-bright hover:bg-bg-hover transition-all group"
          >
            <ChevronLeft size={18} className="text-text-dim group-hover:text-accent-cyan transition-colors flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-text-dim mb-1">Previous</div>
              <div className="text-sm font-medium text-text-secondary group-hover:text-text-primary truncate">{prevLabel}</div>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {nextLink ? (
          <Link
            href={nextLink}
            className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl bg-bg-card border border-border-dim hover:border-border-bright hover:bg-bg-hover transition-all group text-right"
          >
            <div className="min-w-0">
              <div className="text-xs text-text-dim mb-1">Next</div>
              <div className="text-sm font-medium text-text-secondary group-hover:text-text-primary truncate">{nextLabel}</div>
            </div>
            <ChevronRight size={18} className="text-text-dim group-hover:text-accent-cyan transition-colors flex-shrink-0" />
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  );
}
