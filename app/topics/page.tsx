import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { stats } from "@/lib/content";
import { getTopicGroups } from "@/lib/topics";
import { ProgressBar } from "@/components/progress";

export const metadata: Metadata = {
  title: "All topics",
  description:
    "Every DevGuide lesson by technology, in learning order — Linux, Git, HTML, CSS, Tailwind, JavaScript, React, Node.js, Python, Docker, Kubernetes, AWS, security and more.",
};

export default function TopicsPage() {
  const groups = getTopicGroups();
  const s = stats();
  const topicCount = groups.reduce((a, g) => a + g.topics.length, 0);

  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-10 sm:px-6 lg:pt-16">
      <p className="eyebrow">Library</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink">All topics</h1>
      <p className="mt-4 max-w-[64ch] text-lg text-ink-2">
        {topicCount} topics and {s.lessons} lessons, in the order a beginner should learn them. Pick any technology to
        study it on its own, or follow a{" "}
        <Link href="/roadmaps" className="link">
          roadmap
        </Link>{" "}
        to learn exactly what one job needs.
      </p>

      {/* Quick jump */}
      <nav aria-label="Topic groups" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {groups.map((g) => (
          <a
            key={g.title}
            href={`#${g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="shrink-0 rounded-full border border-rule bg-surface px-3 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink"
          >
            {g.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-14">
        {groups.map((g) => (
          <section
            key={g.title}
            id={g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            aria-labelledby={`${g.title}-h`}
            className="scroll-mt-24"
          >
            <div className="border-b border-ink pb-3">
              <h2 id={`${g.title}-h`} className="font-serif text-3xl font-semibold tracking-tight text-ink">
                {g.title}
              </h2>
              <p className="mt-1 text-ink-2">{g.summary}</p>
            </div>
            <ol>
              {g.topics.map((t) => {
                const ids = t.modules.flatMap((m) => m.lessons.map((l) => l.id));
                return (
                  <li key={t.slug} className="reveal border-b border-rule">
                    <Link
                      href={t.href}
                      className="group row-hover -mx-3 grid gap-x-8 gap-y-3 rounded-md px-3 py-5 transition-colors hover:bg-surface/70 md:grid-cols-[3rem_1fr_16rem] md:items-start"
                    >
                      <span className="num-serif hidden pt-0.5 text-2xl text-muted transition-colors group-hover:text-accent md:block">
                        {t.index}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="size-2 rounded-full" style={{ background: t.mark }} aria-hidden />
                          <h3 className="font-serif text-2xl font-semibold text-ink">
                            <span className="num-serif mr-2 text-muted md:hidden">{t.index}.</span>
                            {t.title}
                          </h3>
                          <ArrowRight aria-hidden size={18} className="nudge text-muted group-hover:text-accent" />
                        </div>
                        <p className="mt-2 max-w-[70ch] text-ink-2">{t.summary}</p>
                        {t.modules.length > 1 && (
                          <p className="mt-3 text-sm leading-relaxed text-muted">{t.modules.map((m) => m.title).join("  ·  ")}</p>
                        )}
                      </div>
                      <div className="space-y-2 md:pt-2">
                        <div className="num flex justify-between text-xs text-muted">
                          <span>{t.lessonCount} lessons</span>
                          <span>{t.publishedCount} written</span>
                        </div>
                        <ProgressBar ids={ids} label={`${t.title} progress`} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
