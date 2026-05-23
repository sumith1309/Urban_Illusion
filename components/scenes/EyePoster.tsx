/**
 * EyePoster — server-rendered inline SVG of the jewelled nazar.
 *
 * Why inline (not <img src="…svg">):
 *   On simulated slow-4G + 4× CPU throttle, an external SVG request adds a
 *   full waterfall round-trip to LCP (~2.7s simulated TTFB). Inlining ships
 *   the eye inside the initial HTML payload — LCP = FCP, no extra request,
 *   no priority hint needed. ~4KB of HTML cost.
 *
 * In Phase 2 the R3F WebGL eye crossfades OVER this poster once loadEventEnd
 * fires + requestIdleCallback (with setTimeout fallback for Safari). The
 * canvas is never the LCP element. See plan §"LCP-first contract".
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
        <radialGradient id="ep-cobalt" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="78%" stopColor="#142A6E" />
          <stop offset="100%" stopColor="#0B1B3F" />
        </radialGradient>
        <radialGradient id="ep-iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E9F2F6" />
          <stop offset="55%" stopColor="#A8D0E0" />
          <stop offset="100%" stopColor="#4F7C97" />
        </radialGradient>
        <pattern id="ep-stipple" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.65" fill="rgba(250,247,240,0.45)" />
        </pattern>
        <pattern id="ep-stippleDark" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.5" fill="rgba(11,27,63,0.35)" />
        </pattern>
        <radialGradient id="ep-washSand" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#D9C49A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#D9C49A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ep-washNavy" cx="55%" cy="80%" r="40%">
          <stop offset="0%" stopColor="#14213D" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#14213D" stopOpacity="0" />
        </radialGradient>
        <filter id="ep-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="34" />
        </filter>
      </defs>

      {/* Watercolour washes */}
      <g filter="url(#ep-bleed)" opacity="0.85">
        <ellipse cx="220" cy="180" rx="180" ry="120" fill="url(#ep-washSand)" />
        <ellipse cx="380" cy="460" rx="160" ry="200" fill="url(#ep-washNavy)" />
        <ellipse cx="170" cy="500" rx="90" ry="120" fill="url(#ep-washSand)" />
      </g>

      {/* Crosshair lines + small dot — echoes the master grid */}
      <g stroke="#0A0A0A" strokeWidth="0.9" opacity="0.85" fill="none">
        <line x1="60" y1="280" x2="240" y2="280" />
        <line x1="280" y1="60" x2="280" y2="600" />
        <line x1="400" y1="60" x2="400" y2="600" />
        <circle cx="400" cy="160" r="4.5" fill="#0B1B3F" stroke="none" />
      </g>

      {/* The jewelled eye */}
      <g transform="translate(300 290)">
        <circle r="118" fill="url(#ep-cobalt)" />
        <circle r="118" fill="url(#ep-stipple)" />
        <circle r="78" fill="#EFE6D4" />
        <circle r="78" fill="url(#ep-stippleDark)" opacity="0.5" />
        <circle r="52" fill="url(#ep-iris)" />
        <circle r="52" fill="url(#ep-stipple)" opacity="0.5" />
        <circle r="18" fill="#0A0A0A" />
        <circle cx="-7" cy="-9" r="3.5" fill="#FAF7F0" opacity="0.9" />
      </g>

      {/* Botanical sprig (original single-stroke line art) */}
      <g
        fill="none"
        stroke="#0A0A0A"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(430 160)"
      >
        <path d="M0 360 C -2 290, 4 220, -2 150 C -4 110, 6 70, 14 30" />
        <path d="M-2 300 C -28 295, -42 282, -44 262 C -28 266, -10 274, -2 294 Z" />
        <path d="M2 268 C 26 266, 38 254, 42 238 C 26 240, 8 248, 2 264 Z" />
        <path d="M-2 232 C -28 230, -42 216, -44 196 C -28 200, -10 208, -2 226 Z" />
        <path d="M2 200 C 26 198, 38 186, 40 168 C 24 170, 8 178, 2 196 Z" />
        <path d="M-2 170 C -24 168, -38 156, -42 138 C -26 140, -8 148, -2 164 Z" />
        <path d="M2 138 C 22 136, 34 124, 36 108 C 22 110, 6 118, 2 134 Z" />
      </g>

      {/* Paint-drag teardrop */}
      <g filter="url(#ep-bleed)" opacity="0.7">
        <ellipse cx="320" cy="560" rx="44" ry="100" fill="#14213D" />
      </g>

      {/* Spatter */}
      <g fill="#0B1B3F" opacity="0.65">
        <circle cx="160" cy="200" r="2" />
        <circle cx="500" cy="170" r="1.6" />
        <circle cx="480" cy="540" r="2.2" />
        <circle cx="120" cy="540" r="1.8" />
        <circle cx="380" cy="660" r="1.4" />
        <circle cx="220" cy="660" r="2" />
      </g>
    </svg>
  );
}
