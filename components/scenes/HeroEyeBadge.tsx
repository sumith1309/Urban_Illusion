"use client";

import Image from "next/image";

/**
 * Hero centrepiece — the customer's master logo, presented as the brand
 * statement. Corporate / professional treatment per user direction
 * (2026-05-25): no gloss, no gold rim, no particles, no aura. Just the
 * artwork, a soft paper-shadow, one quiet warm halo, and a gentle breath.
 *
 * The master logo already contains the URBAN ILLUSION wordmark, so the
 * page-level H1 is rendered sr-only. The artwork is the brand presentation.
 *
 * LCP: this image is the largest contentful element on the hero. Next/Image
 * with priority + fetchPriority="high" preloads the smallest viable variant
 * for the device; the 2 MB source is never delivered to the browser.
 */
export function HeroEyeBadge({ className }: { className?: string }) {
  return (
    <div
      className={`relative hero-logo-breathe ${className ?? ""}`}
      style={{ aspectRatio: "1556 / 2000" }}
    >
      {/* Single soft warm halo behind the logo — quiet depth, not decoration. */}
      <div
        aria-hidden
        className="absolute pointer-events-none -z-10"
        style={{
          inset: "-6%",
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(217,180,106,0.10) 0%, rgba(217,180,106,0.03) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <Image
        src="/brand/logo-master.png"
        alt="Urban Illusion"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 640px) 86vw, (max-width: 1280px) 56vw, 560px"
        quality={94}
        className="object-contain select-none"
        style={{
          filter:
            "drop-shadow(0 26px 56px rgba(11,27,63,0.18)) drop-shadow(0 2px 4px rgba(11,27,63,0.06))",
        }}
      />

      <style>{`
        @keyframes hero-logo-breathe {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(0,-4px, 0) scale(1.005); }
        }
        .hero-logo-breathe { animation: hero-logo-breathe 10s ease-in-out infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .hero-logo-breathe { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
