/**
 * The single source of truth for the whole portfolio.
 *
 * Every `driveId` was read off the live Drive folder; every `aspect` was
 * measured from the real poster frame rather than assumed. The library is
 * 21 portrait / 14 landscape, which is why the gallery is aspect-aware.
 *
 * Client/year attribution is inferred from the résumé timeline
 * (Wedding By Usman 2025, Xeven Solutions 2026) — correct any that are wrong.
 */

export type Aspect = "16:9" | "9:16";

export type CategoryId =
  | "weddings"
  | "events"
  | "fashion"
  | "podcasts"
  | "lectures"
  | "reels";

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: CategoryId;
  driveId: string;
  aspect: Aspect;
  year: string;
  role: string[];
  blurb: string;
  featured?: boolean;
  /**
   * This film opens on black, so Drive's thumbnail is a black rectangle.
   *
   * Drive renders the thumbnail from frame 0 and offers no way to ask for a
   * later timestamp, so there is no fix at the URL level — the poster simply
   * is not representative. Measured, not guessed: mean luma below ~20/255
   * across the frame. Roughly a third of the library qualifies, and the
   * wedding films almost all do, since fading up from black is the house
   * style for an opening.
   *
   * The hero mosaic skips these (see components/HeroMosaic.tsx). Elsewhere
   * they are harmless — a gallery tile carries a caption and swaps to live
   * video on hover, so a dark still reads as intentional there.
   */
  opensOnBlack?: boolean;
};

export const categories: { id: CategoryId; label: string; blurb: string }[] = [
  {
    id: "weddings",
    label: "Weddings",
    blurb: "Cinematic highlights, teasers, and full-event films.",
  },
  {
    id: "events",
    label: "Events",
    blurb: "Conference, ceremony, and community recaps built for the feed.",
  },
  {
    id: "fashion",
    label: "Fashion & Brand",
    blurb: "Studio campaigns and product reels for brands.",
  },
  {
    id: "podcasts",
    label: "Podcasts",
    blurb: "Long-form multi-cam conversation, cut for retention.",
  },
  {
    id: "lectures",
    label: "Lectures",
    blurb: "Educational and programme content for online delivery.",
  },
  {
    id: "reels",
    label: "Reels",
    blurb: "Thought-leadership shorts and vertical content.",
  },
];

export const projects: Project[] = [
  // ── Weddings ──────────────────────────────────────────────────────────
  {
    slug: "mehndi-final",
    opensOnBlack: true,
    title: "Mehndi — Full Event Film",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1zBg7Ioux0EioVIw24P_2y_tc0ihDnbu6",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading", "Audio"],
    blurb:
      "The longest and most demanding cut in the library — a full mehndi night assembled into one continuous film. Anamorphic framing, warm night grade, and music cut to the dhol rather than the other way round.",
    featured: true,
  },
  {
    slug: "teaser-barat",
    opensOnBlack: true,
    title: "Barat — Teaser",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1BtfpL_9eIAwyD7cAcSnH3Psj8fIhtqmr",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "A short teaser built to tease, not summarise. Fast intercutting, held beats on the faces that matter, and a hard out before the audience is ready.",
    featured: true,
  },
  {
    slug: "couple-shoot-nikah",
    opensOnBlack: true,
    title: "Nikah — Couple Shoot",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1XlJTuwxuTiZDrbdHeHD-ZASb93YtsE_u",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "Nikah-day couple portraiture cut as a standalone piece. Slower rhythm, longer holds, and a grade that keeps skin warm against cool interiors.",
  },
  {
    slug: "couple-shoot-walima",
    opensOnBlack: true,
    title: "Walima — Couple Shoot",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1ETmKs_o5E_W47SV-PeVNrrcoko-DNl7C",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "Walima couple film — formal staging, controlled movement, and transitions timed to the score rather than the cut points.",
  },
  {
    slug: "couple-shoot-walima-ii",
    opensOnBlack: true,
    title: "Walima — Couple Shoot II",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "15LfTkj0lr06fg5Q1YAcmaIjSmFu3VTq-",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "A second walima treatment for the same event, cut to a different length and energy — the alternate delivery clients actually use.",
  },
  {
    slug: "couple-shoot",
    opensOnBlack: true,
    title: "Couple Shoot",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1fka-VK4jlsXGQad9MADZHorCtDA4Udqt",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "Pre-wedding couple film. Natural light, minimal effects, and an edit that stays out of the way of the performances.",
  },
  {
    slug: "couple-shoot-ii",
    opensOnBlack: true,
    title: "Couple Shoot II",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1BGq0S6s7ydlJI8g4L5ub41uo0D6Ey7ty",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "A second couple session with a cooler grade and tighter cutting pattern — the same craft applied to a different mood.",
  },
  {
    slug: "bride-solo",
    opensOnBlack: true,
    title: "Bride — Solo Portrait Film",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "1U3kNIagkg8T-dYx7e5e1KYM8zZKXH99D",
    aspect: "16:9",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "A solo bridal piece — detail work on fabric, jewellery, and expression, graded to keep the reds saturated without losing skin.",
  },
  {
    slug: "abu-bakar-zobia",
    opensOnBlack: true,
    title: "Abu Bakar & Zobia — Vertical Cut",
    client: "Wedding By Usman",
    category: "weddings",
    driveId: "18V29pTEHiD5lShzYl9YAS9c7qghOPSgH",
    aspect: "9:16",
    year: "2025",
    role: ["Editing", "Vertical Reframe"],
    blurb:
      "The wedding film reframed for vertical. Reframing a cinematic 16:9 shoot to 9:16 without gutting the composition is its own edit — this is that edit.",
  },

  // ── Events ────────────────────────────────────────────────────────────
  {
    slug: "umt-event-highlights",
    title: "UMT — Event Highlights",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1DzyU5ANT4eWbEyyAyFvOe109ObDV2JWM",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "Campus event recap shot and cut end-to-end. Vertical-first so it lands on the feed the same week the event happens.",
    featured: true,
  },
  {
    slug: "bbq-night",
    title: "BBQ Night",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1ZosaH1HkidoZpH27vd2PKjZz6KUB84pJ",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "Company social captured as a warm, loose recap — handheld energy, candid audio, and a grade that leans into the firelight.",
  },
  {
    slug: "eid-gifts-reel",
    title: "Eid Gifts",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1jL_UUYBtJ7jWkmbdnEhfPGyWkfjsRuqH",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "Internal Eid celebration turned into shareable culture content — the kind of piece that does more recruiting than a job post.",
  },
  {
    slug: "ai-baithak-5",
    title: "AI Baithak 5 — Hope to Skill",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1Hu_X9Vlit5lBPS7-zu-3oKRRql1okSAm",
    aspect: "9:16",
    year: "2026",
    role: ["Editing"],
    blurb:
      "Recap of the fifth AI Baithak — a community session on preparing Pakistan's youth for an AI-shaped job market. Cut for momentum.",
  },
  {
    slug: "ai-baithak-minds",
    title: "AI Baithak — Most Valuable Minds",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1EXgStdEU4KQwezEO1-ReB1wZxARpyUCi",
    aspect: "9:16",
    year: "2026",
    role: ["Editing"],
    blurb:
      "A roundtable recap that had to make a room full of talking heads feel urgent. Tight cutting, pulled quotes, and rhythmic titling.",
  },
  {
    slug: "connected-pakistan-islamabad",
    opensOnBlack: true,
    title: "Connected Pakistan — Islamabad",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1sOmy-izQwZLjrnvz4WYjP85YEtRtJtwy",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "Conference coverage from Islamabad condensed into a vertical recap — stage, floor, and hallway energy in under a minute.",
  },
  {
    slug: "iac-event-highlights",
    title: "IAC — Event Highlights",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1ZxoWZRgZUz_ylMD7Wl1Ow-yr92SEflTd",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "A lean highlight cut built to be posted fast — proof that a same-week turnaround doesn't have to look like one.",
  },
  {
    slug: "revival-3-rise-club",
    title: "Revival 3.0 — RISE Club",
    client: "RISE Club",
    category: "events",
    driveId: "1dq4HzJ6wSpqX8jitaHrK9UhP-3Acegt0",
    aspect: "9:16",
    year: "2026",
    role: ["Editing"],
    blurb:
      "Student society event recap with a hard graphic identity — titles and transitions doing as much work as the footage.",
  },
  {
    slug: "save-your-kids",
    title: "Save Your Kids — Prize Distribution",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1IglXDij5-y65je9uNUDQidafYqNrZ8ke",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "Ceremony coverage for a campaign about children as a society's real assets. Handled with the restraint the subject asks for.",
  },
  {
    slug: "event-recap",
    title: "Event Recap",
    client: "Xeven Solutions",
    category: "events",
    driveId: "1QiPUmxJ0wkeKWkS2r7qlNLpbxVTvTftf",
    aspect: "9:16",
    year: "2026",
    role: ["Videography", "Editing"],
    blurb:
      "Vertical event recap — shot, cut, and graded in-house. Rename this one with the actual event title before launch.",
  },

  // ── Fashion & Brand ───────────────────────────────────────────────────
  {
    slug: "house-of-beauty",
    opensOnBlack: true,
    title: "House of Beauty — Brand Reel",
    client: "House of Beauty",
    category: "fashion",
    driveId: "1DVX8BVMSdET6i4cr-zF09EwCLDxJZIRC",
    aspect: "9:16",
    year: "2025",
    role: ["Editing", "Colour Grading"],
    blurb:
      "The most produced piece in the brand set — salon campaign work with beat-matched cutting, clean beauty grading, and motion titling.",
    featured: true,
  },
  {
    slug: "eshal-studio-reel",
    title: "Eshal Studio — Campaign Reel",
    client: "Eshal Studio",
    category: "fashion",
    driveId: "1Rywf7l569IdbzSBzI2fnDY0NYziX4TQx",
    aspect: "9:16",
    year: "2025",
    role: ["Editing"],
    blurb:
      "Fashion studio campaign cut for the feed — outfit reveals timed to the drop, transitions carrying the silhouette across cuts.",
  },
  {
    slug: "eshal-studio-reel-ii",
    title: "Eshal Studio — Campaign Reel II",
    client: "Eshal Studio",
    category: "fashion",
    driveId: "1SbsW73ouPUmyTBCOawffvEs9WtJizgBp",
    aspect: "9:16",
    year: "2025",
    role: ["Editing"],
    blurb:
      "Second cut from the same shoot with a different track and pacing — a repeatable format rather than a one-off.",
  },
  {
    slug: "meg-reel",
    opensOnBlack: true,
    title: "MEG — Brand Reel",
    client: "MEG",
    category: "fashion",
    driveId: "1Dv6LlJQY8pg5jDY8BtTtnbzUqnbnGa9f",
    aspect: "9:16",
    year: "2025",
    role: ["Editing"],
    blurb:
      "Short brand spot built around product motion — every cut lands on a beat, nothing sits on screen longer than it earns.",
  },
  {
    slug: "meg-reel-ii",
    title: "MEG — Brand Reel II",
    client: "MEG",
    category: "fashion",
    driveId: "1ZoddVvHn1XivyoQNgjY49rNi0MwYcb52",
    aspect: "9:16",
    year: "2025",
    role: ["Editing"],
    blurb:
      "The tightest edit in the library. A complete brand message delivered in a handful of seconds and a handful of megabytes.",
  },
  {
    slug: "coffee-brand",
    opensOnBlack: true,
    title: "Coffee Brand — Product Reel",
    client: "Brand Client",
    category: "fashion",
    driveId: "1-vM5qzn5zjRuihJ-LfvHJX4tFysVEpMw",
    aspect: "9:16",
    year: "2025",
    role: ["Editing"],
    blurb:
      "Product-led coffee spot — pour shots, steam, texture, and a grade pushed warm to sell the cup before the logo appears.",
  },
  {
    slug: "quiz-reel",
    title: "Quiz — Engagement Reel",
    client: "Brand Client",
    category: "fashion",
    driveId: "1bG9TNMyl5TBvG18yFx84-rcTE3UWENMH",
    aspect: "9:16",
    year: "2025",
    role: ["Editing", "Motion"],
    blurb:
      "An interactive quiz format built for comments — on-screen graphics, timed reveals, and a deliberate pause before the answer.",
  },

  // ── Podcasts ──────────────────────────────────────────────────────────
  {
    slug: "irfan-malik-life-journey",
    title: "Irfan Malik — Life Journey & Success",
    client: "Life with Purpose Podcast",
    category: "podcasts",
    driveId: "1PkZ4LxqR9ymlPvUPMAJu4zNnPSEbhNu6",
    aspect: "16:9",
    year: "2026",
    role: ["Multi-cam Edit", "Audio", "Colour"],
    blurb:
      "The flagship long-form episode — a full life-journey conversation assembled from multi-cam, with synced audio, invisible cuts, and a consistent look across the runtime.",
    featured: true,
  },
  {
    slug: "ai-will-replace-80-percent-jobs",
    title: "AI Will Replace 80% of Jobs",
    client: "Life with Purpose Podcast",
    category: "podcasts",
    driveId: "1fpphp-MsVzaLm1W0X2sjKPfE94QVoKgK",
    aspect: "16:9",
    year: "2026",
    role: ["Multi-cam Edit", "Audio"],
    blurb:
      "Irfan Malik in conversation with Dr Javed Iqbal on AI and employment. Cut to keep a long argument legible — camera changes land on thought changes.",
  },
  {
    slug: "next-generation-prepared-for-ai",
    title: "Is the Next Generation Ready for AI?",
    client: "Life with Purpose Podcast",
    category: "podcasts",
    driveId: "1IhjRiGVQbIjaUR8kvt_st-GWiCmREGL0",
    aspect: "16:9",
    year: "2026",
    role: ["Multi-cam Edit", "Audio"],
    blurb:
      "A generational-readiness conversation, tightened in post — dead air removed, pacing lifted, without making anyone sound clipped.",
  },

  // ── Lectures ──────────────────────────────────────────────────────────
  {
    slug: "ai-powered-prototypes-mvps",
    title: "Building AI-Powered Prototypes & MVPs",
    client: "Hope to Skill",
    category: "lectures",
    driveId: "1CbC-YmDQkOXIchhrubWHkvsrs8o2_lkD",
    aspect: "16:9",
    year: "2026",
    role: ["Editing", "Audio", "Screen Composite"],
    blurb:
      "Full-length technical lecture cut for online delivery — presenter and screen content balanced so neither fights the other for attention.",
  },
  {
    slug: "why-i-built-this-program",
    title: "Why I Built This Program",
    client: "Hope to Skill",
    category: "lectures",
    driveId: "1xMZ37LnMB7Q6N1m3Ducewd5uD7MsGfsr",
    aspect: "16:9",
    year: "2026",
    role: ["Editing", "Audio"],
    blurb:
      "The programme's opening film. It has one job — make someone decide to enrol — so the edit stays on the speaker and out of the way.",
  },

  // ── Reels ─────────────────────────────────────────────────────────────
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    client: "Xeven Solutions",
    category: "reels",
    driveId: "1gJlo0pnARHSVRHdsl5TBTog271MVP45X",
    aspect: "9:16",
    year: "2026",
    role: ["Editing", "Motion", "Subtitles"],
    blurb:
      "The most heavily worked short in the set — a dense AI explainer with layered graphics, burned-in subtitles, and no wasted frame.",
    featured: true,
  },
  {
    slug: "define-your-vision-before-you-hire",
    title: "Define Your Vision Before You Hire",
    client: "Xeven Solutions",
    category: "reels",
    driveId: "1w-3LZeVraacJwrsBpDqrAHmx55BQtlLU",
    aspect: "9:16",
    year: "2026",
    role: ["Editing", "Subtitles"],
    blurb:
      "Thought-leadership short. A single business idea, delivered in one vertical cut with subtitles doing half the retention work.",
  },
  {
    slug: "freelancing-path-to-future-success",
    title: "Freelancing — Your Path to Future Success",
    client: "Xeven Solutions",
    category: "reels",
    driveId: "1SsrUmDGHSh0I8F3ridFfFWu3ZxFR_9nV",
    aspect: "9:16",
    year: "2026",
    role: ["Editing", "Subtitles"],
    blurb:
      "Career-advice short aimed at students. Hook in the first second, payoff before the thumb moves.",
  },
  {
    slug: "why-you-must-adopt-the-change",
    title: "Why You Must Adopt the Change",
    client: "Xeven Solutions",
    category: "reels",
    driveId: "1cIGgaWKV1n10yo3cYcDH_eBA6AK8sb3M",
    aspect: "9:16",
    year: "2026",
    role: ["Editing", "Subtitles"],
    blurb:
      "A punchy vertical on adapting to technological change — the leanest file in the library and one of the sharpest cuts.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/**
 * Featured work split by format.
 *
 * The homepage renders these as two uniform rows rather than one mixed grid —
 * a single grid holding both 16:9 and 9:16 either letterboxes the verticals or
 * strands the widescreen cards in dead space.
 */
export const featuredWide = featuredProjects.filter((p) => p.aspect === "16:9");
export const featuredVertical = featuredProjects.filter(
  (p) => p.aspect === "9:16",
);

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? id;

/**
 * Stats surfaced on the homepage — derived, never hand-maintained.
 *
 * Film counts deliberately absent. What is published here is a selection of
 * delivered work, so `projects.length` describes the size of the sample, not
 * the body of work, and every surface that printed it read as a career total.
 */
export const stats = {
  categories: categories.length,
  years: "2025 — 2026",
};
