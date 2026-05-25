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
      {/* ──────────────── HERO — full-bleed corporate, brand-mark-as-statement
          Refined 2026-05-25 per user direction:
          • The master logo (URBAN ILLUSION + jewelled eye + watercolour as
            originally art-directed) is the centrepiece, full-resolution,
            with soft paper-shadow and a quiet warm halo. Nothing else.
          • The previous gloss / gold rim / particles / multi-blob gradients
            are removed — the user asked for "no extra, on point, corporate".
          • No visible H1 wordmark below the logo — the logo already contains
            the typeset URBAN ILLUSION. H1 stays sr-only for SEO / a11y. */}
      <section
        aria-labelledby="hero-title"
        className="relative w-full min-h-[100svh] flex flex-col items-center justify-between overflow-hidden isolate text-center"
      >
        {/* Single clean ambient gradient — cream paper with a soft warm pool at
            the top-centre and a near-invisible edge vignette. Replaces the
            multi-blob composition. Corporate restraint over decorative noise. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              [
                "radial-gradient(ellipse 90% 50% at 50% 20%, rgba(250,247,240,1) 0%, rgba(243,235,211,0.85) 60%, transparent 100%)",
                "radial-gradient(circle 110% at 50% 50%, transparent 65%, rgba(11,27,63,0.05) 100%)",
                "linear-gradient(180deg, #FAF7F0 0%, #F3EBD3 100%)",
              ].join(", "),
          }}
        />

        {/* Top — quiet eyebrow, hidden in the md→lg cramped band. */}
        <div className="pt-[clamp(6rem,12svh,9rem)] pb-2 px-4">
          <p className="eyebrow md:hidden lg:block">Est. 2026 · Limited Drops</p>
        </div>

        {/* Centre — the master logo IS the brand statement. The artwork already
            contains the URBAN ILLUSION wordmark, so we don't repeat it as a
            visible H1; the H1 stays sr-only for SEO / a11y. */}
        <div className="relative flex flex-col items-center px-4">
          <HeroEyeBadge className="w-[clamp(280px,52vw,540px)]" />
          <h1 id="hero-title" className="sr-only">Urban Illusion — Limited Drops</h1>
        </div>

        {/* Bottom — tagline + CTAs. */}
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
            <p className="eyebrow">Limited Drop · ₹599 each · ₹799 strikethrough</p>
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
