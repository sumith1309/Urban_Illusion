"use client";
import { useMemo, useState } from "react";
import { Swatch } from "@/components/ui/Swatch";
import { AddToCart } from "@/components/commerce/AddToCart";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/lib/shopify/types";

/* PDP variant selector + AddToCart wired together.
   Pure client state (no router params) — variant selection is ephemeral. */

export function VariantSelector({ product }: { product: Product }) {
  const colours = useMemo(
    () => Array.from(new Map(product.variants.map((v) => [v.color, v.colorHex])).entries()),
    [product],
  );
  const allSizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size))),
    [product],
  );

  const [colour, setColour] = useState(colours[0]?.[0] ?? "");
  const [size, setSize] = useState(allSizes[0] ?? "");

  const variant =
    product.variants.find((v) => v.color === colour && v.size === size) ??
    product.variants[0];

  return (
    <div className="space-y-7">
      <div className="flex items-baseline justify-between">
        <Price value={variant.price} className="text-lg" />
        {variant.inventoryQty <= 3 && variant.available && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
            Only {variant.inventoryQty} left
          </span>
        )}
      </div>

      {colours.length > 1 && (
        <div>
          <p className="eyebrow mb-3">Colour · {colour}</p>
          <div className="flex gap-2">
            {colours.map(([name, hex]) => (
              <Swatch
                key={name}
                hex={hex}
                label={name}
                selected={colour === name}
                onSelect={() => setColour(name)}
              />
            ))}
          </div>
        </div>
      )}

      {allSizes.length > 1 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <p className="eyebrow">Size · {size}</p>
            <button
              type="button"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((s) => {
              const v = product.variants.find((x) => x.color === colour && x.size === s);
              const disabled = !v || !v.available;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 h-11 px-3 rounded-full border font-mono text-[11px] uppercase tracking-[0.22em] ${
                    size === s
                      ? "border-ink bg-ink text-paper"
                      : disabled
                        ? "border-ink/10 text-ink/30 line-through"
                        : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AddToCart product={product} variant={variant} size="lg" className="w-full justify-between" />
    </div>
  );
}
