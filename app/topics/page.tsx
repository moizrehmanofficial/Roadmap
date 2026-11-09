import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTracks, stats } from "@/lib/content";
import { ProgressBar } from "@/components/progress";

export const metadata: Metadata = {
  title: "All topics",
  description: "Every DevGuide lesson grouped by subject — Linux, networking, JavaScript, Docker, AWS, security and more.",
};

export default function TopicsPage() {
  const tracks = getTracks();
  const s = stats();
  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-10 sm:px-6 lg:pt-16">
      <p className="eyebrow">Library</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink">All topics</h1>
      <p className="mt-4 max-w-[64ch] text-lg text-ink-2">
        Every lesson, grouped by subject — {s.modules} modules and {s.lessons} lessons. Use this to look something up. To
        learn for a job, follow a{" "}
        <Link href="/#paths" className="link">
          career path
        </Link>{" "}
        instead: it puts these lessons in the right order for you.
      </p>

      <ol className="mt-12 border-t border-ink">
        {tracks.map((t) => {
          const ids = t.modules.flatMap((m) => m.lessons.map((l) => l.id));
          return (
            <li key={t.slug} className="reveal border-b border-rule">
              <Link
                href={`/tracks/${t.slug}`}
                className="group row-hover -mx-3 grid gap-x-8 gap-y-3 rounded-md px-3 py-6 transition-colors hover:bg-surface/70 md:grid-cols-[1fr_16rem] md:items-start"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="size-2 rounded-full" style={{ background: t.mark }} aria-hidden />
                    <h2 className="font-serif text-2xl font-semibold text-ink">{t.title}</h2>
                    <ArrowRight aria-hidden size={18} className="nudge text-muted group-hover:text-accent" />
                  </div>
                  <p className="mt-2 max-w-[70ch] text-ink-2">{t.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{t.modules.map((m) => m.title).join("  ·  ")}</p>
                </div>
                <div className="space-y-2 md:pt-2">
                  <div className="num flex justify-between text-xs text-muted">
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
    </main>
  );
}
