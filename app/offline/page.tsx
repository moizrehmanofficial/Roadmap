import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-[60ch] px-4 py-24 text-center">
      <p className="eyebrow">Offline</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">This page is not saved on your device yet</h1>
      <p className="mt-4 text-ink-2">
        You are offline. Lessons you have opened before still work. To read everything without internet, go to My progress
        and use “Save all lessons for offline” next time you are online.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-medium text-paper">
          Home
        </Link>
        <Link href="/progress" className="btn inline-flex min-h-11 items-center rounded-md border border-rule-strong px-5 font-medium text-ink">
          My progress
        </Link>
      </div>
    </main>
  );
}
