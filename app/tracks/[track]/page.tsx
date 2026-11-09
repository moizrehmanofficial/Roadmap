import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTrack, getTracks } from "@/lib/content";
import { DoneMark, ProgressBar } from "@/components/progress";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTracks().map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }): Promise<Metadata> {
  const t = getTrack((await params).track);
  return t ? { title: t.title, description: t.summary } : {};
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const t = getTrack((await params).track);
  if (!t) notFound();
  const ids = t.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const first = t.modules.flatMap((m) => m.lessons).find((l) => l.published);

  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-10 sm:px-6 lg:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/#path" className="hover:text-ink">
          All tracks
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-2">{t.title}</span>
      </nav>

      <header className="mt-6 grid gap-8 border-b border-ink pb-10 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full" style={{ background: t.mark }} aria-hidden />
            <span className="eyebrow">Track · {t.short}</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight text-ink sm:text-6xl">{t.title}</h1>
          <p className="mt-5 max-w-[62ch] text-lg text-ink-2">{t.summary}</p>
          {first && (
            <Link
              href={first.href}
              className="mt-7 inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-medium text-paper hover:opacity-90"
            >
              Start reading
            </Link>
          )}
        </div>
        <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-3">
          {[
            ["Modules", t.modules.length],
            ["Lessons", t.lessonCount],
            ["Written so far", t.publishedCount],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between">
              <dt className="eyebrow">{k}</dt>
              <dd className="font-serif text-2xl text-ink tabular-nums">{v}</dd>
            </div>
          ))}
          <div className="col-span-3 lg:col-span-1">
            <ProgressBar ids={ids} label="Your progress in this track" />
          </div>
        </dl>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Modules" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="eyebrow mb-3">Modules</p>
            <ol className="space-y-1 text-sm">
              {t.modules.map((m, i) => (
                <li key={m.slug}>
                  <a href={`#${m.slug}`} className="flex gap-3 rounded px-2 py-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink">
                    <span className="num-serif w-5 text-sm leading-6 text-muted">{i + 1}</span>
                    <span>{m.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="space-y-14">
          {t.modules.map((m, i) => (
            <section key={m.slug} id={m.slug} aria-labelledby={`${m.slug}-h`} className="scroll-mt-24">
              <div className="grid gap-x-6 sm:grid-cols-[4rem_1fr]">
                <span className="font-serif text-3xl text-muted tabular-nums">{i + 1}</span>
                <div>
                  <h2 id={`${m.slug}-h`} className="font-serif text-3xl font-semibold tracking-tight text-ink">
                    {m.title}
                  </h2>
                  <p className="mt-2 text-ink-2">{m.summary}</p>
                  <ol className="mt-5 border-t border-rule">
                    {m.lessons.map((l, j) => {
                      const num = `${i + 1}.${j + 1}`;
                      const inner = (
                        <>
                          <span className="num-serif w-10 shrink-0 text-sm text-muted">{num}</span>
                          <span className={`flex-1 ${l.published ? "text-ink" : "text-muted"}`}>{l.title}</span>
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
                            <Link href={l.href} className="flex min-h-12 items-center gap-3 py-2 hover:bg-surface-2/60">
                              {inner}
                            </Link>
                          ) : (
                            <div className="flex min-h-12 items-center gap-3 py-2">{inner}</div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
