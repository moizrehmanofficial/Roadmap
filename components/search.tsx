"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search as SearchIcon, CornerDownLeft } from "lucide-react";
import type { SearchDoc } from "@/app/search.json/route";

let docsPromise: Promise<SearchDoc[]> | null = null;
function loadDocs() {
  docsPromise ??= fetch("/search.json").then((r) => r.json());
  return docsPromise;
}

export function SearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /input|textarea|select/i.test(target.tagName) || target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Phone: icon only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search lessons"
        className="inline-flex size-10 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <SearchIcon aria-hidden size={17} />
      </button>
      {/* Desktop: full field */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 w-56 items-center gap-2 rounded-md border border-rule bg-surface px-3 text-sm text-muted transition-colors hover:border-rule-strong md:inline-flex"
      >
        <SearchIcon aria-hidden size={15} />
        <span className="flex-1 text-left">Search lessons</span>
        <kbd className="rounded border border-rule px-1.5 font-mono text-[11px]">Ctrl K</kbd>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    ref.current?.showModal();
    loadDocs().then(setDocs).catch(() => setDocs([]));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: "title", weight: 3 },
          { name: "module", weight: 1.2 },
          { name: "track", weight: 0.8 },
          { name: "summary", weight: 1 },
          { name: "body", weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        useExtendedSearch: true,
        minMatchCharLength: 2,
      }),
    [docs]
  );

  const results = useMemo(() => {
    if (!q.trim()) return docs.filter((d) => d.published).slice(0, 8);
    // Each word must match somewhere (order-independent): "kubernetes rbac" finds "RBAC in Kubernetes".
    const query = q
      .trim()
      .split(/\s+/)
      .map((w) => w.replace(/[|'!^=$]/g, ""))
      .filter(Boolean)
      .join(" ");
    return fuse.search(query, { limit: 20 }).map((r) => r.item);
  }, [q, fuse, docs]);

  useEffect(() => setActive(0), [q]);

  const go = useCallback(
    (d: SearchDoc) => {
      onClose();
      router.push(d.href);
    },
    [onClose, router]
  );

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-0 mx-auto mt-[10vh] w-[min(640px,calc(100vw-1.5rem))] max-w-none rounded-lg border border-rule bg-surface p-0 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] backdrop:bg-black/40"
      aria-label="Search lessons"
    >
      <div className="flex items-center gap-3 border-b border-rule px-4">
        <SearchIcon aria-hidden size={17} className="shrink-0 text-muted" />
        <label htmlFor="dg-search" className="sr-only">
          Search lessons
        </label>
        <input
          id="dg-search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              go(results[active]);
            }
          }}
          placeholder="Try “closures”, “kubernetes rbac”, “s3”…"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="hidden rounded border border-rule px-1.5 font-mono text-[11px] text-muted sm:block">Esc</kbd>
      </div>
      <ul className="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
        {docs.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Loading…</li>}
        {docs.length > 0 && results.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted">No lessons match “{q}”.</li>
        )}
        {results.map((d, i) => (
          <li key={d.id} role="option" aria-selected={i === active}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(d)}
              className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left ${
                i === active ? "bg-surface-2" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`truncate font-medium ${d.published ? "text-ink" : "text-muted"}`}>{d.title}</span>
                  {!d.published && (
                    <span className="shrink-0 rounded border border-rule px-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                      Planned
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted">
                  {d.track} · {d.module}
                </div>
              </div>
              {i === active && <CornerDownLeft aria-hidden size={14} className="mt-1 shrink-0 text-muted" />}
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
