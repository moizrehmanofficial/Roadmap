import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLesson, publishedLessons } from "@/lib/content";
import { renderLesson } from "@/lib/mdx";
import { sectionForLesson } from "@/lib/topics";
import { LessonNav } from "@/components/lesson-nav";
import { Drawer } from "@/components/drawer";
import { BackToTop, ReadingProgress, RevealCurrent, SectionBar, Toc } from "@/components/toc";
import { MarkComplete, TrackVisit } from "@/components/progress";
import { LangSwitch } from "@/components/translate";
import { PathBar, PathPrevNext, PathProvider, PathSidebar, SidebarLabel } from "@/components/path-context";

type Params = { track: string; module: string; lesson: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return publishedLessons().map((l) => ({ track: l.track, module: l.module, lesson: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await params;
  const l = getLesson(p.track, p.module, p.lesson);
  return l ? { title: l.frontmatter.title, description: l.frontmatter.summary } : {};
}

const LEVEL: Record<string, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const p = await params;
  const lesson = getLesson(p.track, p.module, p.lesson);
  if (!lesson) notFound();
  const { ref, frontmatter: fm, headings } = lesson;
  // Lessons are browsed by topic (content/topics.ts); fall back to the curriculum track if needed.
  const { topic, section } = sectionForLesson(ref.id);
  const track = topic ?? { ...lesson.track, href: `/tracks/${lesson.track.slug}` };
  const mod = section ?? lesson.module;
  const inTopic = track.modules.flatMap((m) => m.lessons).filter((l) => l.published);
  const at = inTopic.findIndex((l) => l.id === ref.id);
  const prev = at > 0 ? inTopic[at - 1] : null;
  const next = at >= 0 && at < inTopic.length - 1 ? inTopic[at + 1] : null;
  const body = await renderLesson(lesson.source);
  const posInModule = mod.lessons.findIndex((l) => l.id === ref.id) + 1;

  return (
    <PathProvider lessonId={ref.id} title={fm.title}>
    <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_14rem]">
      <TrackVisit id={ref.id} href={ref.href} title={fm.title} />
      <ReadingProgress />
      <BackToTop />

      <aside className="hidden lg:block">
        <div id="lesson-sidebar" className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-8 pr-2">
          <PathSidebar>
            <LessonNav track={track} currentId={ref.id} />
          </PathSidebar>
        </div>
        <RevealCurrent containerId="lesson-sidebar" />
      </aside>

      <main className="min-w-0 pb-10 lg:pt-10">
        <SectionBar headings={headings}>
          <div className="shrink-0 lg:hidden">
            <Drawer label={<SidebarLabel />}>
              <PathSidebar>
                <LessonNav track={track} currentId={ref.id} />
              </PathSidebar>
            </Drawer>
          </div>
        </SectionBar>
        <div className="h-6 xl:hidden" />

        <article className="mx-auto max-w-[72ch]">
          <header className="border-b border-rule pb-8">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href="/topics" className="hover:text-ink">
                All topics
              </Link>
              <span className="mx-2">/</span>
              <Link href={track.href} className="hover:text-ink">
                {track.title}
              </Link>
              {track.modules.length > 1 && (
                <>
                  <span className="mx-2">/</span>
                  <Link href={`${track.href}#${mod.slug}`} className="hover:text-ink">
                    {mod.title}
                  </Link>
                </>
              )}
            </nav>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {fm.title}
            </h1>
            {fm.summary && <p className="mt-4 text-lg text-ink-2">{fm.summary}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted num">
              <span>
                Topic: {mod.title} · lesson {posInModule} of {mod.lessons.length}
              </span>
              {fm.level && <span>{LEVEL[fm.level]}</span>}
              {fm.minutes && <span>{fm.minutes} min read</span>}
              {fm.edition === 1 && (
                <span className="rounded border border-rule px-1.5 py-0.5" title="Short first-edition lesson. A full rewrite is planned.">
                  First edition · expansion planned
                </span>
              )}
            </div>
            {fm.prerequisites && fm.prerequisites.length > 0 && (
              <p className="mt-4 text-sm text-ink-2">
                <span className="font-medium text-ink">Before this:</span> {fm.prerequisites.join(", ")}
              </p>
            )}
            {lesson.source.includes("<Ur>") && (
              <div className="mt-5">
                <LangSwitch />
              </div>
            )}
            <PathBar />
          </header>

          <div className="prose-dg pt-2">{body}</div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-8">
            <MarkComplete id={ref.id} next={next ? { href: next.href, title: next.title } : null} />
            <Link href="/playground" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
              Open the playground
            </Link>
          </div>

          <PathPrevNext>
          <nav aria-label="Lesson navigation" className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={prev.href} className="group btn rounded-md border border-rule p-4 transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.4)]">
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <ArrowLeft aria-hidden size={13} className="transition-transform group-hover:-translate-x-1" /> Previous
                </span>
                <span className="mt-1 block font-medium text-ink">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={next.href} className="group btn rounded-md border border-rule p-4 text-right transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.4)]">
                <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
                  Next <ArrowRight aria-hidden size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-1 block font-medium text-ink">{next.title}</span>
              </Link>
            )}
          </nav>
          </PathPrevNext>
        </article>
      </main>

      <aside className="hidden xl:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain py-10 pr-1">
          <Toc headings={headings} />
        </div>
      </aside>
    </div>
    </PathProvider>
  );
}
