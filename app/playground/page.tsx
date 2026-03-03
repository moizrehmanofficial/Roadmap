"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Play, RotateCcw, Copy, Check, Terminal,
  ChevronLeft, Code2, Trash2, ChevronDown, BookOpen
} from "lucide-react";

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES: Record<string, { label: string; code: string }> = {
  variables: {
    label: "JS: Variables & Scope",
    code: `// ✅ Variables & Scope — press Ctrl+Enter to run!

const name = "Ali Ahmed";    // can't be reassigned
let score = 0;               // can be reassigned
score = 42;

// Block scope — let/const die at the end of {}
{
  let blockOnly = "only inside here";
  console.log("Inside:", blockOnly);
}
// console.log(blockOnly); // would throw ReferenceError

// const objects: the REFERENCE is constant, not the contents
const user = { name: "Sara", role: "user" };
user.role = "admin";   // ✅ allowed - changing property
// user = {};           // ❌ error - reassigning variable

console.log("Name:", name);
console.log("Score:", score);
console.log("User:", JSON.stringify(user));

// Hoisting: var is moved to top (avoid var!)
console.log(hoisted);   // undefined (not an error with var)
var hoisted = "I was hoisted";
console.log(hoisted);   // "I was hoisted"`,
  },
  functions: {
    label: "JS: Functions (All Forms)",
    code: `// ✅ All 4 ways to write functions

// 1. Declaration — hoisted, can call before it's defined
function greet(name) {
  return "Hello, " + name + "!";
}

// 2. Expression — NOT hoisted
const double = function(n) {
  return n * 2;
};

// 3. Arrow function — concise
const triple = (n) => n * 3;

// 4. Arrow with default params + rest
const sum = (label = "Sum", ...nums) => {
  const total = nums.reduce((a, b) => a + b, 0);
  return label + ": " + total;
};

console.log(greet("Ali"));
console.log("double(5):", double(5));
console.log("triple(5):", triple(5));
console.log(sum("Score", 10, 20, 30, 40));
console.log(sum(undefined, 1, 2, 3));

// Higher-order: function returning a function (closure)
const makeMultiplier = (x) => (y) => x * y;
const times5 = makeMultiplier(5);
const times10 = makeMultiplier(10);
console.log("times5(7):", times5(7));
console.log("times10(7):", times10(7));

// Callback pattern
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
const squared = evens.map(n => n * n);
console.log("Even squares:", squared);`,
  },
  arrays: {
    label: "JS: Array Methods",
    code: `// ✅ The array methods you'll use every single day

const products = [
  { id: 1, name: "Laptop",  price: 999,  category: "tech" },
  { id: 2, name: "Phone",   price: 599,  category: "tech" },
  { id: 3, name: "Desk",    price: 299,  category: "furniture" },
  { id: 4, name: "Chair",   price: 199,  category: "furniture" },
  { id: 5, name: "Monitor", price: 399,  category: "tech" },
];

// .filter() — keep items that match condition
const techItems = products.filter(p => p.category === "tech");
console.log("Tech items:", techItems.length);

// .map() — transform each item into something new
const names = products.map(p => p.name);
console.log("Names:", names.join(", "));

// .find() — first item that matches (or undefined)
const laptop = products.find(p => p.name === "Laptop");
console.log("Laptop price: $" + laptop.price);

// .reduce() — collapse array to single value
const total = products.reduce((sum, p) => sum + p.price, 0);
console.log("Total: $" + total);

// .some() / .every()
console.log("Any over $900?", products.some(p => p.price > 900));
console.log("All over $100?", products.every(p => p.price > 100));

// Chain them together!
const affordable = products
  .filter(p => p.price < 400)
  .map(p => p.name + " ($" + p.price + ")")
  .sort();
console.log("Under $400:", affordable);

// Group by category using reduce
const grouped = products.reduce((acc, p) => {
  if (!acc[p.category]) acc[p.category] = [];
  acc[p.category].push(p.name);
  return acc;
}, {});
console.log("Grouped:", JSON.stringify(grouped, null, 2));`,
  },
  async: {
    label: "JS: Async/Await",
    code: `// ✅ Async/Await — fetching real data from an API!

async function getUser(id) {
  console.log("Fetching user " + id + "...");
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/users/" + id
  );
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function getPosts(userId) {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?userId=" + userId + "&_limit=3"
  );
  return res.json();
}

// Promise.all — fetch BOTH at the same time (parallel = faster!)
async function loadDashboard() {
  try {
    const start = Date.now();

    const [user, posts] = await Promise.all([
      getUser(1),
      getPosts(1),
    ]);

    console.log("Loaded in " + (Date.now() - start) + "ms");
    console.log("User:", user.name, "- " + user.email);
    console.log("City:", user.address.city);
    console.log("Posts (" + posts.length + "):");
    posts.forEach(p => console.log("  -", p.title));

  } catch (error) {
    console.error("Failed:", error.message);
  }
}

loadDashboard();`,
  },
  closures: {
    label: "JS: Closures",
    code: `// ✅ Closures — functions that remember their outer scope

// Counter using closure
function createCounter(start = 0) {
  let count = start; // "closed over" — lives in memory

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    reset()     { count = start; return count; },
    value()     { return count; },
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.reset());     // 10

// Each call has its OWN private scope
const c1 = createCounter(0);
const c2 = createCounter(100);
c1.increment(); c1.increment();
console.log("c1:", c1.value()); // 2
console.log("c2:", c2.value()); // 100 — completely independent!

// Practical factory function
function makeFormatter(prefix, suffix) {
  suffix = suffix || "";
  return function(value) {
    return prefix + value + suffix;
  };
}

const toDollar  = makeFormatter("$");
const toPercent = makeFormatter("", "%");
const toParens  = makeFormatter("(", ")");

console.log(toDollar(42.50));   // $42.5
console.log(toPercent(98.6));   // 98.6%
console.log(toParens("error")); // (error)`,
  },
  objects: {
    label: "JS: Objects & Destructuring",
    code: `// ✅ Objects — the backbone of JavaScript

const user = {
  id: 1,
  name: "Ali Ahmed",
  age: 25,
  address: {
    city: "Rawalpindi",
    country: "Pakistan",
  },
  skills: ["JavaScript", "React", "Next.js"],
  greet() {
    return "Hi, I'm " + this.name + " from " + this.address.city;
  },
};

// Dot notation & bracket notation
console.log(user.name);           // Ali Ahmed
console.log(user["address"]["city"]); // Rawalpindi
console.log(user.greet());

// Destructuring — extract into variables
const { name, age, address: { city } } = user;
console.log(name + ", age " + age + ", " + city);

// Rename during destructure
const { name: fullName, role = "developer" } = user;
console.log(fullName + " is a " + role);

// Rest — everything else
const { id, ...profileData } = user;
console.log("Without id:", Object.keys(profileData));

// Spread — copy + override
const updated = { ...user, age: 26, role: "admin" };
console.log("Original age:", user.age);    // 25 (unchanged!)
console.log("Updated age:", updated.age);  // 26

// Dynamic property names
const field = "email";
const withEmail = { ...user, [field]: "ali@example.com" };
console.log("Email:", withEmail.email);

// Object.entries — iterate key/value pairs
const simple = { a: 1, b: 2, c: 3 };
Object.entries(simple).forEach(([key, val]) => {
  console.log(key + " =", val);
});`,
  },
  promises: {
    label: "JS: Promises Deep Dive",
    code: `// ✅ Promises — the foundation of async JavaScript

// Creating promises manually
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomSuccess(value, failChance = 0.3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > failChance) {
        resolve(value);
      } else {
        reject(new Error("Random failure for: " + value));
      }
    }, 100);
  });
}

// Promise.all — ALL must succeed, or it rejects
async function testAll() {
  try {
    const results = await Promise.all([
      randomSuccess("Task A", 0),  // always succeeds
      randomSuccess("Task B", 0),  // always succeeds
      randomSuccess("Task C", 0),  // always succeeds
    ]);
    console.log("All succeeded:", results);
  } catch (e) {
    console.error("One failed:", e.message);
  }
}

// Promise.allSettled — get result of each regardless of failure
async function testAllSettled() {
  const results = await Promise.allSettled([
    fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json()),
    fetch("https://jsonplaceholder.typicode.com/todos/2").then(r => r.json()),
    fetch("https://this-does-not-exist.fake").then(r => r.json()),
  ]);

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log("Todo " + (i+1) + " OK:", r.value.title.slice(0, 30));
    } else {
      console.log("Todo " + (i+1) + " FAILED:", r.reason.message.slice(0, 40));
    }
  });
}

async function run() {
  await testAll();
  await testAllSettled();
}

run();`,
  },
  errorHandling: {
    label: "JS: Error Handling",
    code: `// ✅ Custom errors & robust error handling

// Custom error classes
class AppError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details || {};
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, "VALIDATION_ERROR", { field });
    this.name = "ValidationError";
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(resource + " #" + id + " not found", "NOT_FOUND", { resource, id });
    this.name = "NotFoundError";
  }
}

// Functions that throw
function validateUser(user) {
  if (!user.name)     throw new ValidationError("name", "Name is required");
  if (!user.email || !user.email.includes("@"))
    throw new ValidationError("email", "Invalid email address");
  if (user.age < 0 || user.age > 150)
    throw new ValidationError("age", "Age must be 0-150");
  return true;
}

const DB = [{ id: 1, name: "Ali", email: "ali@x.com", age: 25 }];
function findUser(id) {
  const u = DB.find(u => u.id === id);
  if (!u) throw new NotFoundError("User", id);
  return u;
}

// Central error handler
function handleError(e) {
  if (e instanceof ValidationError)
    console.log("[VALIDATION] Field '" + e.details.field + "': " + e.message);
  else if (e instanceof NotFoundError)
    console.log("[NOT FOUND] " + e.message);
  else if (e instanceof AppError)
    console.log("[APP ERROR " + e.code + "] " + e.message);
  else
    console.log("[UNKNOWN]", e.message);
}

// Run tests
const tests = [
  () => validateUser({ name: "", email: "x@x.com", age: 25 }),
  () => validateUser({ name: "Ali", email: "bad-email", age: 25 }),
  () => findUser(999),
  () => findUser(1),
];

tests.forEach((test, i) => {
  try {
    const result = test();
    console.log("Test " + (i+1) + " PASSED:", result);
  } catch (e) {
    handleError(e);
  }
});`,
  },
};

// ─── Log types ────────────────────────────────────────────────────────────────
type LogLine = { type: "log" | "error" | "warn" | "info" | "system"; text: string };

// ─── Code runner (sandboxed via Function constructor) ────────────────────────
async function runUserCode(code: string): Promise<LogLine[]> {
  const logs: LogLine[] = [];

  const fmt = (v: unknown): string => {
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (typeof v === "object") {
      try { return JSON.stringify(v, null, 2); } catch { return String(v); }
    }
    return String(v);
  };

  const fakeConsole = {
    log:   (...a: unknown[]) => logs.push({ type: "log",   text: a.map(fmt).join(" ") }),
    error: (...a: unknown[]) => logs.push({ type: "error", text: a.map(fmt).join(" ") }),
    warn:  (...a: unknown[]) => logs.push({ type: "warn",  text: a.map(fmt).join(" ") }),
    info:  (...a: unknown[]) => logs.push({ type: "info",  text: a.map(fmt).join(" ") }),
  };

  // Patch real console so native async callbacks also get captured
  const orig = { log: console.log, error: console.error, warn: console.warn, info: console.info };
  console.log   = fakeConsole.log;
  console.error = fakeConsole.error;
  console.warn  = fakeConsole.warn;
  console.info  = fakeConsole.info;

  try {
    // Inject `console` as a parameter so the sandboxed code uses our fake
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", `"use strict"; return (async () => {\n${code}\n})()`);
    await fn(fakeConsole);
  } catch (e: unknown) {
    const err = e as Error;
    logs.push({ type: "error", text: `${err.name}: ${err.message}` });
  } finally {
    console.log   = orig.log;
    console.error = orig.error;
    console.warn  = orig.warn;
    console.info  = orig.info;
  }

  return logs;
}

// ─── Syntax highlighter (token-based, NO dangerouslySetInnerHTML) ─────────────
const TOKEN_COLORS = {
  keyword:  "#c084fc",
  string:   "#86efac",
  comment:  "#6b7280",
  number:   "#fb923c",
  fn:       "#fde047",
  type:     "#67e8f9",
  plain:    "#e2e8f0",
};
type TokenType = keyof typeof TOKEN_COLORS;
type Token = { type: TokenType; text: string };

const JS_KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while","do",
  "class","extends","new","typeof","instanceof","in","of","import","export",
  "default","from","async","await","try","catch","finally","throw","switch",
  "case","break","continue","delete","void","this","super","static","get","set",
  "interface","type","enum","namespace","declare","implements","readonly",
  "abstract","null","undefined","true","false","NaN","Infinity",
  "any","never","string","number","boolean","unknown","object",
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Single-line comment // or --
    if ((line[i] === "/" && line[i+1] === "/") ||
        (line[i] === "-" && line[i+1] === "-") ||
        (line[i] === "#")) {
      tokens.push({ type: "comment", text: line.slice(i) });
      break;
    }

    // Template literal
    if (line[i] === "`") {
      let j = i + 1;
      while (j < line.length && line[j] !== "`") {
        if (line[j] === "\\") j++;
        j++;
      }
      tokens.push({ type: "string", text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // String " or '
    if (line[i] === '"' || line[i] === "'") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) {
        if (line[j] === "\\") j++;
        j++;
      }
      tokens.push({ type: "string", text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Number (only if preceded by non-word char)
    if (/[0-9]/.test(line[i]) && (i === 0 || /\W/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9._xbBoO]/.test(line[j])) j++;
      if (j < line.length && line[j] === "n") j++; // BigInt
      tokens.push({ type: "number", text: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);

      // Peek ahead for ( to detect function calls
      let k = j;
      while (k < line.length && line[k] === " ") k++;
      const isCall = line[k] === "(";

      let type: TokenType = "plain";
      if (JS_KEYWORDS.has(word))   type = "keyword";
      else if (isCall)             type = "fn";
      else if (/^[A-Z]/.test(word)) type = "type"; // PascalCase

      tokens.push({ type, text: word });
      i = j;
      continue;
    }

    tokens.push({ type: "plain", text: line[i] });
    i++;
  }

  return tokens;
}

// ─── Code editor component ────────────────────────────────────────────────────
function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLPreElement>(null);
  const lines  = value.split("\n");

  const syncScroll = () => {
    if (taRef.current && hlRef.current) {
      hlRef.current.scrollTop  = taRef.current.scrollTop;
      hlRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart, end = ta.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#050810", position: "relative" }}>
      {/* Line numbers */}
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: "3.2rem",
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingRight: "10px",
          paddingLeft: "6px",
          textAlign: "right",
          background: "#070a12",
          borderRight: "1px solid #1a2234",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {lines.map((_, idx) => (
          <div key={idx} style={{ fontSize: "12px", lineHeight: "1.65rem", color: "#2d3748", fontFamily: "monospace" }}>
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Highlight layer (aria-hidden, visual only) */}
      <pre
        ref={hlRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "3.2rem",
          right: 0,
          bottom: 0,
          margin: 0,
          padding: "16px",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "13px",
          lineHeight: "1.65rem",
          whiteSpace: "pre",
          overflowX: "hidden",
          overflowY: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {lines.map((line, li) => (
          <div key={li} style={{ minHeight: "1.65rem" }}>
            {tokenizeLine(line).map((tok, ti) => (
              <span key={ti} style={{ color: TOKEN_COLORS[tok.type] }}>{tok.text}</span>
            ))}
          </div>
        ))}
      </pre>

      {/* Actual textarea (transparent text so highlight shows through) */}
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        style={{
          position: "absolute",
          top: 0,
          left: "3.2rem",
          right: 0,
          bottom: 0,
          padding: "16px",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "13px",
          lineHeight: "1.65rem",
          background: "transparent",
          color: "transparent",
          caretColor: "#00d4ff",
          border: "none",
          outline: "none",
          resize: "none",
          zIndex: 2,
          whiteSpace: "pre",
          overflowX: "auto",
          overflowY: "auto",
        }}
      />
    </div>
  );
}

// ─── Main playground ──────────────────────────────────────────────────────────
function PlaygroundContent() {
  const searchParams  = useSearchParams();
  const initialCode   = searchParams.get("code") || TEMPLATES.variables.code;

  const [code,           setCode]           = useState(initialCode);
  const [output,         setOutput]         = useState<LogLine[]>([]);
  const [running,        setRunning]        = useState(false);
  const [copied,         setCopied]         = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("variables");
  const [showPicker,     setShowPicker]     = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput([{ type: "system", text: "▶  Running…" }]);
    const t0 = Date.now();
    const logs = await runUserCode(code);
    logs.push({ type: "system", text: `✓  Finished in ${Date.now() - t0}ms` });
    setOutput(logs);
    setRunning(false);
    setTimeout(() => outputRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 60);
  }, [code]);

  // Keyboard shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleRun(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleRun]);

  const LOG_COLOR: Record<string, string> = {
    log: "#a3e635", error: "#f87171", warn: "#fbbf24", info: "#67e8f9", system: "#475569",
  };
  const LOG_ICON: Record<string, string> = {
    log: "›", error: "✖", warn: "⚠", info: "ℹ", system: "·",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100dvh", maxHeight: "100dvh",
      overflow: "hidden", background: "#080b14",
    }}>

      {/* ─── Toolbar ─────────────────────────────────── */}
      <header style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "0 14px", height: "52px", flexShrink: 0,
        background: "#0d1117", borderBottom: "1px solid #1a2234",
      }}>
        {/* Back */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4b5563", textDecoration: "none", fontSize: "14px" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}>
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: "linear-gradient(135deg,#00d4ff,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#080b14",
          }}>DG</div>
          <span className="hidden sm:inline" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>Playground</span>
        </div>

        {/* Template picker */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowPicker(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 8, fontSize: 12,
              background: "#111827", border: "1px solid #1f2937", color: "#94a3b8", cursor: "pointer",
            }}
          >
            <Code2 size={12} />
            <span className="hidden sm:inline">{TEMPLATES[activeTemplate]?.label ?? "Pick template"}</span>
            <span className="sm:hidden">Template</span>
            <ChevronDown size={11} />
          </button>
          {showPicker && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowPicker(false)} />
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                minWidth: 220, background: "#0d1117", border: "1px solid #1f2937",
                borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}>
                {Object.entries(TEMPLATES).map(([key, tpl]) => (
                  <button
                    key={key}
                    onClick={() => { setCode(tpl.code); setActiveTemplate(key); setOutput([]); setShowPicker(false); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "9px 14px", fontSize: 12, cursor: "pointer",
                      background: activeTemplate === key ? "rgba(0,212,255,0.08)" : "transparent",
                      color: activeTemplate === key ? "#00d4ff" : "#94a3b8",
                      border: "none", display: "block",
                    }}
                    onMouseEnter={e => { if (activeTemplate !== key) (e.currentTarget as HTMLElement).style.background = "#161b27"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = activeTemplate === key ? "rgba(0,212,255,0.08)" : "transparent"; }}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Guide link */}
        <Link href="/guide/javascript/variables" className="hidden sm:flex" style={{ alignItems: "center", gap: 5, fontSize: 12, color: "#4b5563", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}>
          <BookOpen size={12} />Guide
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {/* Copy */}
          <button
            title="Copy code"
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ padding: 7, borderRadius: 8, background: "#111827", border: "1px solid #1f2937", color: "#475569", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
          >
            {copied ? <Check size={14} style={{ color: "#4ade80" }} /> : <Copy size={14} />}
          </button>

          {/* Reset */}
          <button
            title="Reset"
            onClick={() => { setCode(TEMPLATES[activeTemplate].code); setOutput([]); }}
            style={{ padding: 7, borderRadius: 8, background: "#111827", border: "1px solid #1f2937", color: "#475569", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
          >
            <RotateCcw size={14} />
          </button>

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={running}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 9,
              background: running ? "#0891b2" : "#00d4ff",
              color: "#080b14", fontWeight: 700, fontSize: 13,
              border: "none", cursor: running ? "not-allowed" : "pointer",
              opacity: running ? 0.8 : 1, transition: "all 0.15s",
            }}
          >
            {running ? (
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(8,11,20,.3)", borderTopColor: "#080b14", animation: "spin 0.7s linear infinite" }} />
            ) : (
              <Play size={13} fill="currentColor" />
            )}
            Run
            <kbd className="hidden sm:inline" style={{ fontSize: 11, opacity: 0.55, fontWeight: 400, fontFamily: "monospace" }}>⌘↵</kbd>
          </button>
        </div>
      </header>

      {/* ─── Editor + Output (responsive split) ──── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden", flexDirection: "column" }}>
        {/* On desktop: row; on mobile: column (editor top, console bottom) */}
        <style>{`
          @media (min-width: 1024px) {
            .pg-body { flex-direction: row !important; }
            .pg-editor { height: 100% !important; min-height: 0 !important; }
            .pg-console { width: 38% !important; height: 100% !important; border-top: none !important; border-left: 1px solid #1a2234 !important; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="pg-body" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

          {/* Editor */}
          <div className="pg-editor" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, height: "60%", overflow: "hidden" }}>
            {/* Tab bar */}
            <div style={{ height: 36, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", background: "#0a0e18", borderBottom: "1px solid #1a2234" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ef4444","#eab308","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.6 }} />)}
              </div>
              <span style={{ fontSize: 12, color: "#374151", fontFamily: "monospace" }}>script.js</span>
              <span style={{ fontSize: 11, color: "#2d3748", marginLeft: "auto" }}>Tab = 2 spaces</span>
            </div>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          {/* Console */}
          <div className="pg-console" style={{ display: "flex", flexDirection: "column", height: "40%", borderTop: "1px solid #1a2234", flexShrink: 0 }}>
            {/* Console header */}
            <div style={{ height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", background: "#0a0e18", borderBottom: "1px solid #1a2234" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Terminal size={13} style={{ color: "#00d4ff" }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>Console</span>
                {output.length > 0 && (
                  <span style={{ fontSize: 11, color: "#374151", background: "#111827", padding: "2px 6px", borderRadius: 4 }}>
                    {output.filter(o => o.type !== "system").length} lines
                  </span>
                )}
              </div>
              <button onClick={() => setOutput([])} style={{ background: "none", border: "none", cursor: "pointer", color: "#2d3748", padding: 4 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#64748b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#2d3748")}>
                <Trash2 size={13} />
              </button>
            </div>

            {/* Output */}
            <div ref={outputRef} style={{ flex: 1, overflowY: "auto", padding: "12px 16px", background: "#030507" }}>
              {output.length === 0 ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2d3748" }}>
                  <Terminal size={26} style={{ marginBottom: 10, opacity: 0.25 }} />
                  <p style={{ fontSize: 12, opacity: 0.5, textAlign: "center" }}>
                    Click <span style={{ color: "#00d4ff" }}>Run</span> or press <span style={{ fontFamily: "monospace", background: "#111827", padding: "1px 5px", borderRadius: 4, color: "#64748b" }}>Ctrl+Enter</span>
                  </p>
                </div>
              ) : (
                output.map((line, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, padding: "2px 0",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.65,
                    color: LOG_COLOR[line.type] || "#e2e8f0",
                    borderBottom: i < output.length - 1 ? "1px solid rgba(26,34,52,0.6)" : "none",
                  }}>
                    <span style={{ color: "#2d3748", flexShrink: 0, userSelect: "none" }}>{LOG_ICON[line.type]}</span>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", flex: 1 }}>{line.text}</pre>
                  </div>
                ))
              )}
            </div>

            {/* Hint */}
            <div style={{ flexShrink: 0, padding: "5px 14px", background: "#0a0e18", borderTop: "1px solid #1a2234", fontSize: 11, color: "#2d3748" }}>
              💡 fetch() · async/await · setTimeout · console.log · JSON.stringify all work here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080b14" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(0,212,255,.2)", borderTopColor: "#00d4ff", animation: "spin 0.8s linear infinite" }} />
      </div>
    }>
      <PlaygroundContent />
    </Suspense>
  );
}
