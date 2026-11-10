import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getTracks, plainText } from "@/lib/content";
import { sectionForLesson } from "@/lib/topics";

export const dynamic = "force-static";

export interface SearchDoc {
  id: string;
  title: string;
  href: string;
  track: string;
  topicHref?: string;
  module: string;
  summary: string;
  body: string;
  published: boolean;
}

export function GET() {
  const docs: SearchDoc[] = [];
  for (const t of getTracks()) {
    for (const m of t.modules) {
      for (const l of m.lessons) {
        let body = "";
        if (l.published) {
          const file = path.join(process.cwd(), "content", "lessons", l.track, l.module, `${l.slug}.mdx`);
          body = plainText(matter(fs.readFileSync(file, "utf8")).content).slice(0, 3000);
        }
        const { topic, section } = sectionForLesson(l.id);
        docs.push({
          id: l.id,
          title: l.title,
          href: l.published ? l.href : topic ? `${topic.href}#${section!.slug}` : `/tracks/${t.slug}#${m.slug}`,
          track: topic?.title ?? t.title,
          topicHref: topic?.href,
          module: section?.title ?? m.title,
          summary: l.summary ?? m.summary,
          body,
          published: l.published,
        });
      }
    }
  }
  return Response.json(docs);
}
