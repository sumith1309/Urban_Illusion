/**
 * Sanity content adapter — STUBBED for Phase 0.
 *
 * Editorial blocks for the homepage, story page, lookbook. Mirrors the shape
 * we'd receive from GROQ queries. Swap with `@sanity/client` when the dataset
 * is provisioned.
 */

export type EditorialBlock =
  | {
      _type: "hero";
      eyebrow: string;
      title: string;
      sub: string;
      cta: { label: string; href: string };
    }
  | {
      _type: "story";
      eyebrow: string;
      lines: string[];
    }
  | {
      _type: "marquee";
      items: string[];
    };

export const HOMEPAGE_BLOCKS: EditorialBlock[] = [
  {
    _type: "hero",
    eyebrow: "Est. 2026 · Limited Drops",
    title: "Urban Illusion",
    sub: "Protection. Perception. Illusion. — wearable amulets, made in small batches.",
    cta: { label: "Enter the shop", href: "/shop" },
  },
  {
    _type: "story",
    eyebrow: "The Eye",
    lines: [
      "The nazar watches the road for you.",
      "It catches what the world hopes you'll miss.",
      "We rendered it in cobalt and watercolour, then sewed it into cloth.",
    ],
  },
  {
    _type: "marquee",
    items: [
      "PROTECTION",
      "·",
      "PERCEPTION",
      "·",
      "ILLUSION",
      "·",
      "NAZAR",
      "·",
      "EST. 2026",
    ],
  },
];

export async function getHomepageBlocks(): Promise<EditorialBlock[]> {
  return HOMEPAGE_BLOCKS;
}
