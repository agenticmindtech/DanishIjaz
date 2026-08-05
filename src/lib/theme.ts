"use client";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "danish-theme";
export const DEFAULT_THEME: Theme = "light";

/**
 * The `<html data-theme>` attribute is the single source of truth.
 *
 * It is set by the blocking script in `layout.tsx` before first paint, which
 * means React never has to own the value — it only reads it. That ordering is
 * what removes the flash: by the time any component renders, the document is
 * already wearing the right theme.
 */

const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

/** Read straight off the DOM rather than mirroring it into module state —
 *  there is then no second copy that can drift from what is on screen. */
const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/** SSR paints the default; the blocking script corrects it before paint. */
const getServerSnapshot = (): Theme => DEFAULT_THEME;

export const themeStore = { subscribe, getSnapshot, getServerSnapshot };

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  // Private browsing and blocked storage both throw here. A theme that fails
  // to persist is a far smaller problem than one that throws mid-click.
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* not persisted — the toggle still works for this session */
  }

  listeners.forEach((listener) => listener());
}
