"use client";

import { useState } from "react";
import { categories, projects, type CategoryId } from "@/content/projects";
import { VideoTile } from "./VideoTile";

type Filter = CategoryId | "all";

/**
 * Aspect-aware masonry.
 *
 * The library is 21 portrait / 14 landscape, so a fixed-ratio grid would
 * letterbox or crop most of it. CSS multi-column lets every tile keep its
 * native ratio while the columns stay balanced.
 */
export function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const activeCategory = categories.find((c) => c.id === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
          count={projects.length}
        />
        {categories.map((c) => (
          <FilterPill
            key={c.id}
            active={filter === c.id}
            onClick={() => setFilter(c.id)}
            label={c.label}
            count={projects.filter((p) => p.category === c.id).length}
          />
        ))}
      </div>

      <div className="mt-5 min-h-6">
        {/* Keyed on the filter so React swaps the node and the CSS entrance
            replays on every change. */}
        <p key={filter} className="tile-in text-sm text-bone-dim">
          {activeCategory?.blurb ??
            "The full selection — weddings, brand work, events, and long-form."}
        </p>
      </div>

      <div className="mt-10 [column-fill:_balance] gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {visible.map((project, i) => (
          <div
            /* Keying on filter + slug remounts the tile when the filter
               changes, which replays the entrance and — more importantly —
               tears down any video the old tile had running. */
            key={`${filter}-${project.slug}`}
            style={{ "--i": Math.min(i, 10) } as React.CSSProperties}
            /* z-index has to live here, not on the tile: this wrapper is
               transformed by the entrance animation, so it owns the stacking
               context a hover-expanded tile needs to rise above neighbours. */
            className="tile-in relative z-0 mb-4 break-inside-avoid hover:z-30"
          >
            <VideoTile
              project={project}
              priority={i < 4}
              sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
              /* These sit under the section's "All N films" h3, not directly
                 under its h2 like the featured tiles do. */
              headingLevel="h4"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
        active
          ? "border-amber bg-amber text-ink"
          : "border-line text-bone-dim hover:border-bone-faint hover:text-bone"
      }`}
    >
      {label}
      <span
        className={`font-mono text-[10px] ${
          active ? "text-ink/60" : "text-bone-faint"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
