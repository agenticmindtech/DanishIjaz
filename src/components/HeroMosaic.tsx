"use client";

import { projects } from "@/content/projects";
import { Poster } from "./Poster";

/**
 * The hero background: real poster frames from the library, arranged in
 * columns that drift at different speeds.
 *
 * Drive iframes can't autoplay silently or be styled, so a background video
 * loop isn't available. This gets the motion and the "here is the work"
 * signal from assets we already have, at ~6 images of network cost and with
 * no bandwidth-quota exposure.
 */

/**
 * How many distinct posters the hero is allowed to request.
 *
 * Capped deliberately: rendering the whole library here fired ~35 upstream
 * image requests before the page had painted, which is what tipped Drive into
 * returning 503s. Three per column reads as a full mosaic once duplicated.
 */
const POSTERS_PER_COLUMN = 3;

/** Deal a curated slice of the library into N columns. */
function buildColumns(count: number) {
  const cols: (typeof projects)[] = Array.from({ length: count }, () => []);

  /**
   * Films that open on black are excluded outright.
   *
   * "Featured first" used to be the whole rule, on the assumption that the
   * featured pieces had the strongest frames. Measuring the actual thumbnails
   * showed the opposite: the featured set is mostly wedding films, which all
   * fade up from black, so the mosaic was filling with black rectangles —
   * eight of its fifteen tiles. Frame quality, not billing, is what this
   * background needs; the featured sort only breaks ties among the rest.
   */
  const pool = [...projects]
    .filter((p) => !p.opensOnBlack)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  pool
    .slice(0, count * POSTERS_PER_COLUMN)
    .forEach((p, i) => cols[i % count].push(p));
  return cols;
}

const COLUMN_CONFIG = [
  { direction: "up", duration: 88 },
  { direction: "down", duration: 112 },
  { direction: "up", duration: 96 },
  { direction: "down", duration: 124 },
  { direction: "up", duration: 104 },
] as const;

export function HeroMosaic() {
  const columns = buildColumns(COLUMN_CONFIG.length);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 flex justify-center gap-3 md:gap-4">
        {columns.map((column, colIndex) => {
          const config = COLUMN_CONFIG[colIndex];
          // Hide inner columns progressively on narrow screens.
          const responsive =
            colIndex >= 4
              ? "hidden xl:block"
              : colIndex >= 3
                ? "hidden lg:block"
                : colIndex >= 2
                  ? "hidden md:block"
                  : "";

          return (
            <div
              key={colIndex}
              className={`w-[46%] shrink-0 sm:w-[38%] md:w-[26%] lg:w-[20%] xl:w-[17%] ${responsive}`}
            >
              <div
                className={
                  config.direction === "up"
                    ? "animate-drift-up flex flex-col gap-3 md:gap-4"
                    : "animate-drift-down flex flex-col gap-3 md:gap-4"
                }
                style={{ animationDuration: `${config.duration}s` }}
              >
                {/* Rendered twice so the -50% translate loops seamlessly. */}
                {[...column, ...column].map((project, i) => (
                  <div
                    key={`${project.slug}-${i}`}
                    className="relative overflow-hidden rounded-md bg-surface"
                    style={{
                      aspectRatio:
                        project.aspect === "9:16" ? "9 / 16" : "16 / 9",
                    }}
                  >
                    {/* 800, not 400: a column is ~17-26vw, which is 650-1000
                        device pixels on a hi-dpi display — a 400px source was
                        being upscaled and read as soft. Width costs bytes, not
                        requests, so the poster cap above still holds. */}
                    <Poster
                      driveId={project.driveId}
                      alt=""
                      width={800}
                      priority={colIndex < 2 && i < 2}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grading stack, built from `ink` so it veils in whichever direction the
          theme runs — white over the footage in light, black in dark.

          Deliberately light now. Headline legibility is no longer this
          stack's job: Hero renders its own scrim sized to the text column, so
          this only has to unify the mosaic and feather it into the next
          section. Veiling the whole width to protect type meant dimming the
          work on the right for no reason. */}
      <div className="absolute inset-0 bg-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/25 to-ink/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" />
    </div>
  );
}
