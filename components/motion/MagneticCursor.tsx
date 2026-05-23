"use client";
import { useEffect, useRef } from "react";

/* Magnetic cursor — desktop pointer only. INP-safety contract:
   - ONE passive pointermove listener on document. No per-element handlers.
   - rAF-batched: handler only stores latest x,y; a single rAF tick reads them
     and applies transform. Multiple mousemoves between frames = one paint.
   - Zero layout reads inside the loop (no getBoundingClientRect, no offsetX).
     Magnetic targets are measured ONCE per element on enter (cached) and
     re-measured on resize/scroll END (debounced), never mid-move.
   - Auto-disabled under reduced motion + on coarse pointer (touch).
   - Reads .magnetic data attribute for pull-strength override.
*/

const STRENGTH_DEFAULT = 0.35;
const FOLLOWER_LERP = 0.18;

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Latest pointer position (raw)
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    // Smoothed follower position (lerp toward x,y)
    let rx = x;
    let ry = y;

    // Active magnetic target rect — cached on enter, invalidated on leave
    let magnet: { el: HTMLElement; cx: number; cy: number; w: number; h: number; strength: number } | null = null;

    // Re-measure magnet on scroll/resize END (debounced) — never during pointermove
    const remeasure = () => {
      if (!magnet) return;
      const r = magnet.el.getBoundingClientRect();
      magnet.cx = r.left + r.width / 2;
      magnet.cy = r.top + r.height / 2;
      magnet.w = r.width;
      magnet.h = r.height;
    };

    let rafId = 0;

    const tick = () => {
      // Lerp follower toward pointer
      rx += (x - rx) * FOLLOWER_LERP;
      ry += (y - ry) * FOLLOWER_LERP;

      // Magnetic pull: if hovering a magnet, bend follower toward its center
      let tx = rx, ty = ry;
      let scale = 1;
      if (magnet) {
        const dx = (magnet.cx - rx) * magnet.strength;
        const dy = (magnet.cy - ry) * magnet.strength;
        tx = rx + dx;
        ty = ry + dy;
        scale = 2.2;

        // Also nudge the magnet element itself (transform only, no layout)
        const elDx = (x - magnet.cx) * (magnet.strength * 0.4);
        const elDy = (y - magnet.cy) * (magnet.strength * 0.4);
        magnet.el.style.transform = `translate3d(${elDx}px, ${elDy}px, 0)`;
      }

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%) scale(${scale})`;

      rafId = window.requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-magnetic]");
      if (!el || el === magnet?.el) return;
      const strength = Number(el.dataset.magnetic) || STRENGTH_DEFAULT;
      const r = el.getBoundingClientRect();
      magnet = {
        el,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: r.width,
        h: r.height,
        strength,
      };
    };

    const onOut = (e: PointerEvent) => {
      if (!magnet) return;
      const next = (e.relatedTarget as HTMLElement | null)?.closest?.("[data-magnetic]");
      if (next === magnet.el) return;
      magnet.el.style.transform = "";
      magnet = null;
    };

    let remeasureTimer = 0;
    const debouncedRemeasure = () => {
      window.clearTimeout(remeasureTimer);
      remeasureTimer = window.setTimeout(remeasure, 120);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("scroll", debouncedRemeasure, { passive: true });
    window.addEventListener("resize", debouncedRemeasure, { passive: true });

    rafId = window.requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", debouncedRemeasure);
      window.removeEventListener("resize", debouncedRemeasure);
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(remeasureTimer);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="hidden md:block fixed top-0 left-0 size-1.5 rounded-full bg-ink pointer-events-none z-[var(--z-cursor)] mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="hidden md:block fixed top-0 left-0 size-9 rounded-full border border-ink/30 pointer-events-none z-[var(--z-cursor)] mix-blend-difference"
        style={{
          willChange: "transform",
          transition: "scale 0.35s var(--ease-lux), border-color 0.35s var(--ease-lux)",
        }}
      />
    </>
  );
}
