"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PanelLeft, X } from "lucide-react";

export function Drawer({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-rule bg-surface px-3 text-sm text-ink-2"
      >
        <PanelLeft aria-hidden size={16} />
        {label}
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        className="sheet-left m-0 h-dvh max-h-none w-[min(340px,88vw)] border-r border-rule bg-paper p-0 text-ink backdrop:bg-black/40"
        aria-label={label}
      >
        <div className="flex h-14 items-center justify-between border-b border-rule px-4">
          <span className="eyebrow">{label}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-surface-2"
          >
            <X aria-hidden size={18} />
          </button>
        </div>
        <div className="p-3">{children}</div>
      </dialog>
    </>
  );
}
