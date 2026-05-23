"use client";
import { useEffect, useState } from "react";

/* Non-occluding preloader — a hairline progress rule at the very top of the
   viewport (gold→cobalt gradient). First-visit only via sessionStorage.
   Skipped under reduced motion.

   LCP-safety: implemented as a pure CSS @keyframes animation (no rAF loop,
   no per-frame React work). The component renders ONE element, marks the
   session, schedules a SINGLE setTimeout to unmount after the animation
   ends, then exits. No continuous JS activity = Lighthouse's LCP stability
   window settles at FCP. */

const KEY = "ui-preload-seen-v1";
const TOTAL_MS = 1100; // 200ms fadein + 600ms scale + 300ms fadeout

function shouldSkip() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (sessionStorage.getItem(KEY)) return true;
  return false;
}

export function Preloader() {
  const [mounted, setMounted] = useState(() => !shouldSkip());

  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(KEY, "1");
    const id = window.setTimeout(() => setMounted(false), TOTAL_MS);
    return () => window.clearTimeout(id);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[var(--z-toast)] pointer-events-none h-[2px] overflow-hidden"
    >
      <div
        className="h-full w-full origin-left ui-preload-bar"
        style={{
          background:
            "linear-gradient(90deg, rgba(184,150,90,0) 0%, var(--ui-gold) 50%, var(--ui-cobalt) 100%)",
        }}
      />
      <style>{`
        @keyframes ui-preload-sweep {
          0%   { transform: scaleX(0); opacity: 0; }
          18%  { opacity: 1; }
          73%  { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        .ui-preload-bar {
          animation: ui-preload-sweep ${TOTAL_MS}ms cubic-bezier(0.2,0.7,0.1,1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
