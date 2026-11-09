"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ArrowRight } from "lucide-react";
import { setDone, setLast, useProgress } from "@/lib/progress";

export function ProgressBar({ ids, label }: { ids: string[]; label?: string }) {
  const { done } = useProgress();
  const n = ids.filter((id) => done[id]).length;
  const pct = ids.length ? Math.round((n / ids.length) * 100) : 0;
  return (
    <div className="flex items-center gap-3" aria-label={label ?? "Progress"}>
      <div
        className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-ok transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      <span className="num text-xs text-muted">
        {n}/{ids.length}
      </span>
    </div>
  );
}

export function DoneMark({ id }: { id: string }) {
  const { done } = useProgress();
  if (!done[id]) return null;
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-ok text-paper" title="Completed">
      <Check aria-hidden size={11} strokeWidth={3} />
      <span className="sr-only">Completed</span>
    </span>
  );
}

const BURST_COLORS = ["var(--ok)", "var(--accent)", "var(--info)", "var(--warn)", "var(--sec)"];

export function MarkComplete({ id, next }: { id: string; next?: { href: string; title: string } | null }) {
  const { done } = useProgress();
  const isDone = !!done[id];
  const [celebrate, setCelebrate] = useState(0);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  function toggle() {
    const nextValue = !isDone;
    setDone(id, nextValue);
    if (nextValue) {
      setCelebrate((c) => c + 1);
      setToast(true);
    } else {
      setToast(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isDone}
        className={`relative inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-medium ${
          isDone ? "border-ok bg-ok-soft text-ok" : "border-rule-strong bg-surface text-ink hover:border-ink"
        } ${celebrate ? "glow-once" : ""}`}
        key={`btn-${celebrate}`}
      >
        {isDone ? (
          <svg key={`c-${celebrate}`} className="check-draw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <Check aria-hidden size={16} />
        )}
        {isDone ? "Completed" : "Mark as complete"}
        {celebrate > 0 &&
          isDone &&
          Array.from({ length: 12 }, (_, i) => (
            <span
              key={`${celebrate}-${i}`}
              aria-hidden
              className="burst"
              style={{ ["--a" as string]: `${i * 30}deg`, background: BURST_COLORS[i % BURST_COLORS.length], animationDelay: `${(i % 3) * 30}ms` }}
            />
          ))}
      </button>
      {toast &&
        createPortal(
        <div role="status" className="toast w-[min(92vw,26rem)]">
          <div className="flex items-center gap-3 rounded-lg border border-rule bg-surface px-4 py-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-ok text-paper pop-in">
              <Check aria-hidden size={16} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">Lesson complete. Nice work!</p>
              {next && <p className="truncate text-xs text-muted">Up next: {next.title}</p>}
            </div>
            {next ? (
              <Link href={next.href} className="btn inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md bg-ink px-3 text-sm font-medium text-paper">
                Next <ArrowRight aria-hidden size={14} />
              </Link>
            ) : (
              <button type="button" onClick={() => setToast(false)} className="text-sm text-muted">
                Close
              </button>
            )}
          </div>
        </div>,
          document.body
        )}
    </>
  );
}

export function TrackVisit({ id, href, title }: { id: string; href: string; title: string }) {
  useEffect(() => {
    setLast({ id, href, title, at: Date.now() });
  }, [id, href, title]);
  return null;
}

export function ContinueLearning() {
  const { last, done } = useProgress();
  if (!last) return null;
  const count = Object.keys(done).length;
  return (
    <Link
      href={last.href}
      className="group row-hover flex items-center justify-between gap-4 rounded-md border border-rule bg-surface px-5 py-4 transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.4)]"
    >
      <div className="min-w-0">
        <div className="eyebrow">Continue where you left off</div>
        <div className="mt-1 truncate font-medium text-ink">{last.title}</div>
        {count > 0 && <div className="mt-0.5 text-sm text-muted">{count} lessons completed so far</div>}
      </div>
      <ArrowRight aria-hidden size={18} className="nudge shrink-0 text-muted" />
    </Link>
  );
}
