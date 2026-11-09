"use client";

import { useEffect } from "react";

export const ACTIVE_PATH_KEY = "devguide:active-path";

export function getActivePath(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PATH_KEY);
  } catch {
    return null;
  }
}
export function setActivePath(slug: string | null) {
  try {
    if (slug) localStorage.setItem(ACTIVE_PATH_KEY, slug);
    else localStorage.removeItem(ACTIVE_PATH_KEY);
  } catch {}
}

/** Visiting a path page makes it your active path. */
export function RememberPath({ slug }: { slug: string }) {
  useEffect(() => setActivePath(slug), [slug]);
  return null;
}
