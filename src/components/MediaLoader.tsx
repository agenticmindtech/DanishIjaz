"use client";

/**
 * The loading state for any video on the site.
 *
 * These are large masters streamed over a proxy, so a first frame can take a
 * few seconds. Rather than a dead grey box, the poster frame stays visible
 * underneath (the caller renders it) and this sits on top: a ring that tracks
 * real buffer progress when the browser reports any, and spins indeterminately
 * before that.
 */
export function MediaLoader({
  progress,
  label = "Loading",
  compact = false,
}: {
  /** 0–1 buffered fraction, or undefined while still unknown. */
  progress?: number;
  label?: string;
  compact?: boolean;
}) {
  const size = compact ? 34 : 52;
  const stroke = compact ? 2 : 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const known = typeof progress === "number" && progress > 0.01;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
      {/* Softens the poster behind so the ring reads cleanly on any frame. */}
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" />

      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={known ? "-rotate-90" : "animate-spin-slow -rotate-90"}
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-bone/15"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="text-amber transition-[stroke-dashoffset] duration-300 ease-out"
            strokeDasharray={circumference}
            strokeDashoffset={
              known
                ? circumference * (1 - Math.min(progress, 1))
                : circumference * 0.75
            }
          />
        </svg>
      </div>

      {!compact && (
        <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">
          {known ? `${Math.round(progress * 100)}%` : label}
        </span>
      )}
    </div>
  );
}
