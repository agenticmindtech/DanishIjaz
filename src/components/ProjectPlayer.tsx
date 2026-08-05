"use client";

import { useRef, useState } from "react";
import { driveOpen, driveStream } from "@/lib/drive";
import { MediaLoader } from "./MediaLoader";
import { Poster } from "./Poster";

/**
 * Inline player for the project detail page.
 *
 * A real `<video>` streamed through /api/stream, so it autoplays and scrubs.
 * Muted at first because an autoplay with sound would be blocked outright —
 * the controls are right there to turn it up.
 */
export function ProjectPlayer({
  driveId,
  title,
  aspect,
}: {
  driveId: string;
  title: string;
  aspect: "16:9" | "9:16";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const isVertical = aspect === "9:16";

  return (
    <div
      /* Everything layered on this player — loader, error state, controls —
         sits over the picture, so it keeps the dark scale in both themes. */
      data-theme="dark"
      className={`relative mx-auto mt-14 overflow-hidden rounded-xl border border-line bg-black ${
        isVertical ? "max-w-sm" : "max-w-6xl"
      }`}
      style={{ aspectRatio: isVertical ? "9 / 16" : "16 / 9" }}
    >
      {!playing && (
        <Poster
          driveId={driveId}
          alt={`${title} — still frame`}
          width={1200}
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[2px]"
        />
      )}

      <video
        ref={videoRef}
        src={driveStream(driveId)}
        title={title}
        autoPlay
        muted
        loop
        controls
        playsInline
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onWaiting={() => setPlaying(false)}
        onError={() => setFailed(true)}
        onProgress={() => {
          const video = videoRef.current;
          if (!video || video.buffered.length === 0 || !video.duration) return;
          setProgress(
            Math.min(video.buffered.end(0) / Math.min(video.duration, 10), 1),
          );
        }}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />

      {!playing && !failed && (
        <MediaLoader progress={progress} label="Loading film" />
      )}

      {failed && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ink/70 px-6 text-center">
          <p className="text-sm text-bone-dim">
            This film couldn&apos;t be streamed here.
          </p>
          <a
            href={driveOpen(driveId)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-amber px-4 py-2 text-sm text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            Watch on Drive
          </a>
        </div>
      )}
    </div>
  );
}
