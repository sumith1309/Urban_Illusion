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
  // Surface the ₹599 launch drop first; backfill any remaining card slots
  // with the premium line so the rail is always full.
  const launchDrops = products.filter((p) => p.tags.includes("launch-drop"));
  const otherProducts = products.filter((p) => !p.tags.includes("launch-drop"));
  const featured = [...launchDrops, ...otherProducts].slice(0, 4);

  return (
    <main className="relative">
      {/* ──────────────── HERO — full-bleed cinematic, LCP-safe ────────────────
          Audit fix B3 (2026-05-25): the previous hero was a 640px-wide boxed
          composition with ~130px of cream on each side — the single biggest
          wasted moment on the page. This rewrite goes full-viewport
          (100svh × 100vw) with layered watercolour washes, a centred eye
          composition, and a dominant URBAN ILLUSION wordmark.

          LCP contract preserved:
            • Wordmark is the largest contentful element (~14vw vs ~18vw eye)
              — Lighthouse should still report it as LCP. RE-VERIFY POST-DEPLOY.
            • Inline SVG eye paints first; the master raster crossfades in via
              onLoad (HeroEyeBadge). No priority on the raster.
            • Watercolour washes are ~1–2 KB SVG decorations — zero cost. */}
      <section
        aria-labelledby="hero-title"
        className="relative w-full min-h-[100svh] flex flex-col items-center justify-between overflow-hidden isolate text-center"
      >
        {/* Layer 1 — cream → ivory ambient gradient (always behind everything) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(250,247,240,1) 0%, rgba(239,230,212,0.55) 45%, rgba(168,208,224,0.15) 80%, rgba(11,27,63,0.06) 100%)",
          }}
        />

        {/* Layer 2 — asymmetric watercolour washes. Decorative SVGs (~1 KB each),
            positioned art-directionally so the negative space frames the centre. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
          <Image
            src="/brand/watercolour-sand.svg"
            alt=""
            width={800}
            height={800}
            className="absolute -top-[10%] -left-[14%] w-[58vw] max-w-[760px] h-auto opacity-90 hero-wash-a"
          />
          <Image
            src="/brand/watercolour-navy.svg"
            alt=""
            width={800}
            height={800}
            className="absolute -bottom-[18%] -right-[10%] w-[52vw] max-w-[700px] h-auto opacity-80 hero-wash-b"
          />
          <Image
            src="/brand/watercolour-sand.svg"
            alt=""
            width={400}
            height={400}
            className="absolute top-[12%] right-[6%] w-[20vw] max-w-[260px] h-auto opacity-60 hero-wash-c"
          />
        </div>

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
            className="font-display-bold text-navy leading-[0.85] tracking-[-0.025em]"
            style={{ fontSize: "clamp(3.75rem, 14vw, 12rem)" }}
          >
            URBAN
            <span aria-hidden className="block font-mono font-medium uppercase text-ink mt-3"
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

        {/* CSS-only ambient drift on the watercolours. Reduced-motion honoured. */}
        <style>{`
          @keyframes hero-wash-drift-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(8px,-6px,0); } }
          @keyframes hero-wash-drift-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-10px,8px,0); } }
          @keyframes hero-wash-drift-c { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(4px,4px,0); } }
          .hero-wash-a { animation: hero-wash-drift-a 18s ease-in-out infinite; }
          .hero-wash-b { animation: hero-wash-drift-b 22s ease-in-out infinite; }
          .hero-wash-c { animation: hero-wash-drift-c 14s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .hero-wash-a, .hero-wash-b, .hero-wash-c { animation: none; }
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
            <p className="eyebrow">Launch Drop · ₹599 · Limited release</p>
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
