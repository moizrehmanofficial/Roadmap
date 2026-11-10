import Link from "next/link";
import type { ModuleView } from "@/lib/content";
import { DoneMark } from "@/components/progress";

type Outline = { title: string; mark: string; href: string; modules: ModuleView[] };

/** Server-rendered topic outline. Uses native <details>, so it works without JS. */
export function LessonNav({ track, currentId }: { track: Outline; currentId: string }) {
  return (
    <nav aria-label={`${track.title} lessons`} className="text-sm">
      <Link href={track.href} className="flex items-center gap-2 px-2 py-1 font-medium text-ink hover:underline">
        <span className="size-2 rounded-full" style={{ background: track.mark }} aria-hidden />
        {track.title}
      </Link>
      <div className="mt-3 space-y-1">
        {track.modules.map((m) => {
          const open = m.lessons.some((l) => l.id === currentId);
          const pub = m.lessons.filter((l) => l.published).length;
          return (
            <details key={m.slug} open={open} className="group">
              <summary className="flex min-h-9 list-none items-center justify-between gap-2 rounded px-2 text-ink-2 hover:bg-surface-2 hover:text-ink [&::-webkit-details-marker]:hidden">
                <span>{m.title}</span>
                <span className="num text-xs text-muted">
                  {pub}/{m.lessons.length}
                </span>
              </summary>
              <ul className="mb-2 ml-2 border-l border-rule pl-2">
                {m.lessons.map((l) => {
                  const active = l.id === currentId;
                  return (
                    <li key={l.id}>
                      {l.published ? (
                        <Link
                          href={l.href}
                          aria-current={active ? "page" : undefined}
                          className={`-ml-[9px] flex min-h-8 items-center justify-between gap-2 border-l-2 py-1 pl-3 pr-1 ${
                            active
                              ? "border-accent font-medium text-ink"
                              : "border-transparent text-ink-2 hover:text-ink"
                          }`}
                        >
                          <span>{l.title}</span>
                          <DoneMark id={l.id} />
                        </Link>
                      ) : (
                        <span className="flex min-h-8 items-center py-1 pl-2 text-muted/80">{l.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </nav>
  );
}
