"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Project } from "@/content/projects";
import { Lightbox } from "./Lightbox";

type PlayerContextValue = {
  open: (project: Project) => void;
  close: () => void;
  active: Project | null;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

/**
 * Holds the single lightbox instance for the whole app.
 *
 * Only one full-attention player is ever mounted, and only while a film is
 * open. Tiles run their own muted preview streams under the governor's slot
 * limit; this is the one that plays with sound and controls.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Project | null>(null);

  const open = useCallback((project: Project) => setActive(project), []);
  const close = useCallback(() => setActive(null), []);

  // Lock body scroll while the lightbox owns the viewport.
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  const value = useMemo(() => ({ open, close, active }), [open, close, active]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Keyed on the film so each one gets a fresh player with clean loading
          state, instead of a shared instance that must reset itself. */}
      <Lightbox key={active?.slug ?? "closed"} project={active} onClose={close} />
    </PlayerContext.Provider>
  );
}
