"use client";

import { Moon, Sun } from "lucide-react";

export const themeScript = `(function(){try{var t=localStorage.getItem('devguide:theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("devguide:theme", dark ? "dark" : "light");
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="inline-flex size-10 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <Sun aria-hidden size={17} className="hidden dark:block" />
      <Moon aria-hidden size={17} className="dark:hidden" />
    </button>
  );
}
