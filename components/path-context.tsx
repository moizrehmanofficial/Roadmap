"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, X, Route, Check } from "lucide-react";
import type { PathsIndex } from "@/lib/paths";
import { getActivePath, setActivePath } from "@/components/path-active";
import { setLast, useProgress } from "@/lib/progress";

type LessonLite = { id: string; title: string; href: string; published: boolean };

export interface PathCtx {
  lessonId: string;
  slug: string;
  title: string;
  mark: string;
  stageIndex: number; // 0-based
  stages: { title: string; lessons: LessonLite[] }[];
  position: number; // 1-based among all lessons in the path
  total: number;
  prev: LessonLite | null; // nearest published
  next: LessonLite | null;
  q: string; // "?path=slug"
}

const Ctx = createContext<PathCtx | null>(null);
export const usePathCtx = () => useContext(Ctx);

let indexPromise: Promise<PathsIndex> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/paths.json").then((r) => r.json());
  return indexPromise;
}

export function PathProvider({ lessonId, title, children }: { lessonId: string; title: string; children: ReactNode }) {
  const [ctx, setCtx] = useState<PathCtx | null>(null);

  useEffect(() => {
    let cancelled = false;
    const requested = new URLSearchParams(window.location.search).get("path");
    const wanted = requested ?? getActivePath();
    if (!wanted) return;
    loadIndex()
      .then((index) => {
        if (cancelled) return;
        const p = index.paths.find((x) => x.slug === wanted);
        if (!p) return;
        const stages = p.stages.map((s) => ({
          title: s.title,
          lessons: s.ids.map((id) => {
            const l = index.lessons[id];
            return { id, title: l.t, href: l.h, published: l.p === 1 };
          }),
        }));
        const flat = stages.flatMap((s) => s.lessons);
        const pos = flat.findIndex((l) => l.id === lessonId);
        if (pos === -1) return; // this lesson is not on the active path
        if (requested) setActivePath(requested);
        const q = `?path=${p.slug}`;
        const prev = [...flat.slice(0, pos)].reverse().find((l) => l.published) ?? null;
        const next = flat.slice(pos + 1).find((l) => l.published) ?? null;
        let acc = 0;
        let stageIndex = 0;
        for (let i = 0; i < stages.length; i++) {
          if (pos < acc + stages[i].lessons.length) {
            stageIndex = i;
            break;
          }
          acc += stages[i].lessons.length;
        }
        setCtx({ lessonId, slug: p.slug, title: p.title, mark: p.mark, stageIndex, stages, position: pos + 1, total: flat.length, prev, next, q });
        setLast({ id: lessonId, href: window.location.pathname + q, title, at: Date.now() });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lessonId, title]);

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

/** Banner under the lesson title: which path, which stage, how far. */
export function PathBar() {
  const ctx = usePathCtx();
  const [hidden, setHidden] = useState(false);
  if (!ctx || hidden) return null;
  const stage = ctx.stages[ctx.stageIndex];
  const pct = Math.round((ctx.position / ctx.total) * 100);
  return (
    <div className="pop-in mt-5 rounded-md border border-rule bg-surface px-4 py-3">
      <div className="flex items-start gap-3">
        <Route aria-hidden size={18} className="mt-0.5 shrink-0" style={{ color: ctx.mark }} />
        <div className="min-w-0 flex-1 text-sm">
          <p className="text-ink">
            <Link href={`/paths/${ctx.slug}#stage-${ctx.stageIndex + 1}`} className="font-medium hover:underline">
              {ctx.title}
            </Link>{" "}
            <span className="text-muted">path</span>
          </p>
          <p className="num mt-0.5 text-muted">
            Stage {ctx.stageIndex + 1} of {ctx.stages.length}: {stage.title} · Lesson {ctx.position} of {ctx.total}
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ctx.mark }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setActivePath(null);
            setHidden(true);
            const url = new URL(window.location.href);
            url.searchParams.delete("path");
            window.history.replaceState(null, "", url);
            window.location.reload();
          }}
          className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
          aria-label="Leave this path"
          title="Leave this path"
        >
          <X aria-hidden size={16} />
        </button>
      </div>
    </div>
  );
}

/** Sidebar: the path's stages when on a path, otherwise the topic outline (children). */
export function PathSidebar({ children }: { children: ReactNode }) {
  const ctx = usePathCtx();
  const { done } = useProgress();
  if (!ctx) return <>{children}</>;
  return (
    <nav aria-label={`${ctx.title} path`} className="text-sm">
      <Link href={`/paths/${ctx.slug}`} className="flex items-center gap-2 px-2 py-1 font-medium text-ink hover:underline">
        <span className="size-2 rounded-full" style={{ background: ctx.mark }} aria-hidden />
        {ctx.title}
      </Link>
      <div className="mt-3 space-y-1">
        {ctx.stages.map((s, i) => {
          const finished = s.lessons.filter((l) => done[l.id]).length;
          return (
            <details key={i} open={i === ctx.stageIndex}>
              <summary className="flex min-h-9 list-none items-center gap-2 rounded px-2 text-ink-2 hover:bg-surface-2 hover:text-ink [&::-webkit-details-marker]:hidden">
                <span className="num-serif w-5 shrink-0 text-muted">{i + 1}</span>
                <span className="flex-1">{s.title}</span>
                <span className="num text-xs text-muted">
                  {finished}/{s.lessons.length}
                </span>
              </summary>
              <ul className="mb-2 ml-4 border-l border-rule pl-2">
                {s.lessons.map((l) => {
                  const active = l.id === ctx.lessonId;
                  return (
                    <li key={l.id}>
                      {l.published ? (
                        <Link
                          href={l.href + ctx.q}
                          aria-current={active ? "page" : undefined}
                          className={`-ml-[9px] flex min-h-8 items-center justify-between gap-2 border-l-2 py-1 pl-3 pr-1 ${
                            active ? "border-accent font-medium text-ink" : "border-transparent text-ink-2 hover:text-ink"
                          }`}
                        >
                          <span>{l.title}</span>
                          {done[l.id] && (
                            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-ok text-paper" title="Completed">
                              <Check aria-hidden size={11} strokeWidth={3} />
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="flex min-h-8 items-center py-1 pl-2 text-muted/80">{l.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </nav>
  );
}

/** Previous / next inside the path; falls back to the topic's prev/next (children). */
export function PathPrevNext({ children }: { children: ReactNode }) {
  const ctx = usePathCtx();
  if (!ctx) return <>{children}</>;
  const card =
    "group btn rounded-md border border-rule p-4 transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.4)]";
  return (
    <nav aria-label="Path navigation" className="mt-8 grid gap-3 sm:grid-cols-2">
      {ctx.prev ? (
        <Link href={ctx.prev.href + ctx.q} className={card}>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <ArrowLeft aria-hidden size={13} className="transition-transform group-hover:-translate-x-1" /> Previous on this path
          </span>
          <span className="mt-1 block font-medium text-ink">{ctx.prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {ctx.next ? (
        <Link href={ctx.next.href + ctx.q} className={`${card} text-right`}>
          <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
            Next on this path <ArrowRight aria-hidden size={13} className="transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-1 block font-medium text-ink">{ctx.next.title}</span>
        </Link>
      ) : (
        <Link href={`/paths/${ctx.slug}`} className={`${card} text-right`}>
          <span className="text-xs text-muted">You reached the last written lesson</span>
          <span className="mt-1 block font-medium text-ink">Back to the {ctx.title} path</span>
        </Link>
      )}
    </nav>
  );
}

/** The drawer button label on phones. */
export function SidebarLabel() {
  const ctx = usePathCtx();
  return <>{ctx ? "Path" : "Lessons"}</>;
}

export function usePathNext(fallback: { href: string; title: string } | null | undefined) {
  const ctx = usePathCtx();
  return useMemo(() => (ctx ? (ctx.next ? { href: ctx.next.href + ctx.q, title: ctx.next.title } : null) : fallback ?? null), [ctx, fallback]);
}
