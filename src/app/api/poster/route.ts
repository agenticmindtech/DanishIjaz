import { NextResponse } from "next/server";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * Cached poster proxy for Drive thumbnails.
 *
 * Hitting drive.google.com/thumbnail directly from the browser doesn't scale:
 * a single page load fires ~40 concurrent requests and Drive starts returning
 * 503s (observed in dev), on top of the daily bandwidth quota shared Drive
 * files are subject to.
 *
 * Routing posters through our own origin fixes both. The upstream response is
 * cached, so Drive sees roughly one request per image per revalidation window
 * instead of one per visitor, and the CDN serves everyone else. Nothing is
 * committed to the repo — the images still live in Drive.
 */

/** One week. Next requires the `revalidate` export itself to be a literal. */
const WEEK = 604800;

/** Only ids we actually publish. Stops this becoming an open Drive proxy. */
const ALLOWED_IDS = new Set<string>([
  ...projects.map((p) => p.driveId),
  site.portraitDriveId,
]);

const ALLOWED_WIDTHS = new Set([400, 800, 1200, 1600]);

export const revalidate = 604800;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const width = Number(searchParams.get("w") ?? 800);

  if (!id || !ALLOWED_IDS.has(id)) {
    return new NextResponse("Unknown poster", { status: 404 });
  }
  if (!ALLOWED_WIDTHS.has(width)) {
    return new NextResponse("Unsupported width", { status: 400 });
  }

  const upstream = `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

  try {
    // Drive occasionally 503s under load; a couple of quick retries turn a
    // broken card into a slightly slower one.
    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(upstream, {
        next: { revalidate: WEEK },
        headers: { Accept: "image/*" },
      });
      if (response.ok) break;
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }

    if (!response || !response.ok) {
      return new NextResponse("Upstream unavailable", { status: 502 });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
        // Long-lived: a poster frame for a delivered film never changes.
        "Cache-Control": `public, max-age=${WEEK}, s-maxage=${WEEK}, stale-while-revalidate=86400, immutable`,
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
