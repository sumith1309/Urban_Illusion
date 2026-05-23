"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* Page-transition curtain — paper-coloured wipe sweeps in then out on route
   change. No white flash. Uses simple class toggling + CSS transforms, no
   animation library: tiny, zero added dependencies, INP-safe. Skipped under
   reduced motion. */

export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const last = useRef(pathname);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    el.style.transform = "translateY(100%)";
    requestAnimationFrame(() => {
      el.style.transition = "transform 420ms var(--ease-lux)";
      el.style.transform = "translateY(0%)";
      window.setTimeout(() => {
        el.style.transition = "transform 520ms var(--ease-lux)";
        el.style.transform = "translateY(-100%)";
        window.setTimeout(() => {
          el.style.transition = "";
          el.style.transform = "translateY(100%)";
        }, 540);
      }, 220);
    });
  }, [pathname]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[var(--z-overlay)] bg-paper pointer-events-none"
      style={{ transform: "translateY(100%)", willChange: "transform" }}
    />
  );
}
