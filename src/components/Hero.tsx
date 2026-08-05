"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroMosaic } from "./HeroMosaic";
import { usePlayer } from "./PlayerProvider";
import { getProject, stats } from "@/content/projects";
import { site } from "@/content/site";

/** The piece that plays when someone hits "Watch the reel". */
const SHOWREEL_SLUG = "mehndi-final";

export function Hero() {
  const { open } = usePlayer();
  const showreel = getProject(SHOWREEL_SLUG);

  return (
    /**
     * Themed like every other section — the mosaic behind it is graded with
     * the same `ink` token, so the veil over the footage turns white in the
     * light theme and the headline stays dark on top of it.
     */
    <section className="film-grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      <HeroMosaic />

      {/* Readability scrim, sized to the text column rather than the viewport.
          This is what lets the mosaic stay bright: protection is spent only
          where type actually sits, and the right-hand columns — the ones
          showing the work — keep almost none of it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-full bg-gradient-to-r from-ink via-ink/85 to-transparent lg:w-[78%] xl:w-[68%]"
      />

      <div className="shell relative z-10 py-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          /* A notch brighter and wider than the standard eyebrow: this one
             sits over moving footage, not a flat section background. */
          className="eyebrow text-bone-dim [letter-spacing:0.22em]"
        >
          {site.location} · {stats.years}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          /* Floors at 3rem so it still dominates on a small screen, and the
             leading opens slightly from `.display`'s 0.95 — two lines of type
             this large need the extra air to separate over a busy backdrop. */
          className="display mt-6 max-w-5xl text-[clamp(3rem,9vw,7.5rem)] leading-[1.02] text-bone"
        >
          I edit footage
          <br />
          into <span className="italic text-amber">feeling</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          /* Full-strength type, not the dimmed body colour — this is the
             positioning line, and it was the least readable thing in the hero. */
          className="mt-8 max-w-xl text-lg leading-relaxed text-bone md:text-xl"
        >
          {site.role}. Cinematic weddings, brand and fashion reels, podcasts and
          event films — cut for story first, polish second.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {showreel && (
            <button
              onClick={() => open(showreel)}
              className="group flex items-center gap-3 rounded-full bg-bone py-3 pl-3 pr-6 text-sm font-medium text-ink transition-colors hover:bg-amber"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-3.5 w-3.5 fill-bone">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch the reel
            </button>
          )}
          <Link
            href="#work"
            className="rounded-full border border-bone/25 px-6 py-3 text-sm text-bone transition-colors hover:border-amber hover:text-amber"
          >
            See selected work
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-8"
        >
          {/* No film count here. What is published is a sample of delivered
              work, so any tally reads as a career total and undersells it. */}
          <Stat value={String(stats.categories)} label="Disciplines" />
          <Stat value="2" label="Studios" />
          <Stat value="4K" label="Delivery" />
        </motion.dl>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="display block text-3xl text-bone md:text-4xl">
          {value}
        </span>
        {/* `.eyebrow`'s faint default disappears against footage. */}
        <span className="eyebrow mt-1 block text-bone-dim">{label}</span>
      </dd>
    </div>
  );
}
