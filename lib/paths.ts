import { paths as pathDefs, type PathDef } from "@/content/paths";
import { getTracks, type LessonRef } from "@/lib/content";

export interface PathStageView {
  id: string; // anchor id: stage-1, stage-2…
  index: number;
  title: string;
  summary: string;
  optional: boolean;
  lessons: LessonRef[];
}

export interface PathView extends Omit<PathDef, "stages"> {
  stages: PathStageView[];
  lessonCount: number;
  publishedCount: number;
  href: string;
}

function lessonIndex() {
  const byModule = new Map<string, LessonRef[]>();
  const byId = new Map<string, LessonRef>();
  for (const t of getTracks()) {
    for (const m of t.modules) {
      byModule.set(`${t.slug}/${m.slug}`, m.lessons);
      for (const l of m.lessons) byId.set(l.id, l);
    }
  }
  return { byModule, byId };
}

/** Throws on a reference that does not exist, so typos fail the build. */
export function resolveItems(items: string[], seen: Set<string>, where: string) {
  const { byModule, byId } = lessonIndex();
  const out: LessonRef[] = [];
  for (const ref of items) {
    const list = byModule.get(ref) ?? (byId.has(ref) ? [byId.get(ref)!] : null);
    if (!list) throw new Error(`Unknown lesson or module "${ref}" in ${where}`);
    for (const l of list) {
      if (seen.has(l.id)) continue;
      seen.add(l.id);
      out.push(l);
    }
  }
  return out;
}

let cache: PathView[] | null = null;

export function getPaths(): PathView[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = pathDefs.map((p) => {
    const seen = new Set<string>();
    const stages = p.stages.map((s, i) => ({
      id: `stage-${i + 1}`,
      index: i + 1,
      title: s.title,
      summary: s.summary,
      optional: !!s.optional,
      lessons: resolveItems(s.items, seen, `${p.slug} → ${s.title}`),
    }));
    const all = stages.flatMap((s) => s.lessons);
    return {
      ...p,
      stages,
      lessonCount: all.length,
      publishedCount: all.filter((l) => l.published).length,
      href: `/paths/${p.slug}`,
    };
  });
  return cache;
}

export function getPath(slug: string) {
  return getPaths().find((p) => p.slug === slug) ?? null;
}

/** Compact data for client-side path navigation (served as /paths.json). */
export function pathsIndex() {
  const lessons: Record<string, { t: string; h: string; p: 0 | 1 }> = {};
  const list = getPaths().map((p) => ({
    slug: p.slug,
    title: p.title,
    mark: p.mark,
    stages: p.stages.map((s) => {
      for (const l of s.lessons) lessons[l.id] = { t: l.title, h: l.href, p: l.published ? 1 : 0 };
      return { title: s.title, ids: s.lessons.map((l) => l.id) };
    }),
  }));
  return { paths: list, lessons };
}
export type PathsIndex = ReturnType<typeof pathsIndex>;
