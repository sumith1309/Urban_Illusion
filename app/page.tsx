import Link from "next/link";
import { EyePoster } from "@/components/scenes/EyePoster";

/* ──────────────────────────────────────────────────────────────────────────
   PHASE 0 — homepage scaffold.

   LCP foundation: a server-rendered static hero (master logo poster +
   headline text) that paints immediately. The Phase 2 WebGL eye will
   crossfade in *over* this poster after loadEventEnd — the poster itself
   remains the LCP element on every render. The canvas is never LCP.
   See plan §"LCP-first contract".
   ────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="relative">
      {/* ──────────────── HERO — static-first, LCP-safe ──────────────── */
      /* LCP element is the vector eye-poster.svg (~4KB) + the live <h1>
         text below it. NOT the master PNG. The Phase 2 WebGL eye will
         crossfade over the SVG after loadEventEnd. The canvas is never LCP.
         The wordmark is LIVE text so SplitText can animate it in Phase 2,
         and so it remains accessible / SEO-indexable / responsive. */}
      <section
        aria-labelledby="hero-title"
        className="relative min-h-[100dvh] flex flex-col items-center justify-center section-pad overflow-hidden"
      >
        {/* Watercolour wash backdrop — pure CSS, no asset weight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 40%, rgba(239,230,212,0.85), transparent 60%), radial-gradient(ellipse at 70% 65%, rgba(168,208,224,0.18), transparent 55%)",
          }}
        />

        <p className="eyebrow mb-8 sm:mb-10">Est. 2026 · The Nazar Edit</p>

        {/* INLINED vector eye — shipped inside the initial HTML payload, so
            it paints at FCP with no round-trip on slow-4G. */}
        <EyePoster className="w-[min(80vw,520px)] h-auto -mb-4 sm:-mb-8" />

        {/* LIVE wordmark — real serif text. Weight 600 for presence at 16vw
            (Cormorant 500 risks reading thin at hero scale). Animatable by
            SplitText in Phase 2. */}
        <h1
          id="hero-title"
          className="font-display-bold text-center leading-[0.85] tracking-[-0.025em] text-navy mt-6 sm:mt-8"
          style={{ fontSize: "clamp(3.5rem, 14vw, 11rem)" }}
        >
          URBAN
          <span className="sr-only"> </span>
          <span
            aria-hidden="true"
            className="block font-mono font-medium uppercase text-ink mt-3"
            style={{
              fontSize: "clamp(0.85rem, 2.5vw, 1.5rem)",
              letterSpacing: "0.42em",
              marginLeft: "0.42em",
            }}
          >
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
            className="btn-press inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap"
          >
            <span>Enter the shop</span>
            <span className="grid place-items-center size-9 rounded-full bg-paper text-navy">→</span>
          </Link>
          <Link
            href="/story"
            className="btn-press text-[11px] font-mono tracking-[0.24em] uppercase underline underline-offset-8 decoration-1 hover:decoration-cobalt transition-colors whitespace-nowrap"
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

      {/* The featured-catalog block lives on Phase 1's homepage. Keeping the
          Phase 0 page lean so the LCP baseline measures the *foundation*,
          not a content payload that's a phase out of order. */}

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
