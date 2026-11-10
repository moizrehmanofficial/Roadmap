import { topicGroups } from "@/content/topics";
import { getTracks, type LessonRef, type ModuleView } from "@/lib/content";

export interface TopicView {
  slug: string;
  title: string;
  short: string;
  summary: string;
  mark: string;
  href: string;
  group: string;
  /** 1-based position in the overall learning order. */
  index: number;
  /** Sections shaped like modules, so module-based components can render topics. */
  modules: ModuleView[];
  lessonCount: number;
  publishedCount: number;
}

export interface TopicGroupView {
  title: string;
  summary: string;
  topics: TopicView[];
}

let cache: { groups: TopicGroupView[]; byLesson: Map<string, TopicView> } | null = null;

function build() {
  const modules = new Map<string, ModuleView>();
  for (const t of getTracks()) for (const m of t.modules) modules.set(`${t.slug}/${m.slug}`, m);

  const byLesson = new Map<string, TopicView>();
  let index = 0;
  const groups = topicGroups.map((g) => ({
    title: g.title,
    summary: g.summary,
    topics: g.topics.map((def) => {
      index += 1;
      const sections: ModuleView[] = def.sections.map((s) => {
        const mod = modules.get(s.module);
        if (!mod) throw new Error(`Topic "${def.slug}": unknown module "${s.module}"`);
        let lessons: LessonRef[] = mod.lessons;
        if (s.only) lessons = lessons.filter((l) => s.only!.includes(l.slug));
        if (s.except) lessons = lessons.filter((l) => !s.except!.includes(l.slug));
        for (const slug of [...(s.only ?? []), ...(s.except ?? [])]) {
          if (!mod.lessons.some((l) => l.slug === slug)) throw new Error(`Topic "${def.slug}": no lesson "${slug}" in ${s.module}`);
        }
        return { slug: s.id ?? mod.slug, title: s.title ?? mod.title, summary: s.summary ?? mod.summary, lessons };
      });
      const all = sections.flatMap((s) => s.lessons);
      const view: TopicView = {
        slug: def.slug,
        title: def.title,
        short: def.title,
        summary: def.summary,
        mark: def.mark,
        href: `/topics/${def.slug}`,
        group: g.title,
        index,
        modules: sections,
        lessonCount: all.length,
        publishedCount: all.filter((l) => l.published).length,
      };
      for (const l of all) {
        if (byLesson.has(l.id)) throw new Error(`Lesson "${l.id}" is in topics "${byLesson.get(l.id)!.slug}" and "${def.slug}"`);
        byLesson.set(l.id, view);
      }
      return view;
    }),
  }));

  const missing = [...modules.values()].flatMap((m) => m.lessons).filter((l) => !byLesson.has(l.id));
  if (missing.length) throw new Error(`Lessons not in any topic (content/topics.ts): ${missing.map((l) => l.id).join(", ")}`);
  return { groups, byLesson };
}

function data() {
  if (!cache || process.env.NODE_ENV !== "production") cache = build();
  return cache;
}

export function getTopicGroups(): TopicGroupView[] {
  return data().groups;
}

export function getTopics(): TopicView[] {
  return data().groups.flatMap((g) => g.topics);
}

export function getTopic(slug: string) {
  return getTopics().find((t) => t.slug === slug) ?? null;
}

export function topicForLesson(id: string) {
  return data().byLesson.get(id) ?? null;
}

/** The topic section (module) that holds a lesson, for anchors like /topics/javascript#react. */
export function sectionForLesson(id: string) {
  const topic = topicForLesson(id);
  const section = topic?.modules.find((m) => m.lessons.some((l) => l.id === id)) ?? null;
  return { topic, section };
}
