import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { recommendedPath } from "@/content/curriculum";
import { getTrack, stats } from "@/lib/content";
import { ContinueLearning, ProgressBar } from "@/components/progress";

const ANATOMY = [
  ["What", "A plain definition before any jargon."],
  ["Why", "The problem it solves, and what breaks without it."],
  ["When & where", "The situations, files and systems where you meet it."],
  ["How", "How it works underneath, step by step."],
  ["Hands-on", "Commands and code you can run yourself."],
  ["Real world", "How companies actually use it in production."],
  ["Security lens", "How it gets attacked, misconfigured — and defended."],
  ["Interview", "Questions you will be asked, with model answers."],
];

export default function HomePage() {
  const s = stats();
  const path = recommendedPath.map((p) => ({ ...p, t: getTrack(p.track)! }));

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:pt-24">
        <div>
          <p className="eyebrow">
            {s.tracks} tracks · {s.modules} modules · {s.lessons} lessons
          </p>
          <h1 className="mt-5 max-w-[16ch] font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.25rem]">
            Learn how software is built, shipped and secured.
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-2">
            One continuous guide from your first terminal command to securing production in the cloud — full-stack
            development, Linux and networking, DevOps, cloud, cyber security, DevSecOps and cloud security. Every lesson
            answers the same questions, in the same order, so nothing is left as “you’ll pick it up later”.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/tracks/foundations"
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-medium text-paper transition-opacity hover:opacity-90"
            >
              Start with Foundations
              <ArrowRight aria-hidden size={17} />
            </Link>
            <Link
              href="#path"
              className="inline-flex min-h-12 items-center rounded-md border border-rule-strong px-5 font-medium text-ink transition-colors hover:border-ink"
            >
              See the full path
            </Link>
          </div>
          <div className="mt-10 max-w-md">
            <ContinueLearning />
          </div>
        </div>

        <aside aria-labelledby="anatomy" className="self-start rounded-md border border-rule bg-surface">
          <div className="border-b border-rule px-5 py-4">
            <h2 id="anatomy" className="font-serif text-xl font-semibold text-ink">
              How every lesson is written
            </h2>
          </div>
          <ol className="divide-y divide-rule">
            {ANATOMY.map(([k, v], i) => (
              <li key={k} className="grid grid-cols-[2rem_1fr] items-baseline gap-x-2 gap-y-0.5 px-5 py-3 text-sm sm:grid-cols-[2.25rem_7.5rem_1fr]">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-ink">{k}</span>
                <span className="col-start-2 text-ink-2 sm:col-start-3">{v}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* Path */}
      <section id="path" className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">The learning path</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">Eight tracks, in order</h2>
            </div>
            <p className="max-w-[46ch] text-ink-2">
              The order below is built for moving from full-stack development into DevSecOps and cloud security. You
              can jump into any track — each lesson lists what it assumes you know.
            </p>
          </div>

          <ol className="mt-12 border-t border-ink">
            {path.map(({ t, note }, i) => {
              const ids = t.modules.flatMap((m) => m.lessons.map((l) => l.id));
              return (
                <li key={t.slug} className="border-b border-rule">
                  <Link
                    href={`/tracks/${t.slug}`}
                    className="group grid gap-x-8 gap-y-3 py-7 md:grid-cols-[4rem_1fr_16rem] md:items-start"
                  >
                    <span className="font-serif text-3xl text-muted tabular-nums md:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="size-2 rounded-full" style={{ background: t.mark }} aria-hidden />
                        <h3 className="font-serif text-2xl font-semibold text-ink decoration-1 underline-offset-4 group-hover:underline">
                          {t.title}
                        </h3>
                      </div>
                      <p className="mt-2 max-w-[70ch] text-ink-2">{t.summary}</p>
                      <p className="mt-1 text-sm italic text-muted">{note}</p>
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {t.modules.map((m) => m.title).join("  ·  ")}
                      </p>
                    </div>
                    <div className="space-y-2 md:pt-2">
                      <div className="flex justify-between font-mono text-xs text-muted">
                        <span>{t.modules.length} modules</span>
                        <span>
                          {t.publishedCount} of {t.lessonCount} written
                        </span>
                      </div>
                      <ProgressBar ids={ids} label={`${t.title} progress`} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
