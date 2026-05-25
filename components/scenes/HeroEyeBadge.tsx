"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * HeroEyeBadge — the eye at the centre of the full-bleed hero composition.
 *
 * LCP-safe pattern (the discipline this codebase spent the whole build
 * protecting):
 *   1. Initial paint is an inline ~1.5 KB SVG of the eye — instant, no
 *      network round-trip, ships inside the HTML.
 *   2. Next/Image fetches the master-art raster (the customer's actual
 *      painterly jewelled eye) WITHOUT priority, lazy-resolved at the
 *      natural network priority of the page.
 *   3. When the raster's `onLoad` fires we crossfade it in OVER the SVG.
 *      The reader sees the eye continuously — the SVG holds the slot
 *      until the raster takes over.
 *
 * Because the eye sits at ~clamp(140px, 18vw, 260px) — visibly smaller than
 * the wordmark at clamp(3.5rem, 14vw, 12rem) — Lighthouse should still
 * report the wordmark text as the LCP element. RE-VERIFY THIS after deploy
 * with Lighthouse / WebPageTest. If LCP flips to the eye, drop the raster
 * back to lazy=true or reduce its display size.
 */
export function HeroEyeBadge({ className }: { className?: string }) {
  const [rasterLoaded, setRasterLoaded] = useState(false);

  return (
    <div className={`relative aspect-square ${className ?? ""}`}>
      {/* 1 — Inline SVG eye. Server-rendered, first paint, LCP-safe.
          Matches the customer's master visual character: cobalt disc, pearl
          ring, iris, pupil, highlight catch. */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="absolute inset-0 w-full h-full select-none"
      >
        <defs>
          <radialGradient id="hb-cobalt" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#22489B" />
            <stop offset="80%" stopColor="#0B1B3F" />
            <stop offset="100%" stopColor="#0B1B3F" />
          </radialGradient>
          <radialGradient id="hb-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#FAF7F0" />
            <stop offset="60%" stopColor="#A8D0E0" />
            <stop offset="100%" stopColor="#5F8DA8" />
          </radialGradient>
          <pattern id="hb-stipple" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.45" fill="rgba(250,247,240,0.40)" />
          </pattern>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#hb-cobalt)" />
        <circle cx="100" cy="100" r="92" fill="url(#hb-stipple)" />
        <circle cx="100" cy="100" r="60" fill="#EFE6D4" />
        <circle cx="100" cy="100" r="42" fill="url(#hb-iris)" />
        <circle cx="100" cy="100" r="14" fill="#0A0A0A" />
        <circle cx="93" cy="93" r="3" fill="#FAF7F0" opacity="0.85" />
      </svg>

      {/* 2 — Master raster. NOT priority — wordmark must remain LCP. Fades
          in over the SVG once it lands. */}
      <Image
        src="/brand/eye-master@2x.png"
        alt="Urban Illusion — the jewelled evil-eye amulet"
        fill
        sizes="(max-width: 640px) 160px, (max-width: 1280px) 220px, 280px"
        quality={88}
        onLoad={() => setRasterLoaded(true)}
        className="object-contain select-none transition-opacity duration-[700ms] ease-[var(--ease-lux)]"
        style={{ opacity: rasterLoaded ? 1 : 0 }}
      />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .hero-eye-badge img { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
