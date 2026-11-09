"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActiveSection } from "@/lib/use-active-section";
import { useProgress } from "@/lib/progress";

type Mod = { slug: string; title: string; ids: string[] };

/** Desktop: sticky list of modules that highlights the one on screen. */
export function ModuleIndex({ modules }: { modules: Mod[] }) {
  const ids = useMemo(() => modules.map((m) => m.slug), [modules]);
  const active = useActiveSection(ids, 160);
  const { done } = useProgress();

  return (
    <nav aria-label="Modules" className="sticky top-24">
      <p className="eyebrow mb-3">Modules</p>
      <ol className="space-y-0.5 text-sm">
        {modules.map((m, i) => {
          const isActive = m.slug === active;
          const n = m.ids.filter((id) => done[id]).length;
          return (
            <li key={m.slug}>
              <a
                href={`#${m.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-3 rounded-r border-l-2 py-1.5 pl-3 pr-2 transition-colors ${
                  isActive
                    ? "border-accent bg-accent-soft/60 font-medium text-ink"
                    : "border-transparent text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <span className="num-serif w-4 text-sm text-muted">{i + 1}</span>
                <span className="flex-1">{m.title}</span>
                {n > 0 && <span className="num text-xs text-ok">{n}/{m.ids.length}</span>}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Phone / tablet: sticky horizontal strip of modules; the active one scrolls into view. */
export function ModuleStrip({ modules }: { modules: Mod[] }) {
  const ids = useMemo(() => modules.map((m) => m.slug), [modules]);
  const active = useActiveSection(ids, 200);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (el && strip.current) {
      strip.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-rule bg-paper/95 backdrop-blur sm:-mx-6 lg:hidden">
      <div ref={strip} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
        {modules.map((m, i) => {
          const isActive = m.slug === active;
          return (
            <a
              key={m.slug}
              data-slug={m.slug}
              href={`#${m.slug}`}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive ? "border-ink bg-ink text-paper" : "border-rule bg-surface text-ink-2"
              }`}
            >
              <span className="num-serif mr-1.5 opacity-70">{i + 1}</span>
              {m.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/** "Start reading" or "Continue: <next unfinished lesson>". */
export function ContinueTrack({ lessons }: { lessons: { id: string; href: string; title: string }[] }) {
  const { done } = useProgress();
  if (!lessons.length) return null;
  const next = lessons.find((l) => !done[l.id]);
  const started = lessons.some((l) => done[l.id]);
  const target = next ?? lessons[0];
  return (
    <a
      href={target.href}
      className="mt-7 inline-flex min-h-11 max-w-full items-center gap-2 rounded-md bg-ink px-5 font-medium text-paper hover:opacity-90"
    >
      <span className="truncate">
        {!started ? "Start reading" : next ? `Continue: ${next.title}` : "Read again from the start"}
      </span>
    </a>
  );
}
