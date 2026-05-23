import { StoryScrollytelling } from "@/components/scenes/StoryScrollytelling";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "The Eye" };

export default function StoryPage() {
  return (
    <main className="pt-24 lg:pt-28 bg-paper">
      <section className="container-lux px-4 lg:px-8 section-pad text-center">
        <p className="eyebrow">The Eye</p>
        <h1 className="mt-4 leading-[0.95] max-w-[20ch] mx-auto">
          Three thousand years of watching.
        </h1>
      </section>

      <div className="container-lux px-4 lg:px-8 mb-12">
        <div className="relative aspect-[4/3] max-w-3xl mx-auto rounded-sm overflow-hidden bg-sand">
          <Image
            src="/catalog/IMG_8105.png"
            alt="The evil-eye composition"
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <StoryScrollytelling />

      <section className="container-lux px-4 lg:px-8 section-pad text-center">
        <p className="eyebrow mb-4">Begin</p>
        <h2 className="leading-[0.95] max-w-[20ch] mx-auto">Step into the edit.</h2>
        <Link
          href="/shop"
          className="btn-press group/btn mt-10 inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap"
        >
          <span>Enter the shop</span>
          <span aria-hidden className="grid place-items-center size-9 rounded-full bg-paper text-navy">→</span>
        </Link>
      </section>
    </main>
  );
}
