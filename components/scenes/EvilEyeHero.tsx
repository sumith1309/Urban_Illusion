import Image from "next/image";

/**
 * Hero canvas — the customer's master artwork, framed as a museum piece.
 *
 * Rationale (2026-05-25): the synthetic SVG poster previously rendered here
 * read as a redraw of the customer's logo, not the logo itself. The senior
 * move is to USE the master artwork (logo-master.png — painterly, stippled,
 * hand-finished) as the hero subject and frame it with gentle ambient motion
 * + a soft paper-shadow so it reads as an artwork on the page rather than
 * a flat asset drop.
 *
 * LCP contract:
 *   - Next/Image with priority + correct sizes → the smallest viable AVIF/WebP
 *     is preloaded, not the 2 MB source.
 *   - The motion lives in a server-rendered <style> tag (no JS) and is gated
 *     behind prefers-reduced-motion.
 */

export function EvilEyeHero({ className }: { className?: string }) {
  return (
    <div
      className={`hero-canvas relative ${className ?? ""}`}
      style={{ aspectRatio: "1556 / 2000" }}
    >
      {/* Self-contained motion — gentle ambient float + scale breath. */}
      <style>{`
        @keyframes hero-breathe {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(0, -6px, 0) scale(1.012); }
        }
        @keyframes hero-glow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.04); }
        }
        .hero-canvas         { will-change: transform; animation: hero-breathe 12s ease-in-out infinite; }
        .hero-canvas-glow    { animation: hero-glow 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-canvas, .hero-canvas-glow { animation: none !important; transform: none !important; }
        }
      `}</style>

      {/* Soft warm aura behind the artwork — paper-on-paper depth. */}
      <div
        aria-hidden
        className="hero-canvas-glow pointer-events-none absolute inset-[-12%] -z-10 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(239,230,212,0.85), rgba(168,208,224,0.18) 55%, transparent 75%)",
        }}
      />

      {/* The artwork. Next/Image generates AVIF/WebP at the device width. */}
      <Image
        src="/brand/logo-master.png"
        alt="Urban Illusion — the jewelled evil-eye amulet"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 640px) 86vw, (max-width: 1024px) 60vw, 640px"
        quality={92}
        className="object-contain select-none"
        style={{
          filter: "drop-shadow(0 24px 56px rgba(11,27,63,0.18)) drop-shadow(0 2px 6px rgba(11,27,63,0.08))",
        }}
      />
    </div>
  );
}
