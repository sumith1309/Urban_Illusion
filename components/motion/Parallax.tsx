"use client";
import { useEffect, useRef } from "react";

/* Parallax wrapper — moves child via transform on scroll. INP-safety:
   - Lenis drives scroll via GSAP ticker, so we use ScrollTrigger which
     respects the same RAF batch — no separate scroll listener here.
   - Transform-only (translateY); never animates layout.
   - Skipped under reduced motion. */

export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    let cleanup: (() => void) | null = null;
    let started = false;

    /* INP+LCP-safety: don't load GSAP/ScrollTrigger until this element is
       near the viewport. Otherwise EVERY parallax instance on the page
       hydrates GSAP eagerly, blowing TTI and pushing LCP. */
    const io = new IntersectionObserver(
      async (entries) => {
        if (started || !entries[0].isIntersecting) return;
        started = true;
        io.disconnect();

        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        gsap.registerPlugin(ScrollTrigger);

        const distance = window.innerHeight * speed;
        const tween = gsap.fromTo(
          el,
          { y: -distance },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cleanup?.();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
