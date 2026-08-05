import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The site collapsed from four routes into one page. These keep the old
   * URLs — and anything already linking to them — landing on the right
   * section instead of a 404.
   *
   * `/work/:slug` is untouched: those detail pages still exist for deep links
   * and SEO. A source of `/work` matches only the exact path.
   */
  async redirects() {
    return [
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
