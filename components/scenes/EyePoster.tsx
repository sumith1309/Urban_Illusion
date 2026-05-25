/**
 * EyePoster — server-rendered inline SVG of the jewelled nazar.
 *
 * Rebuilt 2026-05-25: the previous composition (random watercolour blobs +
 * botanical sprig + teardrop + spatter) read as a moodboard, not as a hero
 * piece. This version treats the eye as a single, centred focal subject —
 * jewellery-grade — with a gilded halo, a clean radial aura, and a small
 * number of refined accents (gold dust, subtle constellation marks).
 *
 * LCP contract preserved:
 *   - Inline SVG, server-rendered, no JS dependency for first paint.
 *   - All motion is CSS-only (driven by a <style> block inside the SVG).
 *   - prefers-reduced-motion is respected.
 */

import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  /** Decorative by default — the live <h1> carries the brand name. */
  ariaHidden?: boolean;
};

export function EyePoster({ ariaHidden = true, className, ...rest }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 720"
      role={ariaHidden ? "presentation" : "img"}
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : "Urban Illusion — evil-eye motif"}
      className={className}
      {...rest}
    >
      <defs>
        {/* Cobalt body of the disc */}
        <radialGradient id="ep-cobalt" cx="50%" cy="46%" r="55%">
          <stop offset="0%"  stopColor="#22489B" />
          <stop offset="60%" stopColor="#142A6E" />
          <stop offset="100%" stopColor="#0B1B3F" />
        </radialGradient>

        {/* Pearl ring */}
        <radialGradient id="ep-pearl" cx="50%" cy="48%" r="55%">
          <stop offset="0%"  stopColor="#FBF4E2" />
          <stop offset="100%" stopColor="#E9DCBF" />
        </radialGradient>

        {/* Iris */}
        <radialGradient id="ep-iris" cx="50%" cy="48%" r="50%">
          <stop offset="0%"  stopColor="#F2F8FB" />
          <stop offset="50%" stopColor="#A8D0E0" />
          <stop offset="100%" stopColor="#3F6A87" />
        </radialGradient>

        {/* Gilded halo ring (gold-on-cream) */}
        <linearGradient id="ep-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#D9B36A" />
          <stop offset="45%" stopColor="#B8965A" />
          <stop offset="100%" stopColor="#8A6F3E" />
        </linearGradient>

        {/* Soft warm aura behind the eye */}
        <radialGradient id="ep-aura" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#F4E7C3" stopOpacity="0.85" />
          <stop offset="55%"  stopColor="#E5D2A2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E5D2A2" stopOpacity="0" />
        </radialGradient>

        {/* Cool navy haze low in the frame */}
        <radialGradient id="ep-haze" cx="50%" cy="100%" r="65%">
          <stop offset="0%"   stopColor="#14213D" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#14213D" stopOpacity="0" />
        </radialGradient>

        {/* Stipple textures — give the disc a hand-printed jewelled feel */}
        <pattern id="ep-stippleLight" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.55" fill="rgba(250,247,240,0.40)" />
        </pattern>
        <pattern id="ep-stippleDark" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.45" fill="rgba(11,27,63,0.32)" />
        </pattern>

        {/* Organic edge — used to give the watercolour aura a painted bleed */}
        <filter id="ep-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="22" />
        </filter>

        {/* Inner shadow on the pearl ring — adds depth */}
        <filter id="ep-pearlShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
          <feOffset dx="0" dy="2" />
          <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        {/* Glow under the gilded halo */}
        <filter id="ep-haloGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* Subtle catch-light on the pupil */}
        <radialGradient id="ep-catch" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FAF7F0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* CSS animations — kept inside the SVG so the poster is self-contained. */}
      <style>{`
        @keyframes ep-haloPulse { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.018); } }
        @keyframes ep-haloRotate { to { transform: rotate(360deg); } }
        @keyframes ep-auraDrift { 0%,100% { transform: translate3d(0,0,0) scale(1); opacity: 0.9; } 50% { transform: translate3d(0,-6px,0) scale(1.02); opacity: 1; } }
        @keyframes ep-irisShimmer { 0%,100% { opacity: 0.92; } 50% { opacity: 1; } }
        @keyframes ep-pupilBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(0.94); } }
        @keyframes ep-particleA { 0% { transform: translateY(0) translateX(0); opacity: 0; } 20% { opacity: 0.85; } 100% { transform: translateY(-44px) translateX(8px); opacity: 0; } }
        @keyframes ep-particleB { 0% { transform: translateY(0) translateX(0); opacity: 0; } 30% { opacity: 0.7; } 100% { transform: translateY(-56px) translateX(-10px); opacity: 0; } }
        @keyframes ep-particleC { 0% { transform: translateY(0); opacity: 0; } 25% { opacity: 0.6; } 100% { transform: translateY(-38px); opacity: 0; } }

        .ep-halo-pulse  { transform-origin: 300px 320px; transform-box: fill-box; animation: ep-haloPulse 5.5s var(--ease-out-soft, ease-in-out) infinite; }
        .ep-halo-rotate { transform-origin: 300px 320px; transform-box: fill-box; animation: ep-haloRotate 90s linear infinite; }
        .ep-aura-drift  { transform-origin: center; animation: ep-auraDrift 11s ease-in-out infinite; }
        .ep-iris-shimmer{ animation: ep-irisShimmer 4.5s ease-in-out infinite; }
        .ep-pupil-breathe { transform-origin: 300px 320px; transform-box: fill-box; animation: ep-pupilBreathe 7s ease-in-out infinite; }
        .ep-particle-a  { animation: ep-particleA 7s ease-in-out infinite; }
        .ep-particle-b  { animation: ep-particleB 9s ease-in-out infinite; animation-delay: 1.4s; }
        .ep-particle-c  { animation: ep-particleC 8s ease-in-out infinite; animation-delay: 2.6s; }

        @media (prefers-reduced-motion: reduce) {
          .ep-halo-pulse, .ep-halo-rotate, .ep-aura-drift,
          .ep-iris-shimmer, .ep-pupil-breathe,
          .ep-particle-a, .ep-particle-b, .ep-particle-c { animation: none !important; }
        }
      `}</style>

      {/* 1 — Warm aura wash behind the eye (painted bleed) */}
      <g className="ep-aura-drift" filter="url(#ep-bleed)">
        <circle cx="300" cy="320" r="280" fill="url(#ep-aura)" />
      </g>

      {/* 2 — Cool haze low in the frame, for compositional weight */}
      <rect x="0" y="420" width="600" height="300" fill="url(#ep-haze)" />

      {/* 3 — Faint constellation marks (replaces the busy crosshair grid) */}
      <g fill="#0B1B3F" opacity="0.45">
        <circle cx="120" cy="180" r="1.6" />
        <circle cx="510" cy="210" r="1.3" />
        <circle cx="80"  cy="430" r="1.4" />
        <circle cx="540" cy="470" r="1.7" />
        <circle cx="150" cy="600" r="1.2" />
        <circle cx="470" cy="610" r="1.5" />
      </g>
      <g stroke="#0B1B3F" strokeWidth="0.5" opacity="0.22" fill="none">
        <line x1="120" y1="180" x2="150" y2="208" />
        <line x1="510" y1="210" x2="478" y2="232" />
        <line x1="150" y1="600" x2="186" y2="572" />
        <line x1="470" y1="610" x2="438" y2="576" />
      </g>

      {/* 4 — Gilded halo: an outer rotating thin ring + a pulsing soft glow */}
      <g className="ep-halo-rotate">
        <circle
          cx="300" cy="320" r="186"
          fill="none"
          stroke="url(#ep-gold)"
          strokeWidth="1.2"
          strokeDasharray="2 6"
          opacity="0.85"
        />
      </g>
      <g className="ep-halo-pulse" filter="url(#ep-haloGlow)">
        <circle cx="300" cy="320" r="170" fill="none" stroke="url(#ep-gold)" strokeWidth="2.6" opacity="0.55" />
      </g>

      {/* 5 — The jewelled eye, centred and dominant */}
      <g transform="translate(300 320)">
        {/* Cobalt body */}
        <circle r="148" fill="url(#ep-cobalt)" />
        <circle r="148" fill="url(#ep-stippleLight)" />
        {/* Thin gold rim — jewellery detail */}
        <circle r="148" fill="none" stroke="url(#ep-gold)" strokeWidth="1.1" opacity="0.85" />

        {/* Pearl ring */}
        <circle r="100" fill="url(#ep-pearl)" />
        <circle r="100" fill="url(#ep-stippleDark)" opacity="0.45" />
        <circle r="100" fill="none" stroke="#B8965A" strokeWidth="0.7" opacity="0.55" />

        {/* Iris — shimmering */}
        <g className="ep-iris-shimmer">
          <circle r="66" fill="url(#ep-iris)" />
          <circle r="66" fill="url(#ep-stippleLight)" opacity="0.55" />
          <circle r="66" fill="none" stroke="#0B1B3F" strokeWidth="0.6" opacity="0.4" />
        </g>

        {/* Pupil — gentle breath */}
        <g className="ep-pupil-breathe">
          <circle r="23" fill="#0A0A0A" />
          <circle cx="-9" cy="-11" r="4.5" fill="url(#ep-catch)" />
        </g>
      </g>

      {/* 6 — Gold dust particles (rising) — sparse, refined */}
      <g fill="url(#ep-gold)">
        <g className="ep-particle-a"><circle cx="200" cy="520" r="2.2" /></g>
        <g className="ep-particle-b"><circle cx="240" cy="540" r="1.6" /></g>
        <g className="ep-particle-c"><circle cx="360" cy="530" r="2.0" /></g>
        <g className="ep-particle-a" style={{ animationDelay: "3.2s" }}><circle cx="400" cy="510" r="1.4" /></g>
        <g className="ep-particle-b" style={{ animationDelay: "4.6s" }}><circle cx="320" cy="560" r="2.4" /></g>
        <g className="ep-particle-c" style={{ animationDelay: "5.8s" }}><circle cx="270" cy="500" r="1.6" /></g>
      </g>

      {/* 7 — Hairline meridian — a single elegant vertical reference */}
      <line x1="300" y1="50" x2="300" y2="120" stroke="#0B1B3F" strokeWidth="0.6" opacity="0.45" />
      <line x1="300" y1="520" x2="300" y2="680" stroke="#0B1B3F" strokeWidth="0.6" opacity="0.45" />
      <circle cx="300" cy="40" r="2.2" fill="#B8965A" />
      <circle cx="300" cy="690" r="2.2" fill="#B8965A" />
    </svg>
  );
}
