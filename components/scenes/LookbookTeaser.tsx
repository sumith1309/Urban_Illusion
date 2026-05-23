import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/motion/Parallax";

/* Split editorial teaser — large image on one side, oversized type on the
   other. Drives traffic to the Phase-3 lookbook page. */
export function LookbookTeaser() {
  return (
    <section className="bg-sand/40 border-y border-ink/8 overflow-hidden">
      <div className="container-lux px-4 lg:px-8 section-pad grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Editorial · Lookbook</p>
          <h2 className="font-display-bold text-navy mt-4 leading-[0.92] tracking-[-0.025em]"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}>
            Seen on<br />the road.
          </h2>
          <p className="text-lead mt-6 max-w-[44ch] text-ink-soft">
            The nazar travels — to terminal 2, the gallery wall, the gym floor.
            Each shoot is its own short essay.
          </p>
          <Link
            href="/lookbook"
            data-magnetic="0.35"
            className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] underline underline-offset-8 hover:text-cobalt"
          >
            Enter the lookbook
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
          <Parallax speed={0.12} className="absolute inset-0">
            <Image
              src="/catalog/IMG_8217.png"
              alt="Lookbook — terminal portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
