"use client";

import { useState } from "react";
import { driveThumb, driveThumbSrcSet, type PosterWidth } from "@/lib/drive";

/**
 * Poster frame with a one-shot retry.
 *
 * Even behind the cache proxy, the very first request for an uncached poster
 * can fail if Drive is throttling. Retrying once with a cache-busting suffix
 * turns that into a slightly late image instead of a permanently broken card.
 */
export function Poster({
  driveId,
  alt,
  width = 800,
  sizes,
  priority = false,
  className = "",
}: {
  driveId: string;
  alt: string;
  width?: PosterWidth;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  const bust = attempt > 0 ? `&retry=${attempt}` : "";

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- posters are sized
          upstream by width; see lib/drive.ts */}
      <img
        src={`${driveThumb(driveId, width)}${bust}`}
        srcSet={sizes ? driveThumbSrcSet(driveId) : undefined}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => {
          if (attempt < 2) {
            // Small backoff before asking again.
            setTimeout(() => setAttempt((a) => a + 1), 400 * (attempt + 1));
          } else {
            setFailed(true);
          }
        }}
        className={className}
        style={failed ? { opacity: 0 } : undefined}
      />
      {failed && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-surface-2 to-surface"
        />
      )}
    </>
  );
}
