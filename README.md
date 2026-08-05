# Danish Ijaz — Portfolio

Portfolio site for Danish Ijaz, video editor & videographer (Lahore).
Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npx eslint src  # lint (currently clean)
```

## One page

The whole portfolio is a single scroll: hero → work → services & process →
about → contact. `Nav` links are anchors (`/#work`, `/#about`, …) with a
scroll-spy underline.

The old routes still resolve — `/work`, `/about` and `/contact` are permanent
redirects to their anchors (`next.config.ts`). `/work/[slug]` is untouched: all
35 film pages are still prerendered for deep links and SEO.

## How the media works

Every film stays in Google Drive. Nothing is downloaded into the repo.

| Need | How |
| --- | --- |
| Poster frames | `/api/poster?id=<driveId>&w=<width>` — cached proxy over Drive's thumbnail endpoint |
| Playback | `/api/stream?id=<driveId>` — range-forwarding proxy over the raw MP4 |

**Why proxy the posters?** Requesting ~40 posters straight from
`drive.google.com` on one page load makes Drive return `503`s, and shared files
have a daily bandwidth quota. Through our origin, Drive serves each image about
once a week and the CDN handles everyone else.

**Why proxy the video?** `drive.usercontent.google.com` serves the MP4
correctly — `206`, `Accept-Ranges: bytes`, and no virus interstitial when you
pass `confirm=t`. But it also sends `Cross-Origin-Resource-Policy: same-site`,
so the browser refuses the bytes inside a `<video>` element (media error 4,
"format error") even though CORS itself is wide open. curl sees a perfect
response; Chrome sees nothing. Proxying makes it a same-origin resource.

That proxy is what makes real `<video>` possible — and therefore autoplay,
hover previews, and inline scrubbing. Drive's `/preview` iframe can stream, but
it cannot be autoplayed or controlled cross-origin. It survives only as the
"Watch on Drive" fallback link.

`Range` is forwarded verbatim both ways. This is load-bearing: 18 of the 35
masters are not faststart (their `moov` atom is at the end of the file), so the
browser's first request is for the tail. Break range support and those films
never start.

All of it is isolated in `src/lib/drive.ts` plus the two route handlers. To move
to Mux / Cloudflare Stream / Bunny later, reimplement those — no component
changes needed.

## Autoplay, and why it is rationed

Every tile autoplays muted where it sits, and hovering one expands it, brings it
forward, and gives it sound.

Tiles do not decide this for themselves. They report visibility to
`src/lib/videoGovernor.ts`, which grants a small number of play slots to the
highest-priority candidates; hover outranks everything, so the film under the
pointer always wins one. Everyone else holds a poster frame.

The rationing is not fussiness. **These are delivery masters, not web previews.**

| | size | bitrate |
| --- | --- | --- |
| `meg-reel-ii` | 1 MB | ~65 KB/s |
| `why-you-must-adopt-the-change` | 18 MB | ~300 KB/s |
| `irfan-malik-life-journey` | 587 MB | ~2.7 MB/s |
| `mehndi-final` | 1.27 GB | ~4.2 MB/s |

The library totals ~6.2 GB. Autoplaying 35 of those at once is not a thing that
can work, so the governor caps concurrency (4 on desktop, 2 on mobile, 1 on
reported 3G, **0** under `prefers-reduced-motion` or `saveData`), and a stall
guard makes any tile that can't reach first frame in ~12s yield its slot rather
than freeze the grid around it.

**Smooth preview of the heavy films needs real bandwidth** — the Mehndi master
wants ~34 Mbps. Visitors below that get the poster and a loader, which is the
honest outcome. If you want every tile lively on any connection, the fix is
web-optimised proxies (a ~1–2 Mbps, 720p, faststart cut per film) rather than
more client-side cleverness.

### Before you deploy this

Video bytes cannot be meaningfully cached at the edge — they are gigabytes of
unique byte ranges — so **every byte a visitor watches is billed egress through
`/api/stream`**, and each request holds a function invocation open for as long
as it streams (observed 30–47s locally). On Vercel, check your plan's function
duration limit and set `maxDuration` accordingly. This is the main reason to
move to a real video host if traffic grows.

## Editing content

`src/content/projects.ts` is the single source of truth for all 35 films.
Add or edit an entry and everything updates: the gallery, filters, counts,
related films, sitemap, and the prerendered project page.

```ts
{
  slug, title, client, category, driveId,
  aspect: "16:9" | "9:16",
  year, role: [], blurb, featured?: true
}
```

- `aspect` **must** match the real footage — it drives the entire layout. Every
  current value was measured from the actual poster frame, not assumed.
- New `driveId`s are auto-allowed by both proxies (they derive their allowlists
  from this file), but the file must be shared as **Anyone with the link**.
- `featured` promotes a film to the top of the work section, which renders as
  two uniform rows split by aspect — aim for a balanced set.

`src/content/site.ts` holds contact details, services, process, and the résumé
timeline.

## Notes / follow-ups

- **Contact form** composes a prefilled email via `mailto:` — works with zero
  backend. To route to a real inbox, swap `handleSubmit` in
  `src/components/ContactForm.tsx` for a POST to an API route (Resend etc.).
- **`site.url`** in `src/content/site.ts` is a placeholder — set it to the real
  domain before launch so OG tags, sitemap, and JSON-LD resolve correctly.
- **Client/year attribution** in `projects.ts` is inferred from the résumé
  timeline (Wedding By Usman 2025, Xeven Solutions 2026). Worth a review pass.
- **"Event Recap"** (`slug: event-recap`) needs its real event name.
- One duplicate file in the Drive lecture folder was intentionally excluded.
- **Not yet verified on a real narrow viewport.** Breakpoints are written
  mobile-first with a hamburger nav, but the automation used to check this
  could not resize the viewport, so it needs a look on an actual phone.

## Local environment gotcha

This machine's `PATH` contains a stray `"` — a span of entries was quoted as a
group (opens at `C:\Users\Xeven\.local\bin`, closes at
`...\Android\Sdk\tools\bin`), in **both** Machine and User `PATH`. `cmd.exe`
mis-parses everything between them, which makes tools that shell out fail with
`'"node"' is not recognized`. Until it's fixed in System Properties →
Environment Variables, prefix shell sessions with:

```powershell
$env:PATH = ($env:PATH -split ';' | ForEach-Object { $_ -replace '"','' } | Where-Object { $_ -ne '' }) -join ';'
```

Note also: animations here are driven by `requestAnimationFrame`. A Chrome tab
that is hidden or in a background window gets **no frames at all**, so every
entrance animation sits at its starting state (usually `opacity: 0`) and the
page looks blank. That is the browser throttling, not the site.
