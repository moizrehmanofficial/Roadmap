import Link from "next/link";
import { getTracks } from "@/lib/content";
import { SearchButton } from "@/components/search";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/mobile-menu";

export function Wordmark() {
  return (
    <Link href="/" className="group inline-flex items-baseline gap-1.5" aria-label="DevGuide home">
      <span className="font-serif text-[1.35rem] font-semibold tracking-tight text-ink">DevGuide</span>
      <span className="size-1.5 translate-y-[-2px] rounded-full bg-accent" aria-hidden />
    </Link>
  );
}

export function SiteHeader() {
  const tracks = getTracks().map((t) => ({ slug: t.slug, title: t.title, mark: t.mark }));
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
          <Link href="/#path" className="rounded-md px-3 py-2 text-ink-2 transition-colors hover:text-ink">
            Tracks
          </Link>
          <Link href="/playground" className="rounded-md px-3 py-2 text-ink-2 transition-colors hover:text-ink">
            Playground
          </Link>
          <Link href="/progress" className="rounded-md px-3 py-2 text-ink-2 transition-colors hover:text-ink">
            My progress
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <SearchButton />
          <ThemeToggle />
          <MobileMenu tracks={tracks} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          DevGuide — a field manual for building, shipping and securing software. Written and maintained by{" "}
          <a className="link" href="https://moizrehman.site" target="_blank" rel="noopener noreferrer">
            Moiz Rehman
          </a>
          .
        </p>
        <p className="font-mono text-xs">Progress is saved in this browser.</p>
      </div>
    </footer>
  );
}
