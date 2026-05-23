"use client";
import { useEffect, useRef } from "react";

/* Lenis smooth-scroll, bound to GSAP's ticker so ScrollTrigger reads the same
   clock. Honours prefers-reduced-motion (mount no-op = native scroll).
   Lenis loaded dynamically AND init gated post-load + requestIdleCallback so
   the Lenis mount's scrollbar/body style switch happens AFTER LCP is settled.
   Otherwise the layout shift on mount pushes the LCP timestamp. */

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cancelled = false;
    let timeout = 0;

    const init = async () => {
      const [{ default: Lenis }, { gsap }] = await Promise.all([
        import("lenis"),
        import("gsap"),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      ref.current = {
        destroy: () => {
          gsap.ticker.remove(onTick);
          lenis.destroy();
        },
      };
    };

    const schedule = () => {
      const ric =
        (window as typeof window & { requestIdleCallback?: (cb: () => void) => number })
          .requestIdleCallback;
      const idle: (cb: () => void) => number =
        ric ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle(() => init());
    };

    if (document.readyState === "complete") {
      timeout = window.setTimeout(schedule, 0);
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("load", schedule);
      ref.current?.destroy();
      ref.current = null;
    };
  }, []);

  return <>{children}</>;
}
