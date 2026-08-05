import { projects } from "@/content/projects";

/**
 * Range-forwarding video proxy for Drive.
 *
 * Why this exists: `drive.usercontent.google.com` will happily serve the raw
 * MP4 with `206 Partial Content` and `Accept-Ranges: bytes` — but it also sets
 * `Cross-Origin-Resource-Policy: same-site`, which makes the browser refuse the
 * bytes in a `<video>` element (media error code 4, "format error"). curl sees
 * a perfect response; Chrome sees nothing. Proxying through our own origin
 * drops that header and makes the file a same-origin resource.
 *
 * This is the only way to get a real `<video>` element — and therefore real
 * autoplay, hover previews, and inline scrubbing — out of Drive. The /preview
 * iframe cannot be autoplayed or controlled cross-origin.
 *
 * `Range` is forwarded verbatim in both directions, which matters: 18 of the 35
 * masters are not faststart (their `moov` atom sits at the end of the file), so
 * the browser's first move is to request the tail. Break range support and
 * those files never start.
 *
 * Bandwidth note: unlike posters, this traffic cannot be cached at the edge in
 * any meaningful way — it is gigabytes of unique byte ranges. Every byte a
 * visitor watches is a byte through this function. See README.
 */

/** Only ids we actually publish. Stops this becoming an open Drive proxy. */
const ALLOWED_IDS = new Set<string>(projects.map((p) => p.driveId));

/** Ranged responses depend on a request header, so this can never be static. */
export const dynamic = "force-dynamic";

function upstreamUrl(id: string) {
  // `confirm=t` skips the virus-scan interstitial that otherwise replaces the
  // body with HTML for anything over ~100MB.
  return `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
}

async function proxy(request: Request, method: "GET" | "HEAD") {
  const id = new URL(request.url).searchParams.get("id");

  if (!id || !ALLOWED_IDS.has(id)) {
    return new Response("Unknown video", { status: 404 });
  }

  const range = request.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl(id), {
      method,
      headers: range ? { Range: range } : undefined,
      // Never let Next try to buffer a 1.2GB body into its data cache.
      cache: "no-store",
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Upstream unavailable", { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "video/mp4");
  headers.set("Accept-Ranges", "bytes");

  // Pass the range bookkeeping straight through — the browser's seek logic
  // depends on these being accurate.
  for (const header of ["Content-Length", "Content-Range", "Last-Modified"]) {
    const value = upstream.headers.get(header);
    if (value) headers.set(header, value);
  }

  // Drive marks the file as an attachment; inline is what makes it playable
  // media rather than a download prompt.
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "public, max-age=3600");

  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

export function GET(request: Request) {
  return proxy(request, "GET");
}

export function HEAD(request: Request) {
  return proxy(request, "HEAD");
}
