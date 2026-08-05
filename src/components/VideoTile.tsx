"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { categoryLabel, type Project } from "@/content/projects";
import { driveStream } from "@/lib/drive";
import { joinGovernor, PRIORITY } from "@/lib/videoGovernor";
import { MediaLoader } from "./MediaLoader";
import { usePlayer } from "./PlayerProvider";
import { Poster } from "./Poster";

/**
 * A film in the grid: poster frame that becomes a live, playing video.
 *
 * The tile never decides on its own to play — it reports how visible it is to
 * the governor and plays only if it wins a slot (see lib/videoGovernor.ts).
 * Hovering raises its priority above everything else, so the film under the
 * pointer always plays, evicting one further down the page if it has to.
 *
 * The poster sits underneath permanently. Video fades in over it once frames
 * are actually rendering, and fades back out when the slot is taken away, so
 * losing a slot looks like a still rather than a broken tile.
 */
export function VideoTile({
  project,
  priority = false,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw",
  className = "",
  headingLevel: Heading = "h3",
}: {
  project: Project;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /**
   * The tile title's level in the document outline. Defaults to `h3`, which
   * is right directly under a section's `h2`; the gallery nests these one
   * level deeper, beneath its own "The library." heading.
   */
  headingLevel?: "h3" | "h4";
}) {
  const { open } = usePlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const governorRef = useRef<ReturnType<typeof joinGovernor> | null>(null);
  /** Latest visibility-derived priority, so hover/defer can restore it. */
  const visibilityRef = useRef<number>(PRIORITY.HIDDEN);
  const deferredRef = useRef(false);

  const [granted, setGranted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [muted, setMuted] = useState(true);
  /** Set when this film proved too heavy to preview on this connection. */
  const [deferred, setDeferred] = useState(false);

  // ── Slot negotiation ────────────────────────────────────────────────────
  useEffect(() => {
    const governor = joinGovernor(setGranted);
    governorRef.current = governor;
    return () => {
      governor.leave();
      governorRef.current = null;
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        visibilityRef.current =
          ratio >= 0.6
            ? PRIORITY.PROMINENT
            : ratio > 0.1
              ? PRIORITY.VISIBLE
              : PRIORITY.HIDDEN;
        governorRef.current?.setPriority(
          deferredRef.current ? PRIORITY.HIDDEN : visibilityRef.current,
        );
      },
      { threshold: [0, 0.1, 0.6, 0.9] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Hover is explicit intent and outranks mere visibility — and it overrides a
  // deferral, because an explicit ask deserves the wait.
  const handleHoverStart = useCallback(() => {
    setHovered(true);
    setDeferred(false);
    deferredRef.current = false;
    governorRef.current?.setPriority(PRIORITY.HOVERED);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHovered(false);
    // Sound off on the way out, so no audio follows the pointer around.
    setMuted(true);
    governorRef.current?.setPriority(
      deferredRef.current ? PRIORITY.HIDDEN : visibilityRef.current,
    );
  }, []);

  /**
   * Stall guard.
   *
   * Bitrates in this library span two orders of magnitude — a 1MB brand reel
   * plays anywhere, the 1.2GB wedding master needs ~34Mbps to preview in
   * realtime. Without this, one heavy film holds a slot indefinitely and the
   * grid around it stays frozen. If a tile can't reach first frame in time it
   * yields, and the poster is what the visitor sees. Hovering overrides it.
   */
  useEffect(() => {
    if (!granted || playing || hovered) return;

    const timer = setTimeout(() => {
      setDeferred(true);
      deferredRef.current = true;
      governorRef.current?.setPriority(PRIORITY.HIDDEN);

      // Let it try again later; conditions change as other tiles finish.
      setTimeout(() => {
        deferredRef.current = false;
        setDeferred(false);
        governorRef.current?.setPriority(visibilityRef.current);
      }, 20000);
    }, 12000);

    return () => clearTimeout(timer);
  }, [granted, playing, hovered]);

  /**
   * Is a frame actually on screen right now?
   *
   * Derived rather than stored. Losing a slot unmounts the `<video>` in the
   * same render, so an effect that tried to reset `playing` afterwards would
   * find a null ref and silently do nothing — leaving the poster hidden behind
   * a tile with no video in it. Deriving makes that state unrepresentable.
   */
  const live = granted && playing;

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || video.buffered.length === 0) return;
    // Progress toward a watchable head start, not the whole file — these
    // masters are hundreds of megabytes and would sit near 0% forever.
    const target = Math.min(video.duration, 8);
    setProgress(Math.min(video.buffered.end(0) / target, 1));
  }, []);

  const isVertical = project.aspect === "9:16";

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ zIndex: hovered ? 30 : 1 }}
      animate={{ scale: hovered ? 1.045 : 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <button
        type="button"
        onClick={() => open(project)}
        aria-label={`Play ${project.title}`}
        /**
         * Pinned dark in both themes: everything inside sits on top of
         * footage — the legibility scrim, the caption, the play affordance —
         * and light-on-dark is what keeps a photographic still readable.
         *
         * The shadow is the exception. It falls on the page, not the tile, so
         * it reads `--tile-shadow`, which is defined on `:root` only and so
         * ignores this scope. A flat 85% black would be far too heavy on white.
         */
        data-theme="dark"
        className={`group relative block w-full overflow-hidden rounded-lg border bg-surface text-left transition-[border-color,box-shadow] duration-500 ${
          hovered
            ? "border-amber/60 shadow-[var(--tile-shadow)]"
            : "border-line"
        }`}
        style={{ aspectRatio: isVertical ? "9 / 16" : "16 / 9" }}
      >
        <Poster
          driveId={project.driveId}
          alt={`${project.title} — still frame`}
          width={800}
          sizes={sizes}
          priority={priority}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            live ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Mounted only while the tile holds a slot — this is what keeps a
            35-film page from opening 35 streams. Muted autoplay needs no
            gesture, so the attribute does the work and no effect is involved. */}
        {granted && (
          <video
            ref={videoRef}
            src={driveStream(project.driveId)}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="auto"
            aria-hidden
            /* Fires each time a fresh element mounts, which is exactly when
               the "is a frame showing" state should go back to false. */
            onLoadStart={() => setPlaying(false)}
            /* Belt and braces alongside `autoPlay`: React assigns `muted` as a
               DOM property, so a browser that evaluates the autoplay policy
               before that lands would treat this as an unmuted autoplay and
               refuse it. Asking again once metadata exists is always allowed,
               because by then the element really is muted. */
            onLoadedMetadata={(event) => {
              event.currentTarget.play().catch(() => {});
            }}
            onPlaying={() => setPlaying(true)}
            onProgress={handleProgress}
            onTimeUpdate={handleProgress}
            onWaiting={() => setPlaying(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              live ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {granted && !live && (
          <MediaLoader progress={progress} compact label="Buffering" />
        )}

        {/* Yielded after a stall — say so rather than looking broken. */}
        {deferred && !hovered && (
          <span className="absolute left-1/2 top-[58%] z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-bone/15 bg-ink/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-bone-dim backdrop-blur-sm">
            Hover to play
          </span>
        )}

        {/* Legibility scrim. Lifts on hover so the moving image reads. */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent transition-opacity duration-500 ${
            hovered ? "opacity-70" : "opacity-95"
          }`}
        />

        {/* Play affordance — recedes once the tile is live. */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            live ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/25 bg-ink/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-amber group-hover:bg-amber">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="ml-0.5 h-5 w-5 fill-bone transition-colors duration-500 group-hover:fill-ink"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p className="eyebrow mb-1.5 text-amber/80">
            {categoryLabel(project.category)}
          </p>
          <Heading className="display text-xl leading-tight text-bone md:text-2xl">
            {project.title}
          </Heading>
          <p className="mt-1 text-sm text-bone-dim">
            {project.client} · {project.year}
          </p>

          {/* Appears only on hover — the "you're about to watch this" cue. */}
          <span
            className={`mt-3 flex items-center gap-2 text-xs font-medium text-amber transition-all duration-500 ${
              hovered
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-1 opacity-0"
            }`}
          >
            Watch full film
            <span aria-hidden>→</span>
          </span>
        </div>

        <span className="absolute right-3 top-3 rounded border border-bone/15 bg-ink/50 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-bone-dim backdrop-blur-sm">
          {project.aspect}
        </span>
      </button>

      {/* Sound toggle lives outside the button so it doesn't open the player. */}
      {live && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setMuted((m) => !m);
          }}
          aria-label={muted ? "Unmute preview" : "Mute preview"}
          className={`absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-bone/20 bg-ink/60 text-bone backdrop-blur-sm transition-all duration-300 hover:border-amber hover:text-amber ${
            hovered ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
            {muted ? (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM19 5.3 17.7 4 4 17.7 5.3 19 19 5.3z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 2.2v2.1a7.5 7.5 0 0 1 0 15.4v2.1a9.5 9.5 0 0 0 0-19.6z" />
            )}
          </svg>
        </button>
      )}
    </motion.div>
  );
}
