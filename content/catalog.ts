/**
 * Seeded Urban Illusion catalog — 10 on-brand nazar-themed products spanning
 * every mega-menu category so no panel renders empty.
 *
 * Imagery references composited from the supplied brand reference set
 * (Images/*.png). Replace `image.url` paths with Shopify CDN URLs when live
 * credentials land — the adapter swap is transparent to consumers.
 */

import type { Collection, Product } from "@/lib/shopify/types";

const INR = (amount: number) => ({
  amount: amount.toFixed(2),
  currencyCode: "INR" as const,
});

const mk = (
  src: string,
  alt: string,
  w = 1200,
  h = 1500,
) => ({ url: src, altText: alt, width: w, height: h });

const STD_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const variants = (
  product: string,
  colors: { name: string; hex: string }[],
  basePrice: number,
  sizes: string[] = STD_SIZES,
  invPerVariant = 8,
) =>
  colors.flatMap((c) =>
    sizes.map((s) => ({
      id: `${product}-${c.name.toLowerCase()}-${s.toLowerCase()}`,
      title: `${s} / ${c.name}`,
      size: s,
      color: c.name,
      colorHex: c.hex,
      sku: `UI-${product.toUpperCase()}-${c.name.slice(0, 3).toUpperCase()}-${s}`,
      price: INR(basePrice),
      available: true,
      inventoryQty: invPerVariant,
    })),
  );

/* ─── Products ──────────────────────────────────────────────────────────── */

export const PRODUCTS: Product[] = [
  /* ── Tees ── */
  {
    id: "nazar-oversize-tee",
    handle: "nazar-oversize-tee",
    title: "Nazar Oversize Tee",
    description:
      "The flagship piece. Heavyweight 240gsm cotton printed with the jewelled evil-eye in cobalt over a watercolour bleed of navy and sand. Drop shoulder, boxy hem.",
    status: "active",
    tags: ["tee", "nazar", "flagship", "new-in"],
    collections: ["the-nazar-edit", "new-in", "best-sellers"],
    badges: ["new"],
    media: [
      mk("/catalog/IMG_8095.png", "Nazar Oversize Tee — front"),
      mk("/catalog/IMG_8099.png", "Nazar Oversize Tee — worn"),
      mk("/catalog/IMG_8105.png", "Nazar print detail"),
    ],
    variants: variants("naz-tee", [
      { name: "Cream", hex: "#FAF7F0" },
      { name: "Charcoal", hex: "#1A1A1A" },
    ], 2890),
    priceRange: { min: INR(2890), max: INR(2890) },
    metafields: {
      story:
        "The nazar — the watchful eye — is the oldest amulet in human record. We rendered it in jewelled cobalt over a hand-painted wash. The piece protects you the way it has protected travellers for three thousand years.",
      materials: ["100% organic cotton", "240gsm jersey", "Water-based print"],
      care: ["Cold wash inside out", "Tumble dry low", "Do not iron print"],
      fit: "Oversized, drop shoulder",
      origin: "Made in India",
    },
    seo: {
      title: "Nazar Oversize Tee",
      description: "The flagship evil-eye tee. Heavyweight cotton, watercolour print.",
    },
  },
  {
    id: "nazar-acid-wash-tee",
    handle: "nazar-acid-wash-tee",
    title: "Nazar Acid Wash Tee",
    description:
      "Stonewashed mineral black with the jewelled nazar front-printed. Soft, lived-in hand. Each piece washes differently — no two are identical.",
    status: "active",
    tags: ["tee", "nazar", "acid-wash"],
    collections: ["the-nazar-edit"],
    badges: ["low-stock"],
    media: [
      mk("/catalog/PHOTO-2026-05-23-16-33-32.jpg", "Acid Wash Tee — front"),
      mk("/catalog/IMG_8752.png", "Acid Wash Tee — worn"),
    ],
    variants: variants("naz-acid", [
      { name: "Mineral Black", hex: "#1F1F1F" },
    ], 3190, STD_SIZES, 3),
    priceRange: { min: INR(3190), max: INR(3190) },
    metafields: {
      story: "Mineral-washed by hand in small batches. The wash deepens with wear.",
      materials: ["100% cotton", "260gsm heavyweight", "Acid mineral wash"],
      care: ["Cold wash with similar tones", "Air dry"],
      fit: "Oversized",
      origin: "Made in India",
    },
    seo: {
      title: "Nazar Acid Wash Tee",
      description: "Hand-washed mineral black tee with the evil-eye print.",
    },
  },
  {
    id: "cobalt-watercolour-tee",
    handle: "cobalt-watercolour-tee",
    title: "Cobalt Watercolour Tee",
    description:
      "An abstract navy + sand watercolour bleed laid across the chest — no eye, just the painter's gesture. For days the talisman travels quietly.",
    status: "active",
    tags: ["tee", "watercolour"],
    collections: ["the-nazar-edit", "new-in"],
    badges: ["new"],
    media: [
      mk("/catalog/IMG_8174.png", "Cobalt Watercolour Tee — back"),
      mk("/catalog/IMG_8175.png", "Cobalt Watercolour Tee — worn"),
    ],
    variants: variants("wc-tee", [
      { name: "Paper", hex: "#FAF7F0" },
    ], 2690),
    priceRange: { min: INR(2690), max: INR(2690) },
    metafields: {
      story: "The brushstroke without the eye. Quiet protection.",
      materials: ["100% organic cotton", "220gsm"],
      care: ["Cold wash", "Tumble dry low"],
      fit: "Relaxed",
      origin: "Made in India",
    },
    seo: { title: "Cobalt Watercolour Tee", description: "Abstract watercolour print." },
  },
  {
    id: "botanical-crewneck",
    handle: "botanical-crewneck",
    title: "Botanical Crewneck",
    description:
      "Single-line botanical sprig embroidered in navy on the chest. Mid-weight loopback. The leaves are the gentle counterpart to the eye.",
    status: "active",
    tags: ["tee", "embroidered", "botanical"],
    collections: ["the-nazar-edit"],
    badges: [],
    media: [
      mk("/catalog/IMG_8217.png", "Botanical Crewneck — back detail"),
    ],
    variants: variants("bot-crew", [
      { name: "Cream", hex: "#FAF7F0" },
      { name: "Sage", hex: "#9CAE9C" },
    ], 3490),
    priceRange: { min: INR(3490), max: INR(3490) },
    metafields: {
      story: "Embroidered by hand. The line is one continuous stitch.",
      materials: ["280gsm loopback", "Hand-embroidered chest"],
      care: ["Cold wash inside out", "Lay flat to dry"],
      fit: "Regular",
      origin: "Made in India",
    },
    seo: { title: "Botanical Crewneck", description: "Embroidered botanical sprig." },
  },

  /* ── Shirts ── */
  {
    id: "evil-eye-linen-shirt",
    handle: "evil-eye-linen-shirt",
    title: "Evil Eye Linen Shirt",
    description:
      "Lightweight pure linen short-sleeve with the nazar printed full-back. For summer evenings and quiet rooms.",
    status: "active",
    tags: ["shirt", "linen", "nazar"],
    collections: ["the-nazar-edit", "summer"],
    badges: [],
    media: [
      mk("/catalog/IMG_8174.png", "Evil Eye Linen Shirt — back"),
      mk("/catalog/IMG_8175.png", "Evil Eye Linen Shirt — full"),
    ],
    variants: variants("linen-1", [
      { name: "Paper", hex: "#FAF7F0" },
    ], 4890),
    priceRange: { min: INR(4890), max: INR(4890) },
    metafields: {
      story: "Pure linen, washed soft. The nazar holds you from the back.",
      materials: ["100% European flax linen", "Pearl buttons"],
      care: ["Cold gentle wash", "Iron damp on reverse"],
      fit: "Relaxed, camp collar",
      origin: "Made in India",
    },
    seo: { title: "Evil Eye Linen Shirt", description: "Linen camp-collar with back nazar." },
  },
  {
    id: "protection-linen-shirt",
    handle: "protection-linen-shirt",
    title: "Protection Linen Shirt",
    description:
      "Long-sleeve linen overshirt. Minimal front, watercolour cobalt panel on the back. Wear it open over the Nazar tee.",
    status: "active",
    tags: ["shirt", "linen", "overshirt"],
    collections: ["the-nazar-edit"],
    badges: [],
    media: [
      mk("/catalog/IMG_8217.png", "Protection Linen Shirt — back"),
    ],
    variants: variants("linen-2", [
      { name: "Paper", hex: "#FAF7F0" },
      { name: "Stone", hex: "#9C9484" },
    ], 5290),
    priceRange: { min: INR(5290), max: INR(5290) },
    metafields: {
      story: "Cut for layering. The watercolour panel reads like a private mural.",
      materials: ["100% linen", "Mother-of-pearl buttons"],
      care: ["Gentle wash", "Steam in place"],
      fit: "Long, oversized",
      origin: "Made in India",
    },
    seo: { title: "Protection Linen Shirt", description: "Long linen overshirt." },
  },

  /* ── Outerwear ── */
  {
    id: "gaze-hoodie",
    handle: "gaze-hoodie",
    title: "Gaze Hoodie",
    description:
      "450gsm brushed cotton fleece. Tonal cobalt-on-navy nazar embroidered chest-left. The heaviest piece in the line.",
    status: "active",
    tags: ["outerwear", "hoodie", "nazar"],
    collections: ["the-nazar-edit", "outerwear"],
    badges: ["new"],
    media: [
      mk("/catalog/IMG_8574.png", "Gaze Hoodie — worn"),
      mk("/catalog/IMG_8581.png", "Gaze Hoodie — back"),
    ],
    variants: variants("hood", [
      { name: "Royal Navy", hex: "#0B1B3F" },
      { name: "Mineral Black", hex: "#1F1F1F" },
    ], 6890),
    priceRange: { min: INR(6890), max: INR(6890) },
    metafields: {
      story: "Heavy. Quiet. The hood frames the gaze rather than hiding it.",
      materials: ["450gsm brushed cotton fleece", "Twill-tape drawcord"],
      care: ["Cold wash", "Tumble dry low"],
      fit: "Oversized",
      origin: "Made in India",
    },
    seo: { title: "Gaze Hoodie", description: "Heavyweight nazar hoodie." },
  },
  {
    id: "talisman-overshirt",
    handle: "talisman-overshirt",
    title: "Talisman Overshirt",
    description:
      "Mid-weight cotton overshirt with a full watercolour print across the back panel — the painter's hand, captured. Box pleat, horn buttons.",
    status: "active",
    tags: ["outerwear", "overshirt", "watercolour"],
    collections: ["outerwear"],
    badges: ["drop"],
    media: [
      mk("/catalog/IMG_8174.png", "Talisman Overshirt — back"),
    ],
    variants: variants("oversh", [
      { name: "Paper", hex: "#FAF7F0" },
    ], 7290),
    priceRange: { min: INR(7290), max: INR(7290) },
    metafields: {
      story: "Each overshirt is hand-printed. No two backs are identical.",
      materials: ["260gsm cotton twill", "Horn buttons"],
      care: ["Cold wash inside out", "Hang to dry"],
      fit: "Oversized, drop shoulder",
      origin: "Made in India",
    },
    seo: { title: "Talisman Overshirt", description: "Hand-printed watercolour overshirt." },
  },

  /* ── Bottoms ── */
  {
    id: "talisman-cargo",
    handle: "talisman-cargo",
    title: "Talisman Cargo",
    description:
      "Wide-leg cotton cargo with a tonal nazar embroidered above the right knee. Articulated knee panels, deep utility pockets.",
    status: "active",
    tags: ["bottoms", "cargo"],
    collections: ["bottoms"],
    badges: [],
    media: [
      mk("/catalog/IMG_8752.png", "Talisman Cargo — worn"),
    ],
    variants: variants("cargo", [
      { name: "Mineral Black", hex: "#1F1F1F" },
      { name: "Sand", hex: "#C9B58A" },
    ], 5990, ["S", "M", "L", "XL", "XXL"]),
    priceRange: { min: INR(5990), max: INR(5990) },
    metafields: {
      story: "The eye sits at the knee — exactly where you bend toward the world.",
      materials: ["320gsm cotton ripstop", "YKK hardware"],
      care: ["Cold wash", "Tumble dry low"],
      fit: "Wide leg, mid rise",
      origin: "Made in India",
    },
    seo: { title: "Talisman Cargo", description: "Wide-leg cargo with tonal nazar." },
  },

  /* ── Accessories ── */
  {
    id: "nazar-beaded-bracelet",
    handle: "nazar-beaded-bracelet",
    title: "Nazar Beaded Bracelet",
    description:
      "The literal amulet. Hand-strung glass nazar beads on a waxed cotton cord with an adjustable knot. Wear stacked or alone.",
    status: "active",
    tags: ["accessory", "amulet", "nazar"],
    collections: ["the-nazar-edit", "accessories"],
    badges: ["new"],
    media: [
      mk("/catalog/IMG_8241.png", "Nazar Beaded Bracelet"),
    ],
    variants: variants("brace", [
      { name: "Cobalt", hex: "#1E3A8A" },
      { name: "Pearl", hex: "#F2EFE6" },
    ], 1490, ["ONE"], 25),
    priceRange: { min: INR(1490), max: INR(1490) },
    metafields: {
      story:
        "The original talisman. Strung by hand in Istanbul-style glass. The knot adjusts to any wrist; the protection adjusts to any wearer.",
      materials: ["Glass nazar beads", "Waxed cotton cord"],
      care: ["Remove before water", "Wipe with soft cloth"],
      fit: "One size — adjustable knot",
      origin: "Hand-strung",
    },
    seo: { title: "Nazar Beaded Bracelet", description: "The literal evil-eye amulet." },
  },
];

/* ─── Collections ──────────────────────────────────────────────────────── */

export const COLLECTIONS: Collection[] = [
  {
    id: "the-nazar-edit",
    handle: "the-nazar-edit",
    title: "The Nazar Edit",
    description:
      "The flagship capsule. Every piece carries the eye — printed, embroidered, or rendered as the original amulet itself.",
    productHandles: [
      "nazar-oversize-tee",
      "nazar-acid-wash-tee",
      "cobalt-watercolour-tee",
      "botanical-crewneck",
      "evil-eye-linen-shirt",
      "protection-linen-shirt",
      "gaze-hoodie",
      "nazar-beaded-bracelet",
    ],
  },
  {
    id: "new-in",
    handle: "new-in",
    title: "New In",
    description: "Just landed.",
    productHandles: ["nazar-oversize-tee", "cobalt-watercolour-tee", "gaze-hoodie", "nazar-beaded-bracelet"],
  },
  {
    id: "outerwear",
    handle: "outerwear",
    title: "Outerwear",
    description: "Layers for the cooler months — hooded, overshirt, oversized.",
    productHandles: ["gaze-hoodie", "talisman-overshirt"],
  },
  {
    id: "accessories",
    handle: "accessories",
    title: "Accessories",
    description: "The amulet, hand-strung.",
    productHandles: ["nazar-beaded-bracelet"],
  },
  {
    id: "bottoms",
    handle: "bottoms",
    title: "Bottoms",
    description: "Cut for movement.",
    productHandles: ["talisman-cargo"],
  },
  {
    id: "best-sellers",
    handle: "best-sellers",
    title: "Best Sellers",
    description: "The pieces our community returns to.",
    productHandles: ["nazar-oversize-tee", "gaze-hoodie", "evil-eye-linen-shirt"],
  },
];

/* Convenience lookups */
export const PRODUCT_BY_HANDLE = Object.fromEntries(PRODUCTS.map((p) => [p.handle, p]));
export const COLLECTION_BY_HANDLE = Object.fromEntries(COLLECTIONS.map((c) => [c.handle, c]));
