import type { Metadata } from "next";
import { getTracks } from "@/lib/content";
import { ProgressDashboard } from "@/components/progress-dashboard";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  const tracks = getTracks().map((t) => ({
    slug: t.slug,
    title: t.title,
    mark: t.mark,
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
      <ProgressDashboard tracks={tracks} />
    </main>
  );
}
