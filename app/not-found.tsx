import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[60ch] px-4 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">This page is not in the guide</h1>
      <p className="mt-4 text-ink-2">The lesson may not be written yet, or the link is out of date.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-medium text-paper">
          Home
        </Link>
        <Link href="/roadmaps" className="inline-flex min-h-11 items-center rounded-md border border-rule-strong px-5 font-medium text-ink">
          Roadmaps
        </Link>
      </div>
    </main>
  );
}
