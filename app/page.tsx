import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
   PHASE 0 — homepage scaffold.

   LCP foundation: a server-rendered static hero (master logo poster +
   headline text) that paints immediately. The Phase 2 WebGL eye will
   crossfade in *over* this poster after loadEventEnd — the poster itself
   remains the LCP element on every render. The canvas is never LCP.
   See plan §"LCP-first contract".
   ────────────────────────────────────────────────────────────────────────── */

export default async function Home() {
  const products = await getAllProducts();
  const featured = products.slice(0, 4);

  return (
    <main className="relative">
      {/* ──────────────── HERO — static-first, LCP-safe ──────────────── */}
      <section
        aria-labelledby="hero-title"
        className="relative min-h-[100dvh] flex flex-col items-center justify-center section-pad overflow-hidden"
      >
        {/* Watercolour wash backdrop — decorative */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 40%, rgba(239,230,212,0.85), transparent 60%), radial-gradient(ellipse at 70% 65%, rgba(168,208,224,0.18), transparent 55%)",
          }}
        />

        <p className="eyebrow mb-10">Est. 2026 · The Nazar Edit</p>

        {/* Master logo as the LCP element. `priority` preloads & decodes
            synchronously. Aspect ratio reserved so no CLS. */}
        <div className="relative w-[min(86vw,640px)] aspect-[5/6]">
          <Image
            src="/brand/logo-master.png"
            alt="Urban Illusion — the jewelled evil-eye flagship logo"
            fill
            priority
            sizes="(max-width: 768px) 86vw, 640px"
            className="object-contain"
          />
        </div>

        <h1 id="hero-title" className="sr-only">
          Urban Illusion — Protection. Perception. Illusion.
        </h1>

        <p className="text-lead font-body mt-12 max-w-[36ch] text-center text-ink-soft">
          A jewelled evil-eye amulet, rendered as ready-to-wear. Limited drops.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="btn-press inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-sm font-mono tracking-[0.24em] uppercase"
          >
            <span>Enter the shop</span>
            <span className="grid place-items-center size-9 rounded-full bg-paper text-navy">→</span>
          </Link>
          <Link
            href="/story"
            className="btn-press text-sm font-mono tracking-[0.24em] uppercase underline underline-offset-8 decoration-1 hover:decoration-cobalt transition-colors"
          >
            Read the story
          </Link>
        </div>

        <div className="hairline-rule absolute bottom-8 left-1/2 -translate-x-1/2 w-32" />
      </section>

      {/* ──────────────── BRAND-SYSTEM CHECK (Phase 0 only) ──────────────── */}
      <section
        aria-labelledby="brand-system"
        className="section-pad container-lux border-t border-ink/5"
      >
        <p className="eyebrow">Phase 0 · Brand System Check</p>
        <h2 id="brand-system" className="mt-3 max-w-[16ch]">
          The tokens, the type, the palette.
        </h2>
        <p className="text-lead mt-6 max-w-[60ch] text-ink-soft">
          Confirming the design-token system renders correctly. Replaced in Phase 2
          by the cinematic scrollytelling story.
        </p>

        <ul className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { name: "Navy", hex: "#0B1B3F", textLight: true },
            { name: "Midnight", hex: "#14213D", textLight: true },
            { name: "Cobalt", hex: "#1E3A8A", textLight: true },
            { name: "Iris", hex: "#A8D0E0" },
            { name: "Gold", hex: "#B8965A" },
            { name: "Sand", hex: "#EFE6D4" },
            { name: "Paper", hex: "#FAF7F0" },
            { name: "Ink", hex: "#0A0A0A", textLight: true },
          ].map((c) => (
            <li
              key={c.name}
              className="rounded-md p-4 aspect-square flex flex-col justify-between text-[10px] font-mono tracking-[0.18em] uppercase"
              style={{ background: c.hex, color: c.textLight ? "#FAF7F0" : "#0A0A0A" }}
            >
              <span>{c.name}</span>
              <span className="opacity-70">{c.hex}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────────── SEEDED CATALOG (Phase 1 will replace with PLP) ──────────────── */}
      <section
        aria-labelledby="featured"
        className="section-pad container-lux border-t border-ink/5"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The Nazar Edit · {products.length} pieces</p>
            <h2 id="featured" className="mt-3">First glances.</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-mono tracking-[0.24em] uppercase underline underline-offset-8 decoration-1 hover:decoration-cobalt transition-colors"
          >
            See all →
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => (
            <li key={p.id} className="group">
              <Link href={`/shop/${p.handle}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand/30">
                  <Image
                    src={p.media[0].url}
                    alt={p.media[0].altText}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight">{p.title}</h3>
                  <span className="font-mono text-xs tracking-[0.18em]">
                    {formatPrice(p.priceRange.min.amount, "INR")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────────── FOOTER STRIP ──────────────── */}
      <footer className="section-pad bg-navy text-paper">
        <div className="container-lux flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[28ch]">
            <p className="eyebrow text-paper/60">Urban Illusion · Est. 2026</p>
            <p className="font-display text-4xl mt-4 text-paper">
              Protection. Perception. Illusion.
            </p>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper/40">
            © 2026 Urban Illusion. All rights reserved. <br />
            Phase 0 build · Foundation only.
          </p>
        </div>
      </footer>
    </main>
  );
}
