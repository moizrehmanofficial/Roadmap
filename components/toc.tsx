"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ArrowUp } from "lucide-react";
import { useActiveSection } from "@/lib/use-active-section";

type Heading = { depth: 2 | 3; text: string; id: string };

/** Desktop right-hand "On this page" list with the current section highlighted. */
export function Toc({ headings }: { headings: Heading[] }) {
  const h2 = useMemo(() => headings.filter((h) => h.depth === 2), [headings]);
  const ids = useMemo(() => h2.map((h) => h.id), [h2]);
  const active = useActiveSection(ids);
  if (h2.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-0.5 border-l border-rule">
        {h2.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "true" : undefined}
              className={`-ml-px block border-l-2 py-1 pl-3 transition-colors ${
                active === h.id ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Phone / tablet: a sticky bar that always shows which section you are in, with a jump menu. */
export function SectionBar({ headings, children }: { headings: Heading[]; children?: React.ReactNode }) {
  const h2 = useMemo(() => headings.filter((h) => h.depth === 2), [headings]);
  const ids = useMemo(() => h2.map((h) => h.id), [h2]);
  const active = useActiveSection(ids, 200);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = h2.find((h) => h.id === active);
  const index = h2.findIndex((h) => h.id === active);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="sticky top-16 z-20 -mx-4 border-b border-rule bg-paper/95 backdrop-blur sm:-mx-6 xl:hidden">
      <div className="flex items-center gap-2 px-4 py-2 sm:px-6">
        {children}
        {h2.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-md border border-rule bg-surface px-3 text-left text-sm"
          >
            <span className="min-w-0 truncate">
              <span className="num mr-2 text-muted">
                {index + 1}/{h2.length}
              </span>
              <span className="text-ink">{current?.text ?? "On this page"}</span>
            </span>
            <ChevronDown aria-hidden size={16} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {open && (
        <ul className="absolute inset-x-0 top-full max-h-[60vh] overflow-y-auto border-y border-rule bg-surface px-2 py-2 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.4)]">
          {h2.map((h, i) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded px-3 text-[15px] ${
                  h.id === active ? "bg-accent-soft/70 font-medium text-ink" : "text-ink-2"
                }`}
              >
                <span className="num w-5 text-xs text-muted">{i + 1}</span>
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Thin bar under the header showing how far through the lesson you are. */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-16 z-30 h-0.5">
      <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${pct}%` }} />
    </div>,
    document.body
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return createPortal(
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="pop-in fixed bottom-5 right-5 z-30 inline-flex size-11 items-center justify-center rounded-full border border-rule-strong bg-surface text-ink shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] hover:border-ink"
    >
      <ArrowUp aria-hidden size={18} />
    </button>,
    document.body
  );
}

/** Scrolls the current lesson into view inside the (long) sidebar on first load. */
export function RevealCurrent({ containerId }: { containerId: string }) {
  useEffect(() => {
    const box = document.getElementById(containerId);
    const cur = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (box && cur) box.scrollTop = cur.offsetTop - box.clientHeight / 3;
  }, [containerId]);
  return null;
}
