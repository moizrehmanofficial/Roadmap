"use client";

/**
 * Smoothly scrolls to a heading, respecting the sticky header (scroll-padding-top)
 * and the user's reduced-motion setting, then briefly highlights the heading.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const top = el.getBoundingClientRect().top + window.scrollY - pad;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);

  // Highlight once the scroll has (roughly) arrived.
  el.classList.remove("heading-flash");
  const flash = () => {
    void el.offsetWidth; // restart the animation if clicked twice
    el.classList.add("heading-flash");
    window.setTimeout(() => el.classList.remove("heading-flash"), 1600);
  };
  if (reduce) return flash();
  let last = -1, still = 0;
  const watch = () => {
    const y = window.scrollY;
    still = Math.abs(y - last) < 1 ? still + 1 : 0;
    last = y;
    if (still >= 3) flash();
    else requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
}
