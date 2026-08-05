import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlayerProvider } from "@/components/PlayerProvider";
import { site } from "@/content/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "video editor Lahore",
    "videographer Lahore",
    "wedding videographer Pakistan",
    "wedding film editor",
    "reels editor",
    "podcast editor",
    "Premiere Pro editor",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

/** Person schema so local and name search understand who this is. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  telephone: site.phoneIntl,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  knowsAbout: [
    "Video Editing",
    "Videography",
    "Colour Grading",
    "Wedding Cinematography",
    "Podcast Production",
  ],
  worksFor: { "@type": "Organization", name: "Xeven Solutions" },
};

/**
 * Applies the stored theme before the first paint.
 *
 * This has to be a blocking inline script in `<head>`: anything deferred to
 * React — an effect, a provider — runs after the browser has already painted,
 * which is exactly the flash of the wrong theme we are avoiding.
 *
 * System preference is deliberately ignored. Light is the site's default and
 * only an explicit choice overrides it.
 */
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem("danish-theme");
    document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The script above rewrites `data-theme` before React hydrates, so the
      // server and client markup legitimately differ on this one attribute.
      suppressHydrationWarning
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <PlayerProvider>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </PlayerProvider>
      </body>
    </html>
  );
}
