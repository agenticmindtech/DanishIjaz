/**
 * Google Drive media adapter.
 *
 * Every Drive-specific URL in the app is built here and nowhere else.
 * To migrate to Mux / Cloudflare Stream / Bunny later, reimplement these
 * three functions and change the `driveId` field name in `content/projects.ts`.
 * No component needs to change.
 */

/**
 * Poster frame for a Drive video.
 *
 * Goes through our own cached proxy rather than drive.google.com directly —
 * hitting Drive from the browser produced 503s once a page requested ~40
 * posters at once. See app/api/poster/route.ts for the full reasoning.
 *
 * Drive renders the thumbnail server-side at the width we ask for, so `w` is
 * the image optimisation; that is why the app uses plain `<img>` rather than
 * next/image, which would add a second optimiser hop for no gain.
 */
export function driveThumb(id: string, width: PosterWidth = 800): string {
  return `/api/poster?id=${id}&w=${width}`;
}

/** Widths the proxy accepts — keep in sync with ALLOWED_WIDTHS in the route. */
export type PosterWidth = 400 | 800 | 1200 | 1600;

/**
 * Responsive srcset.
 *
 * Deliberately only two candidates: every extra width multiplies the number of
 * distinct upstream fetches, which is what triggered the rate limiting.
 */
export function driveThumbSrcSet(id: string): string {
  return [400, 800]
    .map((w) => `${driveThumb(id, w as PosterWidth)} ${w}w`)
    .join(", ");
}

/**
 * Direct MP4 stream, through our own origin.
 *
 * This is what powers every real `<video>` element on the site — autoplaying
 * tiles, hover previews, and the lightbox player.
 *
 * It has to be proxied. Drive's own file host serves the MP4 correctly (206,
 * `Accept-Ranges: bytes`, no virus interstitial with `confirm=t`) but sends
 * `Cross-Origin-Resource-Policy: same-site`, so the browser rejects the bytes
 * in a media element even though CORS itself is wide open. See the route for
 * the full reasoning.
 */
export function driveStream(id: string): string {
  return `/api/stream?id=${id}`;
}

/**
 * Embeddable Drive player.
 *
 * Kept as the fallback path only. It streams anything, including the 1.24GB
 * Mehndi master, but it cannot be autoplayed or controlled cross-origin —
 * which is why playback now goes through `driveStream` instead.
 */
export function driveEmbed(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

/** Open in Drive directly — used as the lightbox fallback link. */
export function driveOpen(id: string): string {
  return `https://drive.google.com/file/d/${id}/view`;
}
