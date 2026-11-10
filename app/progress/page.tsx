import type { Metadata } from "next";
import { getTopics } from "@/lib/topics";
import { getPaths } from "@/lib/paths";
import Link from "next/link";
import { ProgressBar } from "@/components/progress";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { InstallButton, OfflineSaver } from "@/components/pwa";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  const tracks = getTopics().map((t) => ({
    slug: t.slug,
    title: t.title,
    mark: t.mark,
    href: t.href,
    modules: t.modules.map((m) => ({ title: m.title, ids: m.lessons.map((l) => l.id) })),
  }));
  return (
    <main className="mx-auto max-w-[1000px] px-4 pb-10 pt-10 sm:px-6 lg:pt-16">
      <p className="eyebrow">Your notebook</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink">My progress</h1>
      <p className="mt-4 max-w-[60ch] text-ink-2">
        Progress is stored in this browser. To move it to your phone or another laptop, export it here and import it
        there.
      </p>
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">Roadmaps</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {getPaths().map((p) => (
            <li key={p.slug}>
              <Link href={p.href} className="flex items-center gap-2 font-medium text-ink hover:underline">
                <span className="size-2 rounded-full" style={{ background: p.mark }} aria-hidden />
                {p.title}
              </Link>
              <div className="mt-2">
                <ProgressBar ids={p.stages.flatMap((s) => s.lessons.map((l) => l.id))} label={`${p.title} progress`} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-md border border-rule bg-surface p-5">
        <h2 className="font-serif text-2xl font-semibold text-ink">Use it like an app</h2>
        <p className="mt-2 max-w-[60ch] text-sm text-ink-2">
          Install DevGuide on your phone or computer, then save the lessons so you can study without internet — on the bus,
          during load-shedding, anywhere.
        </p>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <InstallButton variant="full" />
          <OfflineSaver />
        </div>
      </section>
      <ProgressDashboard tracks={tracks} />
    </main>
  );
}
