import Link from "next/link";
import { site, whatsappLink } from "@/content/site";

/**
 * Deliberately quiet.
 *
 * On a single-page site the footer sits directly beneath the contact section,
 * so repeating the "Got footage? Let's cut it." headline and its buttons — as
 * this used to — just says the same thing twice in a row. The close is the
 * contact section's job; this is only the colophon.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="shell py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="display text-xl tracking-tight">
              {site.name}
            </Link>
            <p className="mt-2 text-sm text-bone-dim">
              {site.role} · {site.locality}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            <Link href="/#about" className="text-bone-dim transition-colors hover:text-amber">
              About
            </Link>
            <Link href="/#services" className="text-bone-dim transition-colors hover:text-amber">
              Services
            </Link>
            <Link href="/#work" className="text-bone-dim transition-colors hover:text-amber">
              Work
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="text-bone-dim transition-colors hover:text-amber"
            >
              {site.email}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-dim transition-colors hover:text-amber"
            >
              {site.phone}
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-bone-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All films remain the
            property of their respective clients.
          </p>
          <p className="font-mono tracking-wider">{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
