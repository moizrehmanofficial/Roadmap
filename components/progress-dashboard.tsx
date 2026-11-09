"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { exportProgress, importProgress, resetProgress, useProgress } from "@/lib/progress";

type T = { slug: string; title: string; mark: string; modules: { title: string; ids: string[] }[] };

export function ProgressDashboard({ tracks }: { tracks: T[] }) {
  const { done } = useProgress();
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const total = Object.keys(done).length;

  function download() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `devguide-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function upload(f: File) {
    const ok = importProgress(await f.text());
    setMsg(ok ? "Progress imported." : "That file is not a DevGuide progress export.");
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3 border-y border-rule py-4">
        <span className="mr-auto font-serif text-2xl text-ink">
          {total} <span className="text-base text-muted">lessons completed</span>
        </span>
        <button type="button" onClick={download} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-rule-strong px-3 text-sm hover:border-ink">
          <Download aria-hidden size={15} /> Export
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-rule-strong px-3 text-sm hover:border-ink">
          <Upload aria-hidden size={15} /> Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all progress in this browser?")) {
              resetProgress();
              setMsg("Progress cleared.");
            }
          }}
          className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-muted hover:text-ink"
        >
          <RotateCcw aria-hidden size={15} /> Reset
        </button>
      </div>
      {msg && (
        <p role="status" className="mt-3 text-sm text-ink-2">
          {msg}
        </p>
      )}

      <div className="mt-8 space-y-10">
        {tracks.map((t) => {
          const ids = t.modules.flatMap((m) => m.ids);
          const n = ids.filter((id) => done[id]).length;
          return (
            <section key={t.slug}>
              <div className="flex items-baseline justify-between gap-4">
                <Link href={`/tracks/${t.slug}`} className="flex items-center gap-2 font-serif text-2xl font-semibold text-ink hover:underline">
                  <span className="size-2 rounded-full" style={{ background: t.mark }} aria-hidden />
                  {t.title}
                </Link>
                <span className="font-mono text-xs text-muted">
                  {n}/{ids.length}
                </span>
              </div>
              <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {t.modules.map((m) => {
                  const k = m.ids.filter((id) => done[id]).length;
                  const pct = Math.round((k / m.ids.length) * 100);
                  return (
                    <li key={m.title} className="text-sm">
                      <div className="flex justify-between text-ink-2">
                        <span>{m.title}</span>
                        <span className="font-mono text-xs text-muted">{pct}%</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full bg-ok" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
