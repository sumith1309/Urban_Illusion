"use client";
import { useEffect, useRef } from "react";

/* Word-mask reveal. INP-safety:
   - Animation starts AFTER window 'load' so it cannot delay LCP/FCP.
   - GSAP loaded dynamically (already in the bundle from AddToCart).
   - Reduced motion: skip entirely; text remains in its painted final state.
   - Fixed to render a <span> wrapper — drop in next to existing text. */

export function RevealText({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    let cancelled = false;

    const start = async () => {
      const { gsap } = await import("gsap");
      if (cancelled || !el) return;
      const text = el.textContent ?? "";
      el.textContent = "";
      const frag = document.createDocumentFragment();
      text.split(" ").forEach((word, i, arr) => {
        const wrap = document.createElement("span");
        wrap.style.display = "inline-block";
        wrap.style.overflow = "hidden";
        wrap.style.verticalAlign = "top";
        const inner = document.createElement("span");
        inner.style.display = "inline-block";
        inner.style.transform = "translateY(110%)";
        inner.style.willChange = "transform";
        inner.textContent = word;
        wrap.appendChild(inner);
        frag.appendChild(wrap);
        if (i < arr.length - 1) frag.appendChild(document.createTextNode(" "));
      });
      el.appendChild(frag);

      const inners = el.querySelectorAll<HTMLElement>("span > span");
      gsap.to(inners, {
        y: "0%",
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        delay,
      });
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
    };
  }, [delay]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
