import Link from "next/link";
import Image from "next/image";
import { EvilEyeHero } from "@/components/scenes/EvilEyeHero";
import { StoryScrollytelling } from "@/components/scenes/StoryScrollytelling";
import { LookbookTeaser } from "@/components/scenes/LookbookTeaser";
import { MarqueeStrip } from "@/components/motion/MarqueeStrip";
import { ProductCard } from "@/components/commerce/ProductCard";
import { getAllProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await getAllProducts();
  const featured = products.slice(0, 4);

  return (
    <main className="relative">
      {/* ──────────────── HERO — static-first, LCP-safe ──────────────── */
      /* EvilEyeHero renders the inline SVG poster (LCP) immediately and
         only mounts the R3F living-eye scene AFTER loadEventEnd + rIC.
         The wordmark text below is also painted server-side. */}
      <section
        aria-labelledby="hero-title"
        className="relative min-h-[100dvh] flex flex-col items-center justify-center section-pad overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 40%, rgba(239,230,212,0.85), transparent 60%), radial-gradient(ellipse at 70% 65%, rgba(168,208,224,0.18), transparent 55%)",
          }}
        />

        <p className="eyebrow mb-8 sm:mb-10">Est. 2026 · The Nazar Edit</p>

        <EvilEyeHero className="w-[min(80vw,520px)]" />

        {/* Wordmark — server-painted text, SplitText reveals an overlay only after load */}
        <h1
          id="hero-title"
          className="font-display-bold text-center leading-[0.85] tracking-[-0.025em] text-navy mt-6 sm:mt-8"
          style={{ fontSize: "clamp(3.5rem, 14vw, 11rem)" }}
        >
          URBAN
          <span aria-hidden className="block font-mono font-medium uppercase text-ink mt-3"
                style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.5rem)", letterSpacing: "0.42em", marginLeft: "0.42em" }}>
            Illusion
          </span>
          <span className="sr-only">Illusion</span>
        </h1>

        <p className="text-lead font-body mt-10 max-w-[32ch] text-center text-ink-soft px-4">
          A jewelled evil-eye amulet, rendered as ready-to-wear. Limited drops.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-5">
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

        <div className="hairline-rule absolute bottom-8 left-1/2 -translate-x-1/2 w-32" />
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
            <p className="eyebrow">The Nazar Edit · {products.length} pieces</p>
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
