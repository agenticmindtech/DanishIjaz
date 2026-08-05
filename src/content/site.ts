export const site = {
  name: "Danish Ijaz",
  role: "Video Editor & Videographer",
  location: "Lahore, Pakistan",
  locality: "Johar Town, Lahore",
  email: "danish56549@gmail.com",
  phone: "0335-3048932",
  phoneIntl: "+923353048932",
  url: "https://danishijaz.com",
  description:
    "Video editor and videographer in Lahore. Cinematic wedding films, brand and fashion reels, podcast and lecture production — edited for story first.",
  /** Portrait pulled from the same Drive library (IMG_5445). */
  portraitDriveId: "1T8Ad_vUfbkpVSc5uKVtzh44KS9nN49kN",
} as const;

export const whatsappLink = (message = "Hi Danish — I saw your portfolio.") =>
  `https://wa.me/${site.phoneIntl.replace("+", "")}?text=${encodeURIComponent(message)}`;

export const services = [
  {
    title: "Wedding Films",
    blurb:
      "Cinematic highlights, teasers, and full event coverage — mehndi through walima. Graded, scored, and cut to hold a room.",
    points: ["Cinematic highlights", "Teasers & reels", "Full event edits", "Colour grading"],
  },
  {
    title: "Brand & Fashion",
    blurb:
      "Short-form built for the feed. Product reels, studio campaigns, and promos that carry a brand's voice in nine seconds.",
    points: ["Product & studio reels", "Promotional edits", "Ad cutdowns", "Motion & transitions"],
  },
  {
    title: "Podcast & Long-Form",
    blurb:
      "Multi-cam podcast assembly, lecture production, and educational content — clean audio, invisible cuts, consistent look.",
    points: ["Multi-cam assembly", "Audio sync & cleanup", "Lecture production", "Clip extraction"],
  },
  {
    title: "Event Coverage",
    blurb:
      "End-to-end videography, from shooting the day to delivering the highlight cut. Conferences, ceremonies, community events.",
    points: ["On-site shooting", "Same-week highlights", "Vertical event recaps", "Post-production"],
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Brief",
    body: "We talk through the footage, the audience, and what the piece has to do. Deliverables and runtime get fixed here, not later.",
  },
  {
    step: "02",
    title: "Assembly",
    body: "Footage is synced, culled, and cut to a story spine. You see a rough early — structure is cheaper to change than polish.",
  },
  {
    step: "03",
    title: "Craft",
    body: "Colour grading, audio balance, music, transitions, and titles. This is where a sequence stops being footage and starts being a film.",
  },
  {
    step: "04",
    title: "Delivery",
    body: "Final masters plus every aspect ratio you need — 16:9 for the site, 9:16 for the feed. Revisions included.",
  },
] as const;

export const experience = [
  {
    role: "Video Editor & Videographer",
    company: "Xeven Solutions",
    href: "https://www.xevensolutions.com/",
    period: "Jan 2026 — Jul 2026",
    points: [
      "Produced and edited professional lecture videos, podcasts, and digital media content for multiple platforms.",
      "Enhanced video quality through precise editing, audio optimisation, colour correction, and visual consistency.",
      "Created promotional videos and social media reels to improve brand visibility and engagement.",
      "Collaborated with marketing and production teams to align content with business objectives.",
      "Handled end-to-end event videography from shooting to final post-production delivery.",
    ],
  },
  {
    role: "Video Editor",
    company: "Wedding By Usman",
    href: null,
    period: "Jan 2025 — Dec 2025",
    points: [
      "Edited cinematic, highlights, teasers, and full event coverage videos.",
      "Produced promotional and advertisement content tailored to client branding.",
      "Created short-form social media content optimised for engagement.",
      "Developed travel and tourism videos using strong storytelling techniques.",
      "Coordinated with clients to understand requirements and ensure timely delivery.",
    ],
  },
] as const;

export const skills = [
  "Wedding Video Editing",
  "Advertisement & Promotional Editing",
  "Social Media Reels & Brand Shorts",
  "Videography & Event Coverage",
  "Tourism & Travel Editing",
  "Colour Correction & Grading",
  "Transitions, Effects & Motion Flow",
  "Audio Syncing & Background Music",
  "Visual Storytelling & Narrative Building",
] as const;

export const tools = ["Adobe Premiere Pro", "CapCut Pro"] as const;
