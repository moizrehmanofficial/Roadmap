"use client";

import { useEffect, useState } from "react";

export function Toc({ headings }: { headings: { depth: 2 | 3; text: string; id: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  const h2 = headings.filter((h) => h.depth === 2);
  if (h2.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-1 border-l border-rule">
        {h2.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 ${
                active === h.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
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
