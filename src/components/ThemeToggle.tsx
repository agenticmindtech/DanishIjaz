"use client";

import { useSyncExternalStore } from "react";
import { setTheme, themeStore } from "@/lib/theme";

/**
 * Light/dark switch for the header.
 *
 * The icon crossfades rather than swapping: both glyphs are always mounted and
 * animate on opacity/rotation, so there is no layout shift and no frame where
 * the button is empty.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Light theme" : "Dark theme"}
      className={`group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-bone-dim transition-colors duration-300 hover:border-amber hover:text-amber ${className}`}
    >
      {/* Sun — shown in dark theme, where the button offers light. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`absolute h-4 w-4 transition-all duration-500 ${
          isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>

      {/* Moon — shown in light theme. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`absolute h-4 w-4 transition-all duration-500 ${
          isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
