import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { tracks as trackDefs, type LessonEntry } from "@/content/curriculum";
import { slugify } from "@/lib/slug";
import GithubSlugger from "github-slugger";

const LESSON_ROOT = path.join(process.cwd(), "content", "lessons");

export type Level = "beginner" | "intermediate" | "advanced";

export interface LessonFrontmatter {
  title: string;
  summary: string;
  level?: Level;
  minutes?: number;
  prerequisites?: string[];
  tags?: string[];
  updated?: string;
  edition?: number;
}

export interface LessonRef {
  id: string; // track/module/lesson
  track: string;
  module: string;
  slug: string;
  title: string;
  href: string;
  published: boolean;
  summary?: string;
  level?: Level;
  minutes?: number;
  edition?: number;
}

export interface ModuleView {
  slug: string;
  title: string;
  summary: string;
  lessons: LessonRef[];
}

export interface TrackView {
  slug: string;
  title: string;
  short: string;
  summary: string;
  mark: string;
  modules: ModuleView[];
  lessonCount: number;
  publishedCount: number;
}

function entryTitle(e: LessonEntry) {
  return typeof e === "string" ? e : e[0];
}
function entrySlug(e: LessonEntry) {
  return typeof e === "string" ? slugify(e) : e[1];
}

function lessonFile(track: string, mod: string, slug: string) {
  return path.join(LESSON_ROOT, track, mod, `${slug}.mdx`);
}

function readFrontmatter(file: string): LessonFrontmatter | null {
  if (!fs.existsSync(file)) return null;
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return data as LessonFrontmatter;
}

let cache: TrackView[] | null = null;

export function getTracks(): TrackView[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = trackDefs.map((t) => {
    const modules: ModuleView[] = t.modules.map((m) => ({
      slug: m.slug,
      title: m.title,
      summary: m.summary,
      lessons: m.lessons.map((e) => {
        const slug = entrySlug(e);
        const fm = readFrontmatter(lessonFile(t.slug, m.slug, slug));
        return {
          id: `${t.slug}/${m.slug}/${slug}`,
          track: t.slug,
          module: m.slug,
          slug,
          title: fm?.title ?? entryTitle(e),
          href: `/learn/${t.slug}/${m.slug}/${slug}`,
          published: !!fm,
          summary: fm?.summary,
          level: fm?.level,
          minutes: fm?.minutes,
          edition: fm?.edition,
        };
      }),
    }));
    const all = modules.flatMap((m) => m.lessons);
    return {
      slug: t.slug,
      title: t.title,
      short: t.short,
      summary: t.summary,
      mark: t.mark,
      modules,
      lessonCount: all.length,
      publishedCount: all.filter((l) => l.published).length,
    };
  });
  return cache;
}

export function getTrack(slug: string) {
  return getTracks().find((t) => t.slug === slug) ?? null;
}

export function allLessons(): LessonRef[] {
  return getTracks().flatMap((t) => t.modules.flatMap((m) => m.lessons));
}

export function publishedLessons(): LessonRef[] {
  return allLessons().filter((l) => l.published);
}

export function getLesson(track: string, mod: string, slug: string) {
  const t = getTrack(track);
  const m = t?.modules.find((x) => x.slug === mod);
  const ref = m?.lessons.find((x) => x.slug === slug);
  if (!t || !m || !ref || !ref.published) return null;
  const raw = fs.readFileSync(lessonFile(track, mod, slug), "utf8");
  const { content, data } = matter(raw);

  // prev / next among published lessons of the same track
  const inTrack = t.modules.flatMap((x) => x.lessons).filter((x) => x.published);
  const i = inTrack.findIndex((x) => x.id === ref.id);
  return {
    track: t,
    module: m,
    ref,
    frontmatter: data as LessonFrontmatter,
    source: content,
    headings: extractHeadings(content),
    prev: i > 0 ? inTrack[i - 1] : null,
    next: i < inTrack.length - 1 ? inTrack[i + 1] : null,
  };
}

export function extractHeadings(src: string) {
  const out: { depth: 2 | 3; text: string; id: string }[] = [];
  const slugger = new GithubSlugger();
  let inFence = false;
  for (const line of src.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[2].replace(/`/g, "");
      out.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
    }
  }
  return out;
}

export function plainText(src: string) {
  return src
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>|\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stats() {
  const t = getTracks();
  return {
    tracks: t.length,
    modules: t.reduce((a, x) => a + x.modules.length, 0),
    lessons: t.reduce((a, x) => a + x.lessonCount, 0),
    published: t.reduce((a, x) => a + x.publishedCount, 0),
  };
}
