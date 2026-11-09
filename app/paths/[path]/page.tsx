import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getPath, getPaths } from "@/lib/paths";
import { DoneMark, ProgressBar } from "@/components/progress";
import { ContinueTrack, ModuleIndex, ModuleStrip } from "@/components/module-index";
import { RememberPath } from "@/components/path-active";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPaths().map((p) => ({ path: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ path: string }> }): Promise<Metadata> {
  const p = getPath((await params).path);
  return p ? { title: `${p.title} path`, description: p.role } : {};
}

export default async function PathPage({ params }: { params: Promise<{ path: string }> }) {
  const p = getPath((await params).path);
  if (!p) notFound();
  const all = p.stages.flatMap((s) => s.lessons);
  const ids = all.map((l) => l.id);
  const stageSummary = p.stages.map((s) => ({
    slug: s.id,
    title: s.title,
    ids: s.lessons.filter((l) => l.published).map((l) => l.id),
  }));
  const q = `?path=${p.slug}`;

  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-10 sm:px-6 lg:pt-16">
      <RememberPath slug={p.slug} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/#paths" className="hover:text-ink">
          Career paths
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-2">{p.title}</span>
      </nav>

      <header className="mt-6 grid gap-10 border-b border-ink pb-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full" style={{ background: p.mark }} aria-hidden />
            <span className="eyebrow">Career path</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight text-ink sm:text-6xl">{p.title}</h1>
          <p className="mt-5 max-w-[62ch] text-lg text-ink-2">{p.role}</p>
          <p className="mt-4 max-w-[62ch] text-ink-2">
            <span className="font-medium text-ink">Pick this if: </span>
            {p.forWho}
          </p>
          <ContinueTrack
            lessons={all.filter((l) => l.published).map((l) => ({ id: l.id, href: l.href + q, title: l.title }))}
          />
        </div>
        <div className="space-y-6">
          <dl className="grid grid-cols-3 gap-4">
            {[
              ["Stages", p.stages.length],
              ["Lessons", p.lessonCount],
              ["Written", p.publishedCount],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="font-serif text-3xl text-ink tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <ProgressBar ids={ids} label="Your progress on this path" />
          <div>
            <p className="eyebrow mb-2">By the end you can</p>
            <ul className="space-y-2 text-sm text-ink-2">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-ok" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <ModuleStrip modules={stageSummary} />

      <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        Follow the stages in order. Lessons marked
        <span className="rounded border border-rule px-1.5 text-[11px] font-medium uppercase tracking-wide">Planned</span>
        are on the roadmap but not written yet.
      </p>

      <div className="grid gap-12 pt-6 lg:grid-cols-[17rem_1fr]">
        <div className="hidden lg:block">
          <ModuleIndex modules={stageSummary} label="Stages" />
        </div>

        <ol className="relative space-y-12 border-l border-rule pl-6 sm:pl-10">
          {p.stages.map((s) => {
            const done = s.lessons.filter((l) => l.published).length;
            return (
              <li key={s.id} id={s.id} className="reveal relative">
                <span
                  aria-hidden
                  className="num-serif absolute -left-[2.3rem] top-0.5 flex size-8 items-center justify-center rounded-full border border-rule-strong bg-paper text-sm text-ink-2 sm:-left-[3.55rem]"
                >
                  {s.index}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="eyebrow">Stage {s.index}</span>
                  {s.optional && (
                    <span className="rounded border border-rule px-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
                      Optional
                    </span>
                  )}
                  <span className="num text-xs text-muted">
                    {s.lessons.length} lessons · {done} written
                  </span>
                </div>
                <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">{s.title}</h2>
                <p className="mt-1 text-ink-2">{s.summary}</p>
                <ol className="mt-4 border-t border-rule">
                  {s.lessons.map((l, j) => {
                    const inner = (
                      <>
                        <span className="num-serif w-8 shrink-0 text-sm text-muted">{j + 1}</span>
                        <span className={`nudge flex-1 ${l.published ? "text-ink" : "text-muted"}`}>{l.title}</span>
                        {l.published ? (
                          <span className="flex shrink-0 items-center gap-3">
                            {l.minutes && <span className="num hidden text-xs text-muted sm:inline">{l.minutes} min</span>}
                            <DoneMark id={l.id} />
                          </span>
                        ) : (
                          <span className="shrink-0 rounded border border-rule px-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
                            Planned
                          </span>
                        )}
                      </>
                    );
                    return (
                      <li key={l.id} className="border-b border-rule">
                        {l.published ? (
                          <Link
                            href={l.href + q}
                            className="row-hover -mx-2 flex min-h-11 items-center gap-3 rounded px-2 py-2 transition-colors hover:bg-surface-2/70"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div className="flex min-h-11 items-center gap-3 py-2">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
