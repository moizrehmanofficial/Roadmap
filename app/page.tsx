import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getPaths } from "@/lib/paths";
import { stats } from "@/lib/content";
import { ContinueLearning } from "@/components/progress";
import { PathCards, PathChooser } from "@/components/path-cards";

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
  const paths = getPaths();

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-4 pb-14 pt-14 sm:px-6 lg:pt-24">
        <div className="max-w-4xl">
          <p className="eyebrow rise" style={{ ["--i" as string]: 0 }}>
            {paths.length} roadmaps · {s.lessons} lessons · free and offline
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
              Pick a roadmap
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
          <p className="eyebrow">Roadmaps</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">Pick one and follow it</h2>

          <PathCards />

          <PathChooser />
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
