"use client";

import Link from "next/link";
import { useEffect } from "react";
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

export function MarkComplete({ id }: { id: string }) {
  const { done } = useProgress();
  const isDone = !!done[id];
  return (
    <button
      type="button"
      onClick={() => setDone(id, !isDone)}
      aria-pressed={isDone}
      className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors ${
        isDone
          ? "border-ok bg-ok-soft text-ok"
          : "border-rule-strong bg-surface text-ink hover:border-ink"
      }`}
    >
      <Check aria-hidden size={16} />
      {isDone ? "Completed" : "Mark as complete"}
    </button>
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
      className="group flex items-center justify-between gap-4 rounded-md border border-rule bg-surface px-5 py-4 transition-colors hover:border-rule-strong"
    >
      <div className="min-w-0">
        <div className="eyebrow">Continue where you left off</div>
        <div className="mt-1 truncate font-medium text-ink">{last.title}</div>
        {count > 0 && <div className="mt-0.5 text-sm text-muted">{count} lessons completed so far</div>}
      </div>
      <ArrowRight aria-hidden size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
