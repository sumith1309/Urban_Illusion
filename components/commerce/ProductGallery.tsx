"use client";
import Image from "next/image";
import { useState } from "react";
import type { Image as Img } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/* Sticky PDP gallery — main image + thumbnail rail.
   Phase 1: clean crossfade on thumbnail click.
   Phase 3: in-place pinch-zoom + 360° spin. */

export function ProductGallery({ media, alt }: { media: Img[]; alt: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = media[activeIdx];

  return (
    <div className="grid lg:grid-cols-[88px_1fr] gap-4 lg:sticky lg:top-24">
      {/* Thumbnail rail (vertical on lg) */}
      <ol className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
        {media.map((m, i) => (
          <li key={`${m.url}-${i}`} className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={activeIdx === i}
              className={cn(
                "relative block w-20 lg:w-full aspect-[4/5] overflow-hidden rounded-sm bg-sand/30 transition-opacity",
                activeIdx === i ? "opacity-100 ring-1 ring-ink" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={m.url} alt={m.altText} fill sizes="88px" className="object-cover" />
            </button>
          </li>
        ))}
      </ol>

      {/* Main image */}
      <div className="relative aspect-[4/5] w-full bg-sand/30 rounded-sm overflow-hidden order-1 lg:order-2">
        <Image
          key={active.url}
          src={active.url}
          alt={active.altText || alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover animate-[fadeIn_var(--dur-base)_var(--ease-lux)]"
        />
        <style>{`@keyframes fadeIn { from { opacity: 0.4; } to { opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
