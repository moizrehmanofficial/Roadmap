import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getPaths } from "@/lib/paths";
import { stats } from "@/lib/content";
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

const CHOOSER: [string, string][] = [
  ["build websites and web apps", "full-stack-developer"],
  ["automate servers, deployments and pipelines", "devops-engineer"],
  ["design and run infrastructure on AWS, Azure or GCP", "cloud-engineer"],
  ["defend against attacks, or test systems like a hacker", "cyber-security-analyst"],
  ["put security into CI/CD, containers and Kubernetes", "devsecops-engineer"],
  ["secure cloud accounts, identities and data", "cloud-security-engineer"],
];

export default function HomePage() {
  const s = stats();
  const paths = getPaths();
  const bySlug = Object.fromEntries(paths.map((p) => [p.slug, p]));

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-4 pb-14 pt-14 sm:px-6 lg:pt-24">
        <div className="max-w-4xl">
          <p className="eyebrow rise" style={{ ["--i" as string]: 0 }}>
            {paths.length} career paths · {s.lessons} lessons · free and offline
          </p>
          <h1
            style={{ ["--i" as string]: 1 }}
            className="rise mt-5 font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.25rem]"
          >
            Choose what you want to become. Follow one path, start to finish.
          </h1>
          <p style={{ ["--i" as string]: 2 }} className="rise mt-6 max-w-[62ch] text-lg leading-relaxed text-ink-2">
            Each path takes you from the very first foundation to job-ready, in the right order — nothing extra, nothing
            missing. Lessons you finish on one path count on every other path too.
          </p>
          <div style={{ ["--i" as string]: 3 }} className="rise mt-9 flex flex-wrap gap-3">
            <Link
              href="#paths"
              className="btn group inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-medium text-paper hover:opacity-90"
            >
              Pick a path
              <ArrowRight aria-hidden size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/topics"
              className="btn inline-flex min-h-12 items-center rounded-md border border-rule-strong px-5 font-medium text-ink hover:border-ink"
            >
              Browse all topics
            </Link>
          </div>
          <div style={{ ["--i" as string]: 4 }} className="rise mt-10 max-w-md">
            <ContinueLearning />
          </div>
        </div>
      </section>

      {/* Paths */}
      <section id="paths" className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <p className="eyebrow">Career paths</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">Pick one and follow it</h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((p, i) => {
              const ids = p.stages.flatMap((st) => st.lessons.map((l) => l.id));
              return (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="reveal group row-hover btn flex flex-col rounded-lg border border-rule bg-surface p-6 transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="num-serif text-2xl text-muted transition-colors group-hover:text-accent">{i + 1}</span>
                    <span className="size-2.5 rounded-full" style={{ background: p.mark }} aria-hidden />
                  </div>
                  <h3 className="mt-4 flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
                    {p.title}
                    <ArrowRight aria-hidden size={18} className="nudge text-muted group-hover:text-accent" />
                  </h3>
                  <p className="mt-2 flex-1 text-ink-2">{p.tagline}</p>
                  <div className="mt-6 space-y-2">
                    <div className="num flex justify-between text-xs text-muted">
                      <span>
                        {p.stages.length} stages · {p.lessonCount} lessons
                      </span>
                      <span>{p.publishedCount} written</span>
                    </div>
                    <ProgressBar ids={ids} label={`${p.title} progress`} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Chooser */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-ink">Not sure which one?</h2>
              <p className="mt-3 max-w-[48ch] text-ink-2">
                Start with what you want to do every day. You can switch later — your finished lessons come with you.
              </p>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {CHOOSER.map(([want, slug]) => (
                <li key={slug}>
                  <Link href={`/paths/${slug}`} className="group row-hover flex items-center gap-4 py-3.5">
                    <span className="flex-1 text-ink-2">
                      I want to <span className="text-ink">{want}</span>
                    </span>
                    <span className="nudge flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-accent">
                      {bySlug[slug].title} <ArrowRight aria-hidden size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lesson anatomy */}
      <section className="border-t border-rule">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Every lesson</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Written the same way, so nothing is skipped</h2>
            <p className="mt-3 max-w-[48ch] text-ink-2">
              Every topic answers the same questions in the same order — from a plain definition to how attackers abuse it
              and what interviewers ask about it.
            </p>
          </div>
          <ol className="grid gap-x-8 sm:grid-cols-2">
            {ANATOMY.map(([k, v], i) => (
              <li key={k} className="reveal flex gap-3 border-b border-rule py-3 text-sm">
                <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-ok" />
                <span>
                  <span className="font-medium text-ink">
                    {i + 1}. {k}
                  </span>{" "}
                  <span className="text-ink-2">— {v}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
