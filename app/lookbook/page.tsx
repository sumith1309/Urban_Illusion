import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Lookbook" };

const SPREADS = [
  {
    src: "/catalog/IMG_8217.png",
    title: "Terminal 2",
    caption: "Layered in transit. The nazar reads as a passport stamp.",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/catalog/IMG_8174.png",
    title: "Studio floor",
    caption: "The watercolour wash before the print sets.",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/catalog/IMG_8241.png",
    title: "Gallery wall",
    caption: "Cobalt finds cobalt. The eye finds the eye.",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/catalog/IMG_8574.png",
    title: "After hours",
    caption: "The piece worn the way it asks to be worn.",
    aspect: "aspect-[3/4]",
  },
];

export default function LookbookPage() {
  return (
    <main className="pt-24 lg:pt-28 bg-paper">
      <section className="container-lux px-4 lg:px-8 section-pad text-center">
        <p className="eyebrow">Lookbook · Spring 2026</p>
        <h1 className="font-display-bold text-navy mt-4 leading-[0.92] tracking-[-0.025em] max-w-[18ch] mx-auto"
            style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}>
          Seen on the road.
        </h1>
        <p className="text-lead mt-6 max-w-[48ch] mx-auto text-ink-soft">
          A short essay told in four frames. Each shoot follows the nazar to a
          different room — terminal, studio, gallery, kitchen at midnight.
        </p>
      </section>

      <section className="container-lux px-4 lg:px-8 pb-24 grid sm:grid-cols-2 gap-x-6 gap-y-16">
        {SPREADS.map((s, i) => (
          <figure key={s.src} className={i % 2 === 1 ? "sm:mt-24" : ""}>
            <div className={`relative ${s.aspect} overflow-hidden rounded-sm bg-sand/40`}>
              <Image
                src={s.src}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-display text-xl">{s.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                Frame {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
            <p className="mt-2 text-sm text-ink-soft max-w-[42ch]">{s.caption}</p>
          </figure>
        ))}
      </section>

      <section className="border-t border-ink/8 bg-sand/40">
        <div className="container-lux px-4 lg:px-8 section-pad text-center">
          <p className="eyebrow mb-4">Shop the looks</p>
          <h2 className="leading-[0.95] max-w-[18ch] mx-auto">
            Every piece, one click away.
          </h2>
          <Link
            href="/shop"
            className="btn-press group/btn mt-10 inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap"
          >
            <span>Enter the shop</span>
            <span aria-hidden className="grid place-items-center size-9 rounded-full bg-paper text-navy">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
