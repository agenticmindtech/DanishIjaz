"use client";

import { projects } from "@/content/projects";
import { usePlayer } from "./PlayerProvider";
import { Poster } from "./Poster";

/** A continuous strip of stills — the "showreel" band between sections. */

/**
 * How many distinct stills the strip runs.
 *
 * Two constraints meet here. The loop translates -50% across two copies, so
 * one copy has to be wider than the viewport or a gap opens at the seam:
 * 12 tiles is ~3650px at the md size, which clears any real display. And the
 * count is also the number of upstream poster requests this band costs, so it
 * stays at the 13 the old `16:9` filter happened to produce — the hero mosaic
 * is capped for the same reason (Drive starts returning 503s in bulk).
 */
const STRIP_LENGTH = 12;

export function Marquee() {
  const { open } = usePlayer();

  /**
   * Films that open on black are excluded, the same rule the hero mosaic
   * applies — and for the same reason, which is worse here: a Drive thumbnail
   * is the *first frame*, and 8 of the 13 wide films fade up from black, so
   * nearly two thirds of this strip was rendering as black rectangles.
   *
   * That leaves only five usable landscape films, which is not enough to fill
   * the band, so verticals backfill behind them. They centre-crop into the
   * landscape tile, which is why they sort second rather than being mixed in.
   */
  const strip = [...projects]
    .filter((p) => !p.opensOnBlack)
    .sort(
      (a, b) => Number(b.aspect === "16:9") - Number(a.aspect === "16:9"),
    )
    .slice(0, STRIP_LENGTH);

  return (
    <div className="relative overflow-hidden py-2">
      <div className="animate-marquee flex w-max gap-4">
        {[...strip, ...strip].map((project, i) => (
          <button
            key={`${project.slug}-${i}`}
            onClick={() => open(project)}
            aria-label={`Play ${project.title}`}
            /* Scoped dark on the tile rather than the strip: the caption
               gradient below belongs to the still, but the feathered edges
               further down have to keep tracking the page background. */
            data-theme="dark"
            className="group relative h-32 w-56 shrink-0 overflow-hidden rounded-md border border-line bg-surface md:h-40 md:w-72"
          >
            <Poster
              driveId={project.driveId}
              alt=""
              width={400}
              className="h-full w-full object-cover opacity-55 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-3 text-left text-xs text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {project.title}
            </span>
          </button>
        ))}
      </div>

      {/* Feathered edges so the strip bleeds instead of stopping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent md:w-40" />
    </div>
  );
}
