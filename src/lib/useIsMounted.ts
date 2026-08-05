"use client";

import { useSyncExternalStore } from "react";

/** Never fires — "have we hydrated" is not a value that changes afterwards. */
const subscribe = () => () => {};

/**
 * Guards `createPortal` calls, which need a real `document`.
 *
 * `useSyncExternalStore` is the purpose-built tool here: it returns the server
 * snapshot (false) during SSR and hydration, then the client snapshot (true),
 * without the setState-inside-an-effect round trip that the older
 * `useState` + `useEffect` version needed.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
