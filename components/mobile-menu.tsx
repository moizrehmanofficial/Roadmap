"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function MobileMenu({ paths }: { paths: { slug: string; title: string; mark: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="inline-flex size-10 items-center justify-center rounded-md text-ink-2 hover:bg-surface-2 hover:text-ink"
      >
        <Menu aria-hidden size={19} />
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        className="sheet-right m-0 ml-auto h-dvh max-h-none w-[min(320px,86vw)] border-l border-rule bg-paper p-0 text-ink backdrop:bg-black/40"
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-rule px-4">
          <span className="eyebrow">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-surface-2"
          >
            <X aria-hidden size={19} />
          </button>
        </div>
        <nav aria-label="Mobile" className="p-2">
          {[
            ["/", "Home"],
            ["/roadmaps", "Roadmaps"],
            ["/topics", "All topics"],
            ["/playground", "Playground"],
            ["/progress", "My progress"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="flex min-h-11 items-center rounded-md px-3 text-[15px] hover:bg-surface-2">
              {label}
            </Link>
          ))}
          <div className="eyebrow mt-4 px-3 pb-1">Roadmaps</div>
          {paths.map((t) => (
            <Link
              key={t.slug}
              href={`/paths/${t.slug}`}
              className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[15px] hover:bg-surface-2"
            >
              <span className="size-2 rounded-full" style={{ background: t.mark }} aria-hidden />
              {t.title}
            </Link>
          ))}
        </nav>
      </dialog>
    </div>
  );
}
