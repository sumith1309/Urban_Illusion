"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

/* Pinned editorial scrollytelling.
   Composition rules (premium-maison):
   - Deep-navy stage (constant) — never the photo bleeding to edges.
   - Image is a CONTAINED portrait artifact with a hairline gold frame and a
     subtle interior vignette. Sits to one side, alternating per slide.
   - Type lives in the negative space opposite the image. Eyebrow with rule,
     Fraunces headline in paper, restrained body in paper/70.
   - Footer: page number (01 / 03) + section caption, hairline above.
   INP-safety: IO-gated GSAP load, opacity-only crossfades. */

type Line = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  side: "left" | "right";
};

const LINES: Line[] = [
  {
    eyebrow: "Chapter I",
    title: "Protection.",
    body: "The nazar watches the road for you — it catches what the world hopes you'll miss.",
    image: "/catalog/IMG_8217.png",
    alt: "Wearer of the nazar in transit",
    side: "left",
  },
  {
    eyebrow: "Chapter II",
    title: "Perception.",
    body: "We rendered the watchful eye in cobalt and watercolour, then sewed it into cloth.",
    image: "/catalog/IMG_8174.png",
    alt: "The nazar print on the back of a linen shirt",
    side: "right",
  },
  {
    eyebrow: "Chapter III",
    title: "Illusion.",
    body: "What you wear is what they see. The amulet protects you — and turns heads.",
    image: "/catalog/IMG_8752.png",
    alt: "Wearer of the nazar tee in a gallery",
    side: "left",
  },
];

export function StoryScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      containerRef.current
        .querySelectorAll<HTMLElement>(".sc-slide")
        .forEach((el) => (el.style.opacity = "1"));
      return;
    }

    const container = containerRef.current;
    let cleanup: (() => void) | null = null;
    let started = false;

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

        const slides = container.querySelectorAll<HTMLElement>(".sc-slide");

        /* Pin duration: ~120vh per slide (hold + crossfade). ScrollTrigger
           inserts a pin-spacer matching this, so we never add a manual
           trailer below — doing both creates an empty gap. */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=" + slides.length * 120 + "%",
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        /* Timeline structure per slide: HOLD (2u) → CROSSFADE (1u) → HOLD (2u).
           Slide 0 already starts at opacity 1, so we don't fade it in. */
        slides.forEach((slide, i) => {
          if (i === 0) {
            tl.to({}, { duration: 2 });
          } else {
            tl.to(slides[i - 1], { opacity: 0, duration: 1 }, "+=0");
            tl.to(slide, { opacity: 1, duration: 1 }, "<");
            tl.to({}, { duration: 2 });
          }
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
      className="relative bg-navy"
      aria-label="The Eye — story"
      style={{ color: "var(--ui-paper)" }}
    >
      {/* h-dvh inner stage. GSAP's pin: true wraps this in a pin-spacer of
          the pin duration — DO NOT also add CSS sticky or a manual trailer
          below, both create empty space. */}
      <div className="h-dvh overflow-hidden relative">
        {/* Constant chrome: top-left section mark + top-right hairline */}
        <div className="absolute top-0 inset-x-0 z-10 px-8 lg:px-16 pt-10 flex items-center justify-between pointer-events-none">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "rgba(217, 196, 154, 0.9)" }}
          >
            The Eye · Story
          </p>
          <div className="hidden sm:block h-px w-32 bg-paper/20" />
        </div>

        {/* Slides */}
        {LINES.map((line, i) => {
          const isLeftImage = line.side === "left";
          return (
            <div
              key={line.title}
              className={`sc-slide absolute inset-0 flex flex-col lg:flex-row ${isLeftImage ? "" : "lg:flex-row-reverse"}`}
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-hidden={i !== 0 ? "true" : undefined}
            >
              {/* IMAGE FRAME — contained, portrait, hairline gold border + vignette */}
              <div className="lg:w-1/2 flex items-center justify-center px-8 lg:px-12 py-12 lg:py-24">
                <div
                  className="relative w-full max-w-[380px] aspect-[3/4] mx-auto"
                  style={{
                    boxShadow:
                      "0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,150,90,0.25)",
                  }}
                >
                  <Image
                    src={line.image}
                    alt={line.alt}
                    fill
                    sizes="(max-width: 1024px) 80vw, 380px"
                    priority={i === 0}
                    className="object-cover"
                  />
                  {/* Inner vignette + cool tone */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(11,27,63,0) 60%, rgba(11,27,63,0.45) 100%)",
                    }}
                  />
                  {/* Inner hairline */}
                  <div
                    className="absolute inset-2 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(250,247,240,0.08)" }}
                  />
                </div>
              </div>

              {/* TYPE COLUMN */}
              <div className="lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 pb-16 lg:pb-0">
                <div className="max-w-[34ch] mx-auto lg:mx-0">
                  {/* Eyebrow with rule */}
                  <div className="flex items-center gap-4 mb-8">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.32em]"
                      style={{ color: "rgba(217, 196, 154, 0.95)" }}
                    >
                      {line.eyebrow}
                    </span>
                    <span
                      className="h-px w-12"
                      style={{ background: "rgba(184,150,90,0.6)" }}
                    />
                  </div>

                  {/* Headline — Fraunces paper, large but tight */}
                  <h2
                    className="font-display-bold leading-[0.9] tracking-[-0.025em]"
                    style={{
                      fontSize: "clamp(3rem, 9vw, 8rem)",
                      color: "var(--ui-paper)",
                    }}
                  >
                    {line.title}
                  </h2>

                  {/* Body */}
                  <p
                    className="mt-8 max-w-[40ch] text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed"
                    style={{ color: "rgba(250,247,240,0.78)" }}
                  >
                    {line.body}
                  </p>

                  {/* Page indicator */}
                  <div className="mt-12 flex items-center gap-3">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.32em]"
                      style={{ color: "rgba(250,247,240,0.55)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-12 bg-paper/30" />
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.32em]"
                      style={{ color: "rgba(250,247,240,0.45)" }}
                    >
                      / {String(LINES.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.42em]"
            style={{ color: "rgba(250,247,240,0.45)" }}
          >
            Scroll to continue
          </span>
          <div className="h-8 w-px bg-paper/20" />
        </div>
      </div>
    </section>
  );
}
