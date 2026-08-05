import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoTile } from "@/components/VideoTile";
import { Reveal } from "@/components/Reveal";
import { ProjectPlayer } from "@/components/ProjectPlayer";
import { driveEmbed, driveThumb } from "@/lib/drive";
import {
  categoryLabel,
  getProject,
  projects,
  type Project,
} from "@/content/projects";
import { site } from "@/content/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.blurb,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.blurb,
      images: [{ url: driveThumb(project.driveId, 1200) }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Prefer same-category pieces, then top up from the rest of the library.
  const related = [
    ...projects.filter(
      (p) => p.category === project.category && p.slug !== project.slug,
    ),
    ...projects.filter((p) => p.category !== project.category),
  ].slice(0, 3);

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: project.title,
    description: project.blurb,
    // Schema consumers need an absolute URL; the proxy path is relative.
    thumbnailUrl: `${site.url}${driveThumb(project.driveId, 1200)}`,
    embedUrl: driveEmbed(project.driveId),
    uploadDate: `${project.year}-01-01`,
    creator: { "@type": "Person", name: site.name },
  };

  const isVertical = project.aspect === "9:16";

  return (
    <article className="pb-28 pt-32 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <div className="shell">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-sm text-bone-dim transition-colors hover:text-amber"
        >
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          All work
        </Link>

        <header className="mt-8 max-w-4xl">
          <p className="eyebrow">
            {categoryLabel(project.category)} · {project.year}
          </p>
          <h1 className="display mt-4 text-5xl md:text-7xl">{project.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone-dim">
            {project.blurb}
          </p>
        </header>

        {/* The iframe is the only path that streams the full library
            reliably — see lib/drive.ts. */}
        <ProjectPlayer
          driveId={project.driveId}
          title={project.title}
          aspect={project.aspect}
        />

        <dl className="mx-auto mt-14 grid max-w-6xl gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Client" value={project.client} />
          <Meta label="Discipline" value={categoryLabel(project.category)} />
          <Meta label="Role" value={project.role.join(" · ")} />
          <Meta
            label="Format"
            value={isVertical ? "9:16 vertical" : "16:9 widescreen"}
          />
        </dl>
      </div>

      <section className="shell mt-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-10">
            <h2 className="display text-4xl md:text-5xl">More work</h2>
            <Link
              href="/#work"
              className="text-sm text-bone-dim transition-colors hover:text-amber"
            >
              View all {projects.length} films →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p: Project, i) => (
            <Reveal
              key={p.slug}
              delay={i * 0.06}
              className="relative z-0 hover:z-30"
            >
              <VideoTile project={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-2 p-6">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-sm text-bone">{value}</dd>
    </div>
  );
}
