"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The whole portfolio is one page, so these are anchors rather than routes.
 * They keep the leading `/` so they still work from a project detail page.
 *
 * Order mirrors the page itself — who, what, proof, ask — because the scroll
 * spy below highlights whichever of these the reader has reached.
 */
const links = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

/** Subscribe/snapshot pair for the page's scroll position. */
const subscribeToScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const onHome = pathname === "/";

  /**
   * Reading scroll through `useSyncExternalStore` rather than an effect means
   * the very first render already knows whether the page is scrolled — so a
   * deep link straight to `/#about` paints the solid nav immediately instead
   * of flashing the transparent one.
   */
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 24,
    () => false,
  );

  /**
   * Scroll spy. Only meaningful on the single page — elsewhere there are no
   * sections to track.
   */
  useEffect(() => {
    if (!onHome) return;

    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Track the section nearest the top of the viewport that is still
        // on screen — that is the one being read.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      // Bias the band toward the upper half of the viewport.
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="display text-lg tracking-tight md:text-xl">
            {site.name}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint transition-colors group-hover:text-amber sm:inline">
            Video Editor
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            // Derived, not stored: off the single page there is no section to
            // highlight, so nothing needs to clear the state on the way out.
            const isActive = onHome && active === link.id;
            return (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                className={`relative text-sm transition-colors ${
                  isActive ? "text-bone" : "text-bone-dim hover:text-bone"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-amber transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="rounded-full bg-bone px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-amber"
          >
            Start a project
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile: the toggle sits outside the sheet so the theme can be
            changed without first opening the menu. */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-6 bg-bone transition-transform duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-bone transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="shell flex flex-col gap-1 pb-6 md:hidden">
          {links.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-3.5 text-lg text-bone-dim transition-colors hover:text-amber"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-full bg-bone px-5 py-3 text-center text-sm font-medium text-ink"
          >
            Start a project
          </Link>
        </div>
      )}
    </header>
  );
}
