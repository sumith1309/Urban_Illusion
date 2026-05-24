"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Heart } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { Swatch } from "@/components/ui/Swatch";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/lib/shopify/types";

/* Editorial product card:
   - Crossfade to second image on hover (no shifting)
   - Colour swatches surface on hover/focus
   - Quick-view button reveals on hover
   - 4:5 aspect for cohesive grid */

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const liked = useWishlist((s) => s.items.some((i) => i.id === product.id));
  const toggleLike = useWishlist((s) => s.toggle);
  const colours = Array.from(
    new Map(product.variants.map((v) => [v.color, v.colorHex] as const)).entries(),
  );
  const second = product.media[1] ?? product.media[0];

  return (
    <article
      className="group/card relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
    >
      <Link href={`/shop/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand/30">
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {product.badges.slice(0, 1).map((b) => (
                <Badge key={b} tone={b}>
                  {b === "low-stock" ? "Low stock" : b === "last-chance" ? "Last chance" : b}
                </Badge>
              ))}
            </div>
          )}

          {/* Hero image */}
          <Image
            src={product.media[0].url}
            alt={product.media[0].altText}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-700 ease-[var(--ease-lux)]"
            style={{ opacity: hovered ? 0 : 1 }}
          />
          {/* Second image */}
          <Image
            src={second.url}
            alt={second.altText}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-700 ease-[var(--ease-lux)]"
            style={{ opacity: hovered ? 1 : 0 }}
            aria-hidden={!hovered}
          />

          {/* Like (wishlist) affordance — always tappable, gentle when idle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleLike(product);
            }}
            aria-label={liked ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            aria-pressed={liked}
            className={`absolute left-3 top-3 z-10 grid place-items-center size-10 rounded-full bg-paper/90 backdrop-blur-sm transition-[opacity,color] duration-[var(--dur-base)] ease-[var(--ease-lux)] ${liked ? "text-cobalt opacity-100" : hovered ? "text-navy opacity-100" : "text-navy opacity-0 pointer-events-none"}`}
          >
            <Heart
              className="size-4"
              strokeWidth={1.4}
              fill={liked ? "currentColor" : "none"}
            />
          </button>

          {/* Quick-view affordance */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              aria-label={`Quick view ${product.title}`}
              className={`absolute right-3 top-3 z-10 grid place-items-center size-10 rounded-full bg-paper/90 text-navy backdrop-blur-sm transition-opacity duration-[var(--dur-base)] ease-[var(--ease-lux)] ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <Eye className="size-4" strokeWidth={1.4} />
            </button>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href={`/shop/${product.handle}`}
            className="font-display text-lg leading-tight hover:text-cobalt"
          >
            {product.title}
          </Link>
          <Price value={product.priceRange.min} />
        </div>

        {colours.length > 1 && (
          <div
            className={`flex items-center gap-2 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-lux)] ${hovered ? "opacity-100" : "opacity-60"}`}
          >
            {colours.map(([name, hex]) => (
              <Swatch key={name} hex={hex} label={name} size="sm" />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
