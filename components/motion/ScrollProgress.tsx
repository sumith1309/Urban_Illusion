"use client";
import { useEffect, useRef } from "react";

/* Hairline scroll progress at the very top of the viewport (1px, gold gradient).
   INP-safety: passive scroll listener, rAF-batched, transform-only on scaleX.
   No layout reads. */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bar = ref.current;
    let pending = false;

    const update = () => {
      pending = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[var(--z-toast)] h-px origin-left pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, var(--ui-gold) 45%, var(--ui-cobalt) 100%)",
        transform: "scaleX(0)",
        willChange: "transform",
      }}
    />
  );
}
