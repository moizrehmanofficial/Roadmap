"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, Share, SquarePlus, X, CloudDownload, Check, Smartphone } from "lucide-react";

/* ───────── Service worker registration ───────── */

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);
  return null;
}

/* ───────── Install prompt (Android / desktop Chrome, Edge) + iOS instructions ───────── */

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: BIPEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

type Mode = "prompt" | "ios" | "installed" | "none";

function getMode(): Mode {
  if (typeof window === "undefined") return "none";
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "installed";
  if (deferred) return "prompt";
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  return "none";
}

export function useInstallMode() {
  return useSyncExternalStore(subscribe, getMode, () => "none" as Mode);
}

export async function promptInstall() {
  if (!deferred) return;
  await deferred.prompt();
  await deferred.userChoice.catch(() => null);
  deferred = null;
  notify();
}

export function InstallButton({ variant = "header" }: { variant?: "header" | "full" }) {
  const mode = useInstallMode();
  const [showIOS, setShowIOS] = useState(false);
  if (mode === "none" || mode === "installed") return null;

  const onClick = () => (mode === "prompt" ? promptInstall() : setShowIOS(true));

  return (
    <>
      {variant === "header" ? (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
          aria-label="Install DevGuide as an app"
        >
          <Download aria-hidden size={16} />
          <span className="hidden sm:inline">Install</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="btn inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-paper"
        >
          <Smartphone aria-hidden size={16} /> Install the app
        </button>
      )}
      {showIOS && <IOSInstructions onClose={() => setShowIOS(false)} />}
    </>
  );
}

function IOSInstructions({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Install on iPhone or iPad"
        className="toast-up w-full max-w-sm rounded-xl border border-rule bg-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-xl font-semibold text-ink">Install on iPhone / iPad</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 inline-flex size-9 items-center justify-center rounded-md hover:bg-surface-2">
            <X aria-hidden size={18} />
          </button>
        </div>
        <ol className="mt-4 space-y-3 text-sm text-ink-2">
          <li className="flex gap-3">
            <span className="num-serif text-muted">1.</span>
            <span>
              Open this site in <strong className="text-ink">Safari</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="num-serif text-muted">2.</span>
            <span className="flex flex-wrap items-center gap-1">
              Tap the <Share aria-label="Share" size={16} className="inline text-[var(--info)]" /> <strong className="text-ink">Share</strong> button.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="num-serif text-muted">3.</span>
            <span className="flex flex-wrap items-center gap-1">
              Choose <SquarePlus aria-hidden size={16} className="inline" /> <strong className="text-ink">Add to Home Screen</strong>, then Add.
            </span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-muted">DevGuide then opens full-screen like an app, and lessons you have saved work offline.</p>
      </div>
    </div>,
    document.body
  );
}

/* ───────── Save every lesson for offline reading ───────── */

const PAGES = "dg-pages-v1";
const STATIC = "dg-static-v1";

async function cacheWithAssets(url: string, pages: Cache, assets: Cache, seen: Set<string>) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) return;
  const html = await res.clone().text();
  await pages.put(url, res);
  const found = [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
  for (const a of found) {
    if (seen.has(a)) continue;
    seen.add(a);
    const r = await fetch(a).catch(() => null);
    if (!r?.ok) continue;
    if (a.endsWith(".css")) {
      const css = await r.clone().text();
      for (const m of css.matchAll(/url\((\/_next\/static\/media\/[^)]+)\)/g)) {
        if (seen.has(m[1])) continue;
        seen.add(m[1]);
        const f = await fetch(m[1]).catch(() => null);
        if (f?.ok) await assets.put(m[1], f);
      }
    }
    await assets.put(a, r);
  }
}

export function OfflineSaver() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported("caches" in window && "serviceWorker" in navigator), []);
  const [state, setState] = useState<{ done: number; total: number; status: "idle" | "saving" | "saved" | "error" }>({
    done: 0,
    total: 0,
    status: "idle",
  });
  const [savedBefore, setSavedBefore] = useState<number | null>(null);

  useEffect(() => {
    if (!supported) return;
    caches
      .open(PAGES)
      .then((c) => c.keys())
      .then((keys) => setSavedBefore(keys.filter((k) => new URL(k.url).pathname.startsWith("/learn/")).length))
      .catch(() => {});
  }, [supported, state.status]);

  async function saveAll() {
    try {
      const docs: { href: string; published: boolean }[] = await fetch("/search.json").then((r) => r.json());
      const lessonUrls = docs.filter((d) => d.published).map((d) => d.href);
      const trackUrls = [...new Set(docs.map((d) => d.href.split("#")[0]).filter((h) => h.startsWith("/tracks/")))];
      const urls = ["/", "/offline", "/progress", "/playground", ...trackUrls, ...lessonUrls];
      const pages = await caches.open(PAGES);
      const assets = await caches.open(STATIC);
      const seen = new Set<string>();
      setState({ done: 0, total: urls.length, status: "saving" });
      let n = 0;
      for (const u of urls) {
        await cacheWithAssets(u, pages, assets, seen).catch(() => {});
        n++;
        setState({ done: n, total: urls.length, status: "saving" });
      }
      setState({ done: n, total: urls.length, status: "saved" });
    } catch {
      setState((s) => ({ ...s, status: "error" }));
    }
  }

  if (supported === null) return <div className="min-h-11" />;
  if (!supported) return <p className="text-sm text-muted">This browser does not support offline saving.</p>;

  const pct = state.total ? Math.round((state.done / state.total) * 100) : 0;
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={saveAll}
        disabled={state.status === "saving"}
        className="btn inline-flex min-h-11 items-center gap-2 rounded-md border border-rule-strong px-4 text-sm font-medium text-ink hover:border-ink disabled:opacity-60"
      >
        {state.status === "saved" ? <Check aria-hidden size={16} className="pop-in text-ok" /> : <CloudDownload aria-hidden size={16} />}
        {state.status === "saving" ? `Saving… ${state.done}/${state.total}` : state.status === "saved" ? "Saved for offline" : "Save all lessons for offline"}
      </button>
      {state.status === "saving" && (
        <div className="h-1 max-w-sm overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-ok transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </div>
      )}
      {state.status === "error" && <p className="text-sm text-[var(--danger)]">Saving failed. Check your connection and try again.</p>}
      {savedBefore !== null && (
        <p className="num text-sm text-muted">{savedBefore} lessons are saved on this device.</p>
      )}
    </div>
  );
}
