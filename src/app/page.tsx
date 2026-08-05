import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Poster } from "@/components/Poster";
import { Reveal } from "@/components/Reveal";
import { VideoTile } from "@/components/VideoTile";
import { WorkGallery } from "@/components/WorkGallery";
import {
  categories,
  featuredVertical,
  featuredWide,
} from "@/content/projects";
import {
  experience,
  process,
  services,
  site,
  skills,
  tools,
  whatsappLink,
} from "@/content/site";

/**
 * The portfolio, as a single page.
 *
 * Work, about, and contact all live here in one scroll; the `/work/[slug]`
 * pages remain for deep links and SEO, and the old section routes redirect
 * back into the anchors here (see next.config.ts).
 *
 * Order is deliberate: introduce the person, state what he offers, prove it
 * with the films, then ask. Work sits last before the contact section because
 * it is the heaviest thing on the page — a reader who has scrolled the whole
 * library is the one most ready to get in touch.
 *
 * Sections alternate `bg-ink` / `bg-ink-2`; only the tinted ones carry the
 * top hairline, since the colour change already delineates the rest.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="border-y border-line bg-ink py-6">
        <Marquee />
      </section>

      {/* ── About ──────────────────────────────────────────── */}
      <section id="about" className="shell py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">About</p>
              <h2 className="display mt-5 text-6xl md:text-8xl">
                Danish
                <br />
                Ijaz.
              </h2>
              <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-bone-dim">
                <p>
                  I&apos;m a {site.role.toLowerCase()} based in {site.location},
                  working across wedding cinematography, podcast production,
                  educational content, social media marketing, and promotional
                  video.
                </p>
                <p>
                  My job is turning raw footage into something that holds
                  attention — through advanced editing, seamless transitions,
                  colour grading, and audio that doesn&apos;t fight the picture.
                  Most of what I deliver runs to a deadline, and none of it ships
                  without the detail work.
                </p>
                <p className="text-bone">
                  Selected work spanning weddings, brand and fashion, events,
                  podcasts and long-form — from vertical cuts to full-length
                  masters. A sample of what I deliver, not the whole of it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-12 flex flex-wrap gap-3">
                <Link
                  href="#contact"
                  className="rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-amber"
                >
                  Start a project
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-6 py-3 text-sm text-bone-dim transition-colors hover:border-amber hover:text-amber"
                >
                  WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            {/* A photograph under a dark gradient with type on top — graded
                like the film tiles, so it keeps its own theme. */}
            <div
              data-theme="dark"
              className="relative overflow-hidden rounded-xl border border-line bg-surface"
            >
              <Poster
                driveId={site.portraitDriveId}
                alt={`${site.name} at his edit suite`}
                width={800}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="eyebrow text-amber/80">In the suite</p>
                <p className="mt-1 text-sm text-bone">{site.locality}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Experience ───────────────────────────────────── */}
        <div className="mt-28 md:mt-36">
          <Reveal>
            <p className="eyebrow">Experience</p>
            <h3 className="display mt-4 text-4xl md:text-6xl">
              Where I&apos;ve cut.
            </h3>
          </Reveal>

          <div className="mt-14 space-y-px overflow-hidden rounded-xl border border-line bg-line">
            {experience.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.08}>
                <article className="bg-ink-2 p-8 md:p-12">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div>
                      <h4 className="display text-3xl md:text-4xl">
                        {job.href ? (
                          <a
                            href={job.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-amber"
                          >
                            {job.company}
                          </a>
                        ) : (
                          job.company
                        )}
                      </h4>
                      <p className="mt-2 text-sm text-bone-dim">{job.role}</p>
                    </div>
                    <span className="font-mono text-xs text-bone-faint">
                      {job.period}
                    </span>
                  </div>

                  <ul className="mt-8 grid gap-3 md:grid-cols-2">
                    {job.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-bone-dim"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-px w-4 shrink-0 bg-amber"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Skills, tools, library ───────────────────────── */}
        <div className="mt-28 grid gap-16 md:mt-36 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            {/* These read as labels but they head their own lists, so they are
                headings — the `.eyebrow` class carries all of the styling. */}
            <h3 className="eyebrow">Core skills</h3>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-line px-4 py-2 text-sm text-bone-dim transition-colors hover:border-amber hover:text-amber"
                >
                  {skill}
                </li>
              ))}
            </ul>

            {/* Disciplines, not a tally. The per-category counts that used to
                sit on the right described the published sample rather than the
                work delivered in each. */}
            <h3 className="eyebrow mt-14">What I cut</h3>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {categories.map((c) => (
                <li key={c.id} className="py-4">
                  <span className="display text-2xl text-bone-dim md:text-3xl">
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="eyebrow">Toolkit</h3>
            <div className="mt-8 space-y-3">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="rounded-lg border border-line bg-ink-2 p-5"
                >
                  <span className="display text-2xl">{tool}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-bone-dim">
              Deep in {tools[0]} for anything that needs a timeline, and{" "}
              {tools[1]} when a vertical cut has to ship the same day. Delivered
              in every ratio you need — 16:9 for the site, 9:16 for the feed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────── */}
      <section
        id="services"
        className="border-t border-line bg-ink-2 py-24 md:py-36"
      >
        <div className="shell">
          <Reveal>
            <p className="eyebrow">What I do</p>
            <h2 className="display mt-4 max-w-3xl text-5xl md:text-7xl">
              Four disciplines,
              <br />
              one instinct for story.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.05}>
                <article className="group h-full bg-ink-2 p-8 transition-colors duration-500 hover:bg-surface md:p-10">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-amber">
                      0{i + 1}
                    </span>
                    <h3 className="display text-3xl md:text-4xl">
                      {service.title}
                    </h3>
                  </div>
                  <p className="mt-5 max-w-md leading-relaxed text-bone-dim">
                    {service.blurb}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-line px-3 py-1 text-xs text-bone-faint transition-colors group-hover:border-bone-faint"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* ── Process ────────────────────────────────────── */}
          <div className="mt-28 md:mt-36">
            <Reveal>
              <p className="eyebrow">How it runs</p>
              <h3 className="display mt-4 max-w-2xl text-4xl md:text-6xl">
                No mystery. Just a process.
              </h3>
            </Reveal>

            <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {process.map((phase, i) => (
                <Reveal key={phase.step} delay={i * 0.07}>
                  <div className="border-t border-line pt-6">
                    <span className="font-mono text-xs text-amber">
                      {phase.step}
                    </span>
                    <h4 className="display mt-3 text-2xl">{phase.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                      {phase.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Work ───────────────────────────────────────────── */}
      <section id="work" className="shell py-24 md:py-36">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="display mt-4 text-5xl md:text-7xl">
                The cuts worth
                <br />
                showing first.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-bone-dim">
              Every tile plays where it sits. Hover one to bring it forward and
              hear it; click for the full film.
            </p>
          </div>
        </Reveal>

        {/* Two uniform rows rather than one mixed grid — each row holds a
            single aspect ratio, so nothing is cropped and nothing floats in
            dead space. */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredWide.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06} className="relative z-0 hover:z-30">
              <VideoTile
                project={project}
                priority={i < 3}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {featuredVertical.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06} className="relative z-0 hover:z-30">
              <VideoTile
                project={project}
                sizes="(min-width: 1024px) 31vw, 46vw"
              />
            </Reveal>
          ))}
        </div>

        {/* ── The full library ─────────────────────────────── */}
        <div className="mt-28 border-t border-line pt-16 md:mt-36">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Selected work</p>
                <h3 className="display mt-4 text-4xl md:text-5xl">
                  The library.
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-bone-dim">
                Vertical cuts and widescreen masters — weddings, brand work,
                events, podcasts, and long-form.
              </p>
            </div>
          </Reveal>

          <div className="mt-12">
            <WorkGallery />
          </div>
        </div>
      </section>

      {/* ── Contact / start a project ──────────────────────── */}
      <section
        id="contact"
        className="border-t border-line bg-ink-2 py-24 md:py-36"
      >
        <div className="shell grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow">Start a project</p>
              <h2 className="display mt-5 text-6xl md:text-8xl">
                Got footage?
                <br />
                <span className="text-amber">Let&apos;s cut it.</span>
              </h2>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-bone-dim">
                Tell me what you&apos;re shooting, when you need it, and where
                it&apos;s going. I&apos;ll come back with a timeline and a price.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-12 space-y-px overflow-hidden rounded-xl border border-line bg-line">
                <ContactRow
                  label="Email"
                  value={site.email}
                  href={`mailto:${site.email}`}
                />
                <ContactRow
                  label="WhatsApp"
                  value={site.phone}
                  href={whatsappLink()}
                  external
                />
                <ContactRow label="Based in" value={site.locality} />
              </div>

              <div className="mt-12">
                <h3 className="eyebrow">I take on</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-full border border-line px-3.5 py-1.5 text-xs text-bone-faint"
                    >
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="eyebrow">{label}</span>
      <span className="text-bone transition-colors group-hover:text-amber">
        {value}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="flex items-center justify-between gap-4 bg-ink-2 p-5">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center justify-between gap-4 bg-ink-2 p-5 transition-colors hover:bg-surface"
    >
      {content}
    </a>
  );
}
