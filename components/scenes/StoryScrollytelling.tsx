"use client";
import { useEffect, useRef } from "react";

/* Pinned scrollytelling — three protection-themed lines crossfade in as the
   section scrubs. INP-safety: ScrollTrigger only; no per-frame DOM reads
   inside callbacks; transform/opacity only. */

const LINES = [
  { eyebrow: "I.",   title: "Protection.",  body: "The nazar watches the road for you — it catches what the world hopes you'll miss." },
  { eyebrow: "II.",  title: "Perception.",  body: "We rendered the watchful eye in cobalt and watercolour, then sewed it into cloth." },
  { eyebrow: "III.", title: "Illusion.",    body: "What you wear is what they see. The amulet protects you — and turns heads." },
];

export function StoryScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No animation — show all three lines simultaneously
      containerRef.current
        .querySelectorAll<HTMLElement>(".sc-line")
        .forEach((el) => (el.style.opacity = "1"));
      return;
    }

    const container = containerRef.current;
    let cleanup: (() => void) | null = null;
    let started = false;

    /* INP+LCP-safety: don't load GSAP+ScrollTrigger until the section is
       near the viewport. The homepage's scrollytelling sits below the hero;
       gating it keeps the hero TTI lean. */
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

        const lines = container.querySelectorAll<HTMLElement>(".sc-line");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=" + lines.length * 60 + "%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        lines.forEach((line, i) => {
          if (i > 0) tl.to(lines[i - 1], { opacity: 0, y: -20, duration: 1 });
          tl.fromTo(line, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
        });

        cleanup = () => {
          ScrollTrigger.getAll().forEach((s) => s.trigger === container && s.kill());
          tl.kill();
        };
      },
      { rootMargin: "300px" },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-paper"
      aria-label="The Eye — story"
    >
      <div className="h-dvh sticky top-0 flex items-center justify-center section-pad container-lux">
        <div className="relative w-full max-w-[80ch] text-center">
          {LINES.map((line, i) => (
            <div
              key={line.title}
              className="sc-line absolute inset-0 flex flex-col items-center justify-center"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="eyebrow text-cobalt mb-6">{line.eyebrow}</p>
              <p className="font-display-bold text-navy leading-[0.95] tracking-[-0.025em]"
                 style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}>
                {line.title}
              </p>
              <p className="text-lead mt-8 max-w-[42ch] text-ink-soft">{line.body}</p>
            </div>
          ))}
        </div>
      </div>
      {/* The scroll-trigger trailer: blank space the pin consumes */}
      <div className="h-[60dvh]" aria-hidden />
    </section>
  );
}
