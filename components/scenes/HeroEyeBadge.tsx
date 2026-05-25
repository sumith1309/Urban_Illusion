"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * HeroEyeBadge — the eye at the centre of the full-bleed hero composition.
 *
 * Premium-royal treatment (2026-05-25):
 *   - Centred raster of the cleanly-cropped circular disc (no splatter, no
 *     asymmetry — the disc IS the subject).
 *   - Cobalt outer aura (soft glow behind, simulating the disc casting light).
 *   - Glossy highlight overlay (top-left arc — simulates light reflecting off
 *     a jewelled dome; the move every premium jewellery site uses to make a
 *     flat raster read as a real physical object).
 *   - Thin gold rim accent (jewellery setting).
 *   - Subtle gold particle motion (atmospheric depth, rare and refined).
 *   - Slow ambient breath on the whole composition (CSS only).
 *
 * LCP discipline preserved:
 *   1. Inline SVG paints first (server-rendered, no network).
 *   2. The high-res raster fetches without `priority` and crossfades in on
 *      onLoad — the wordmark stays the LCP element.
 *   3. All decoration is pure CSS / SVG — no extra network requests.
 */
export function HeroEyeBadge({ className }: { className?: string }) {
  const [rasterLoaded, setRasterLoaded] = useState(false);

  return (
    <div className={`relative aspect-square hero-eye-breathe ${className ?? ""}`}>
      {/* 1 — Soft cobalt outer aura (premium glow). Sits behind everything. */}
      <div
        aria-hidden
        className="absolute pointer-events-none -z-10"
        style={{
          inset: "-22%",
          background:
            "radial-gradient(circle at 50% 52%, rgba(30,58,138,0.30) 0%, rgba(30,58,138,0.10) 35%, transparent 65%)",
          filter: "blur(28px)",
        }}
      />

      {/* 2 — Inline SVG eye. Server-rendered first paint, LCP-safe. */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="absolute inset-0 w-full h-full select-none"
      >
        <defs>
          <radialGradient id="hb-cobalt" cx="50%" cy="48%" r="50%">
            <stop offset="0%"  stopColor="#22489B" />
            <stop offset="78%" stopColor="#0B1B3F" />
            <stop offset="100%" stopColor="#0B1B3F" />
          </radialGradient>
          <radialGradient id="hb-iris" cx="50%" cy="48%" r="50%">
            <stop offset="0%"  stopColor="#F2F8FB" />
            <stop offset="55%" stopColor="#A8D0E0" />
            <stop offset="100%" stopColor="#3F6A87" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#hb-cobalt)" />
        <circle cx="100" cy="100" r="60" fill="#EFE6D4" />
        <circle cx="100" cy="100" r="42" fill="url(#hb-iris)" />
        <circle cx="100" cy="100" r="14" fill="#0A0A0A" />
        <circle cx="93" cy="93" r="3.5" fill="#FAF7F0" opacity="0.9" />
      </svg>

      {/* 3 — Master raster (the customer's actual jewelled artwork). NOT
          priority — wordmark must remain LCP. Crossfades over the SVG. */}
      <Image
        src="/brand/eye-disc@2x.png"
        alt="Urban Illusion — the jewelled evil-eye amulet"
        fill
        sizes="(max-width: 640px) 200px, (max-width: 1280px) 260px, 320px"
        quality={92}
        onLoad={() => setRasterLoaded(true)}
        className="object-contain select-none transition-opacity duration-[700ms] ease-[var(--ease-lux)]"
        style={{ opacity: rasterLoaded ? 1 : 0 }}
      />

      {/* 4 — Thin gold rim. Jewellery setting — turns flat raster into a
          ringed amulet. */}
      <div
        aria-hidden
        className="absolute inset-[1%] rounded-full pointer-events-none"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(184,150,90,0.55), inset 0 1px 8px rgba(217,180,106,0.25), 0 0 22px rgba(184,150,90,0.10)",
        }}
      />

      {/* 5 — Glossy highlight (top-left arc). The single move that turns a
          flat circular raster into something that reads as a physical
          jewelled dome. Mix-blend-mode: screen so it brightens the cobalt
          without colour-staining the iris. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none hero-eye-gloss"
        style={{
          background:
            "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 18%, transparent 42%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 6 — Tiny gold dust particles drifting upward. Sparse, refined. */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-visible">
        <span className="ep-particle ep-particle-a" style={{ left: "22%", bottom: "8%"  }} />
        <span className="ep-particle ep-particle-b" style={{ left: "78%", bottom: "12%" }} />
        <span className="ep-particle ep-particle-c" style={{ left: "50%", bottom: "0%"  }} />
        <span className="ep-particle ep-particle-a" style={{ left: "12%", bottom: "20%", animationDelay: "3.4s" }} />
        <span className="ep-particle ep-particle-b" style={{ left: "88%", bottom: "4%",  animationDelay: "5.1s" }} />
      </div>

      <style>{`
        @keyframes hero-eye-breathe {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50%      { transform: translate3d(0,-4px,0) scale(1.008); }
        }
        @keyframes hero-eye-gloss-sweep {
          0%, 100% { opacity: 0.95; }
          50%      { opacity: 0.75; }
        }
        @keyframes ep-rise-a {
          0%   { transform: translateY(0)   translateX(0); opacity: 0; }
          25%  { opacity: 0.9; }
          100% { transform: translateY(-90px) translateX(6px); opacity: 0; }
        }
        @keyframes ep-rise-b {
          0%   { transform: translateY(0)   translateX(0); opacity: 0; }
          30%  { opacity: 0.7; }
          100% { transform: translateY(-110px) translateX(-8px); opacity: 0; }
        }
        @keyframes ep-rise-c {
          0%   { transform: translateY(0); opacity: 0; }
          25%  { opacity: 0.85; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .hero-eye-breathe { animation: hero-eye-breathe 9s ease-in-out infinite; will-change: transform; }
        .hero-eye-gloss   { animation: hero-eye-gloss-sweep 6.5s ease-in-out infinite; }

        .ep-particle {
          position: absolute;
          width: 4px; height: 4px;
          background: radial-gradient(circle, #D9B36A 0%, #B8965A 60%, rgba(184,150,90,0) 100%);
          border-radius: 50%;
          filter: blur(0.3px);
          pointer-events: none;
        }
        .ep-particle-a { animation: ep-rise-a 7.5s ease-in-out infinite; }
        .ep-particle-b { animation: ep-rise-b 9s   ease-in-out infinite; }
        .ep-particle-c { animation: ep-rise-c 8s   ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hero-eye-breathe, .hero-eye-gloss, .ep-particle { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
