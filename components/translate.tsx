"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";

/*
 * Bilingual blocks: easy English by default, Roman Urdu on demand.
 *
 *   <Tr>
 *   <En>…easy English…</En>
 *   <Ur>…Roman Urdu…</Ur>
 *   </Tr>
 *
 * Each block has its own small toggle. <LangSwitch /> (in the lesson header)
 * switches every block on the page at once and remembers the choice.
 */

const KEY = "devguide:lang";
const EVENT = "devguide:lang";
type Lang = "en" | "ur";

function readLang(): Lang {
  try {
    return localStorage.getItem(KEY) === "ur" ? "ur" : "en";
  } catch {
    return "en";
  }
}

function usePageLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    setLang(readLang());
    const on = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  const set = (l: Lang) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage blocked — still switch for this visit */
    }
    window.dispatchEvent(new CustomEvent<Lang>(EVENT, { detail: l }));
  };
  return [lang, set];
}

export function Tr({ children }: { children: ReactNode }) {
  const [pageLang] = usePageLang();
  const [own, setOwn] = useState<Lang | null>(null);
  useEffect(() => setOwn(null), [pageLang]); // the page switch overrides single-block choices
  const lang = own ?? pageLang;
  const next: Lang = lang === "ur" ? "en" : "ur";
  return (
    <div className={`tr tr-show-${lang}`}>
      <button
        type="button"
        className="tr-btn"
        onClick={() => setOwn(next)}
        aria-label={lang === "ur" ? "Show this in English" : "Show this in Roman Urdu"}
        title={lang === "ur" ? "Show this in English" : "Show this in Roman Urdu"}
      >
        <Languages aria-hidden size={13} />
        <span>{lang === "ur" ? "English" : "Roman Urdu"}</span>
      </button>
      {children}
    </div>
  );
}

export function En({ children }: { children: ReactNode }) {
  return <div className="tr-en">{children}</div>;
}

export function Ur({ children }: { children: ReactNode }) {
  return (
    <div className="tr-ur" lang="ur-Latn">
      {children}
    </div>
  );
}

/** Page-wide switch for the lesson header. */
export function LangSwitch() {
  const [lang, setLang] = usePageLang();
  return (
    <div className="lang-switch" role="group" aria-label="Explanation language">
      <Languages aria-hidden size={15} />
      <span className="lang-switch-label">Explanations in:</span>
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
        English
      </button>
      <button type="button" aria-pressed={lang === "ur"} onClick={() => setLang("ur")}>
        Roman Urdu
      </button>
    </div>
  );
}
