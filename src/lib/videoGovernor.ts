"use client";

/**
 * Decides which video tiles are allowed to play right now.
 *
 * Every tile on the page wants to autoplay. Letting them all do it is not an
 * option: these are delivery masters, not web-optimised previews — the library
 * averages ~180MB per file and tops out at 1.2GB. Thirty-five simultaneous
 * streams would saturate the connection, and every byte is billed egress
 * through /api/stream.
 *
 * So tiles don't play, they *ask*. This module keeps a ranked register of who
 * wants to play and grants a small number of slots to the highest-priority
 * candidates. Everyone else holds their poster frame, which is indistinguishable
 * from a paused video at a glance.
 *
 * Priority is set by the tile (see PRIORITY below): a hovered tile outranks
 * everything, so the film the visitor is actually looking at always wins a slot
 * even if it means evicting one that was already running.
 */

export const PRIORITY = {
  /** Off-screen. Never granted. */
  HIDDEN: 0,
  /** Partially in view. */
  VISIBLE: 1,
  /** Substantially in view — the tiles someone is actually looking at. */
  PROMINENT: 2,
  /** Explicit intent: pointer is on this tile. Always wins. */
  HOVERED: 100,
} as const;

type Member = {
  priority: number;
  setGranted: (granted: boolean) => void;
  granted: boolean;
};

const members = new Map<symbol, Member>();

/**
 * How many videos may play at once.
 *
 * Deliberately small. Four concurrent master-quality streams is already several
 * megabytes a second; the visitor cannot meaningfully watch more than one.
 */
function slotCount(): number {
  if (typeof window === "undefined") return 0;

  // Honour an explicit request for less motion — an autoplaying grid is exactly
  // what that setting is about.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;

  // Respect metered / explicitly data-saving connections.
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return 0;
  if (
    connection?.effectiveType &&
    ["slow-2g", "2g"].includes(connection.effectiveType)
  ) {
    return 0;
  }
  // Chrome derives effectiveType from measured round-trip and throughput, so
  // this is a real signal rather than a guess about the radio.
  if (connection?.effectiveType === "3g") return 2;

  // Phones get fewer: smaller screens show fewer tiles and are likelier to be
  // on mobile data.
  return window.innerWidth < 768 ? 2 : 4;
}

let scheduled = false;

/** Recompute grants on the next frame, coalescing bursts of scroll updates. */
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    settle();
  });
}

function settle() {
  const slots = slotCount();

  const ranked = [...members.values()]
    .filter((m) => m.priority > PRIORITY.HIDDEN)
    .sort((a, b) => b.priority - a.priority);

  const winners = new Set(ranked.slice(0, slots));

  for (const member of members.values()) {
    const shouldPlay = winners.has(member);
    if (shouldPlay !== member.granted) {
      member.granted = shouldPlay;
      member.setGranted(shouldPlay);
    }
  }

  if (process.env.NODE_ENV === "development") {
    // Inspectable from the console as `__governor` when tuning slot counts.
    (window as unknown as Record<string, unknown>).__governor = {
      slots,
      members: [...members.values()].map((m) => ({
        priority: m.priority,
        granted: m.granted,
      })),
    };
  }
}

/** Register a tile. Returns an unsubscribe function. */
export function joinGovernor(setGranted: (granted: boolean) => void) {
  const key = Symbol("tile");
  members.set(key, { priority: PRIORITY.HIDDEN, setGranted, granted: false });

  return {
    setPriority(priority: number) {
      const member = members.get(key);
      if (!member || member.priority === priority) return;
      member.priority = priority;
      schedule();
    },
    leave() {
      members.delete(key);
      schedule();
    },
  };
}

if (typeof window !== "undefined") {
  // Slot count depends on viewport width and connection quality, both of which
  // can change mid-session.
  window.addEventListener("resize", schedule, { passive: true });
}
