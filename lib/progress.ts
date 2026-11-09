"use client";

import { useSyncExternalStore } from "react";

/**
 * Learning progress, stored in this browser only (localStorage).
 * Shape is versioned so it can be migrated or synced to an account later.
 */
const KEY = "devguide:progress:v1";
const EVT = "devguide:progress";

export interface Progress {
  done: Record<string, number>; // lessonId -> completedAt (ms)
  last?: { id: string; href: string; title: string; at: number };
}

const EMPTY: Progress = { done: {} };
let cachedRaw: string | null = null;
let cached: Progress = EMPTY;

function read(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const p = raw ? (JSON.parse(raw) as Progress) : EMPTY;
    cached = { done: p.done ?? {}, last: p.last };
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full or blocked */
  }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVT, cb);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function setDone(id: string, value: boolean) {
  const p = read();
  const done = { ...p.done };
  if (value) done[id] = Date.now();
  else delete done[id];
  write({ ...p, done });
}

export function setLast(last: NonNullable<Progress["last"]>) {
  const p = read();
  if (p.last?.id === last.id && p.last?.href === last.href) return;
  write({ ...p, last });
}

export function resetProgress() {
  write(EMPTY);
}

export function exportProgress(): string {
  return JSON.stringify(read(), null, 2);
}

export function importProgress(json: string): boolean {
  try {
    const p = JSON.parse(json) as Progress;
    if (typeof p !== "object" || typeof p.done !== "object") return false;
    write({ done: p.done, last: p.last });
    return true;
  } catch {
    return false;
  }
}
