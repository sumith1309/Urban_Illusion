import Link from "next/link";
import Image from "next/image";
import { HeroEyeBadge } from "@/components/scenes/HeroEyeBadge";
import { StoryScrollytelling } from "@/components/scenes/StoryScrollytelling";
import { LookbookTeaser } from "@/components/scenes/LookbookTeaser";
import { MarqueeStrip } from "@/components/motion/MarqueeStrip";
import { ProductCard } from "@/components/commerce/ProductCard";
import { getAllProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await getAllProducts();
  // Flat catalog now — every product is ₹599 sale / ₹799 compare-at.
  // Show the first four pieces of the curated order in the catalog.
  const featured = products.slice(0, 4);

  return (
    <main className="relative">
      {/* ──────────────── HERO — full-bleed cinematic, premium-royal ────────
          Refined 2026-05-25 from screenshot review:
          • SVG watercolour blobs replaced with composed CSS radial gradients
            (smoother, art-directable, infinite resolution, zero network).
          • Eye is now the cleanly-cropped circular DISC (no splatter, no
            asymmetry), wrapped in HeroEyeBadge with: cobalt outer aura,
            inline SVG first-paint, raster crossfade-on-load, thin gold rim,
            glossy top-left highlight overlay, and rising gold dust.
          • URBAN wordmark gets a vertical navy gradient via background-clip
            for royal-jewel depth without sacrificing legibility.

          LCP contract preserved:
            • Wordmark is the largest contentful element (~14vw glyphs vs
              ~18vw eye disc) and uses background-clip:text — still paints
              normal contentful glyphs. RE-VERIFY POST-DEPLOY.
            • Eye raster lazy-loaded; inline SVG holds the slot for first paint.
            • All decoration is CSS only — zero extra network requests. */}
      <section
        aria-labelledby="hero-title"
        className="relative w-full min-h-[100svh] flex flex-col items-center justify-between overflow-hidden isolate text-center"
      >
        {/* Layer 1 — multi-stop ambient atmosphere. Five composed radial
            gradients on a single bg layer: warm sand glow upper-left, cool
            cobalt glow lower-right, soft pearl highlight upper-centre, deeper
            cobalt vignette at the very edges, cream paper base. Replaces the
            previous SVG blob washes which read as overscaled gradient circles.
            Pure CSS — zero network, infinite smoothness, art-directable. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30 hero-atmos-shift"
          style={{
            background:
              [
                "radial-gradient(ellipse 60% 45% at 18% 22%, rgba(217,180,106,0.18) 0%, rgba(217,180,106,0.05) 45%, transparent 70%)",
                "radial-gradient(ellipse 55% 50% at 82% 78%, rgba(30,58,138,0.16)  0%, rgba(30,58,138,0.04) 50%, transparent 75%)",
                "radial-gradient(ellipse 70% 40% at 50% 8%,  rgba(250,247,240,1)   0%, rgba(250,247,240,0.6) 60%, transparent 90%)",
                "radial-gradient(circle  120% at 50% 50%,    transparent 60%, rgba(11,27,63,0.06) 100%)",
                "linear-gradient(180deg, #FAF7F0 0%, #F3EBD3 100%)",
              ].join(", "),
          }}
        />

        {/* Layer 2 — fine paper grain over the gradient. Inherits .grain-overlay
            from globals.css but scoped to this section so it composites with
            the atmosphere only. Already applied globally — this is a no-op
            placeholder noting the intentional layering. */}

        {/* Layer 3 — eyebrow (hidden in the md→lg dead zone where the audit
            saw the eyebrow muddling against the brand block; reappears at lg
            where there is room). */}
        <div className="pt-[clamp(7rem,14svh,11rem)] pb-2 px-4">
          <p className="eyebrow md:hidden lg:block">Est. 2026 · The Nazar Edit</p>
        </div>

        {/* Layer 4 — the centrepiece: eye + wordmark stack. The wordmark must
            remain the dominant visual element so Lighthouse keeps reporting it
            as the LCP element (REVERIFY: see HeroEyeBadge.tsx for the contract). */}
        <div className="relative flex flex-col items-center px-4">
          <HeroEyeBadge className="w-[clamp(160px,18vw,260px)] mb-[clamp(-1.25rem,-2vw,-2rem)] z-10" />

          <h1
            id="hero-title"
            className="font-display-bold leading-[0.85] tracking-[-0.025em] hero-wordmark"
            style={{ fontSize: "clamp(3.75rem, 14vw, 12rem)" }}
          >
            URBAN
            <span aria-hidden className="block font-mono font-medium uppercase text-ink mt-3 hero-wordmark-sub"
                  style={{ fontSize: "clamp(0.9rem, 2.6vw, 1.6rem)", letterSpacing: "0.44em", marginLeft: "0.44em" }}>
              Illusion
            </span>
            <span className="sr-only">Illusion</span>
          </h1>
        </div>

        {/* Layer 5 — tagline + CTAs anchored to the viewport bottom. */}
        <div className="flex flex-col items-center w-full pb-[clamp(2.5rem,6svh,4rem)] px-4">
          <p className="text-lead font-body max-w-[34ch] text-ink-soft">
            A jewelled evil-eye amulet, rendered as ready-to-wear. Limited drops.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-5">
            <Link
              href="/shop"
              data-magnetic="0.35"
              className="btn-press group/btn inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap"
            >
              <span>Enter the shop</span>
              <span aria-hidden className="grid place-items-center size-9 rounded-full bg-paper text-navy transition-transform duration-[var(--dur-base)] ease-[var(--ease-lux)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px">→</span>
            </Link>
            <Link
              href="/story"
              data-magnetic="0.2"
              className="btn-press text-[11px] font-mono tracking-[0.24em] uppercase underline underline-offset-8 decoration-1 hover:decoration-cobalt transition-colors whitespace-nowrap"
            >
              Read the story
            </Link>
          </div>
        </div>

        {/* Very slow ambient hue-shift on the atmosphere + multi-stop navy
            gradient on the wordmark for royal-jewel depth. The wordmark stays
            the LCP element — gradient is applied via background-clip:text
            which still paints normal contentful glyphs. Reduced-motion honoured. */}
        <style>{`
          @keyframes hero-atmos-shift {
            0%, 100% { filter: hue-rotate(0deg) saturate(1); }
            50%      { filter: hue-rotate(-4deg) saturate(1.04); }
          }
          .hero-atmos-shift { animation: hero-atmos-shift 22s ease-in-out infinite; will-change: filter; }

          .hero-wordmark {
            background: linear-gradient(180deg, #142A6E 0%, #0B1B3F 45%, #1E3A8A 100%);
            -webkit-background-clip: text;
                    background-clip: text;
            -webkit-text-fill-color: transparent;
                    color: transparent;
            /* Fallback colour for browsers that don't support background-clip:text */
          }
          @supports not ((-webkit-background-clip: text) or (background-clip: text)) {
            .hero-wordmark { color: var(--ui-navy); }
          }
          .hero-wordmark-sub { color: var(--ui-ink); }

          @media (prefers-reduced-motion: reduce) {
            .hero-atmos-shift { animation: none; }
          }
        `}</style>
      </section>

      {/* ──────────────── SCROLLYTELLING — Protection · Perception · Illusion ──────────────── */}
      <StoryScrollytelling />

      {/* ──────────────── MARQUEE STRIP ──────────────── */}
      <MarqueeStrip
        items={["PROTECTION", "PERCEPTION", "ILLUSION", "NAZAR", "EST. 2026", "MADE IN INDIA"]}
      />

      {/* ──────────────── FEATURED DROP ──────────────── */}
      <section className="container-lux px-4 lg:px-8 section-pad">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow">The Nazar Edit · ₹599 each · ₹799 strikethrough</p>
            <h2 className="mt-3">First glances.</h2>
          </div>
          <Link
            href="/shop"
            data-magnetic="0.3"
            className="font-mono text-[11px] uppercase tracking-[0.24em] underline underline-offset-8 hover:text-cobalt"
          >
            See all →
          </Link>
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {featured.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────────── LOOKBOOK TEASER ──────────────── */}
      <LookbookTeaser />

      {/* ──────────────── THE EYE SET-PIECE ──────────────── */}
      <section className="relative bg-paper overflow-hidden">
        <div className="container-lux px-4 lg:px-8 section-pad grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div className="relative aspect-square">
            <Image
              src="/catalog/IMG_8105.png"
              alt="The evil-eye composition"
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-contain"
            />
          </div>
          <div>
            <p className="eyebrow">The Eye</p>
            <h2 className="mt-4 leading-[0.95]">A talisman, three thousand years old.</h2>
            <p className="text-lead mt-6 text-ink-soft max-w-[50ch]">
              The nazar is the oldest amulet in human record. Worn on the throat,
              hung above a doorway, sewn into a child&apos;s coat. We rendered it in
              jewelled cobalt over a hand-painted wash. The piece protects the
              wearer the way it has protected travellers for centuries.
            </p>
            <Link
              href="/story"
              data-magnetic="0.35"
              className="btn-press group/btn mt-10 inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap"
            >
              <span>Read the story</span>
              <span aria-hidden className="grid place-items-center size-9 rounded-full bg-paper text-navy">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
