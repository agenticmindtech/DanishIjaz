"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsMounted } from "@/lib/useIsMounted";
import { driveOpen, driveStream } from "@/lib/drive";
import { categoryLabel, type Project } from "@/content/projects";
import { MediaLoader } from "./MediaLoader";
import { Poster } from "./Poster";

/**
 * The full-attention player.
 *
 * Now a real `<video>` rather than Drive's embed iframe: it autoplays with
 * sound on open (the click that opened it satisfies the browser's gesture
 * requirement), scrubs properly, and can be styled. The poster stays behind it
 * until frames arrive so the film is never a grey rectangle.
 */
export function Lightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const mounted = useIsMounted();
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const [forcedMute, setForcedMute] = useState(false);

  // Per-film state is reset by remounting, not by an effect: PlayerProvider
  // keys this component on the active slug, so switching films gives a clean
  // component rather than one that has to remember to clear itself.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  /**
   * Start playback.
   *
   * A bare `autoPlay` attribute is not enough: Chrome blocks autoplay with
   * sound unless it ties the element to a user gesture, and the element here
   * mounts a tick after the click that opened the dialog. So we ask
   * explicitly, and if sound is refused we fall back to muted playback rather
   * than leaving the viewer with a paused black rectangle.
   */
  const startPlayback = useCallback(async () => {
    const video = videoRef.current;
    // Both `loadedmetadata` and `canplay` call this — whichever lands first
    // wins, and a second attempt must not undo a fallback to muted.
    if (!video || startedRef.current) return;
    startedRef.current = true;

    try {
      video.muted = false;
      await video.play();
    } catch {
      try {
        video.muted = true;
        setForcedMute(true);
        await video.play();
      } catch {
        // Genuinely cannot play — the error surface below takes over.
      }
    }
  }, []);

  // Nothing open means nothing in the DOM. No animation library gets a say in
  // whether this overlay survives — see the note in globals.css.
  if (!mounted || !project) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — video player`}
      /* A full-screen film viewer is dark in both themes — the surround
         should disappear so the picture is the only lit thing on screen. */
      data-theme="dark"
      className="lightbox-in fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-xl"
    >
          <button
            aria-label="Close player"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-zoom-out"
          />

          <header className="relative z-10 flex items-start justify-between gap-6 px-5 py-5 md:px-10">
            <div className="min-w-0">
              <p className="eyebrow">{categoryLabel(project.category)}</p>
              <h2 className="display mt-1 truncate text-2xl md:text-3xl">
                {project.title}
              </h2>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              className="group flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm text-bone-dim transition-colors hover:border-amber hover:text-amber"
            >
              Close
              <span aria-hidden className="text-base leading-none">
                &times;
              </span>
            </button>
          </header>

          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-5 pb-4 md:px-10">
            <div
              className="lightbox-panel-in relative h-full max-h-full w-full overflow-hidden rounded-xl border border-line bg-black shadow-2xl"
              style={{
                aspectRatio: project.aspect === "9:16" ? "9 / 16" : "16 / 9",
                maxWidth:
                  project.aspect === "9:16"
                    ? "min(100%, calc((100vh - 12rem) * 9 / 16))"
                    : "min(100%, calc((100vh - 12rem) * 16 / 9))",
              }}
            >
              {!playing && (
                <Poster
                  driveId={project.driveId}
                  alt=""
                  width={1200}
                  priority
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
              )}

              <video
                key={project.driveId}
                ref={videoRef}
                src={driveStream(project.driveId)}
                title={project.title}
                controls
                playsInline
                preload="auto"
                onLoadedMetadata={startPlayback}
                onCanPlay={startPlayback}
                onPlaying={() => setPlaying(true)}
                onWaiting={() => setPlaying(false)}
                onError={() => setFailed(true)}
                onProgress={() => {
                  const video = videoRef.current;
                  if (!video || video.buffered.length === 0 || !video.duration)
                    return;
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

              {/* Chrome refused sound on open. Offer it as one click rather
                  than letting the film play silently by accident. */}
              {forcedMute && playing && (
                <button
                  type="button"
                  onClick={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    video.muted = false;
                    setForcedMute(false);
                  }}
                  className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber bg-ink/80 px-4 py-2 text-sm text-amber backdrop-blur-sm transition-colors hover:bg-amber hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM19 5.3 17.7 4 4 17.7 5.3 19 19 5.3z" />
                  </svg>
                  Tap for sound
                </button>
              )}

              {failed && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ink/70 px-6 text-center">
                  <p className="text-sm text-bone-dim">
                    This film couldn&apos;t be streamed here.
                  </p>
                  <a
                    href={driveOpen(project.driveId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-amber px-4 py-2 text-sm text-amber transition-colors hover:bg-amber hover:text-ink"
                  >
                    Watch on Drive
                  </a>
                </div>
              )}
            </div>
          </div>

          <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-5 pb-6 text-sm md:px-10">
            <p className="max-w-xl text-bone-dim">{project.blurb}</p>
            <div className="flex items-center gap-4">
              <Link
                href={`/work/${project.slug}`}
                onClick={onClose}
                className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-amber hover:decoration-amber"
              >
                Project details
              </Link>
              <a
                href={driveOpen(project.driveId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone-faint underline decoration-line underline-offset-4 transition-colors hover:text-bone"
              >
                Open in Drive
              </a>
            </div>
      </footer>
    </div>,
    document.body,
  );
}
