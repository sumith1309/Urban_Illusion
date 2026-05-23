"use client";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { Price } from "@/components/ui/Price";
import { Swatch } from "@/components/ui/Swatch";
import { AddToCart } from "@/components/commerce/AddToCart";

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [colour, setColour] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(undefined);

  const colours = product
    ? Array.from(
        new Map(product.variants.map((v) => [v.color, v.colorHex])).entries(),
      )
    : [];
  const sizes = product ? Array.from(new Set(product.variants.map((v) => v.size))) : [];

  const selectedColour = colour ?? colours[0]?.[0];
  const selectedSize = size ?? sizes[0];
  const variant = product?.variants.find(
    (v) => v.color === selectedColour && v.size === selectedSize,
  );

  return (
    <Dialog.Root open={!!product} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-ink/40 backdrop-blur-[2px] data-[state=open]:animate-[fadeIn_var(--dur-base)_var(--ease-lux)]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[var(--z-modal)] -translate-x-1/2 -translate-y-1/2 w-[min(94vw,920px)] max-h-[88dvh] bg-paper rounded-lg shadow-[var(--shadow-float)] overflow-hidden flex flex-col lg:flex-row"
          aria-describedby={undefined}
        >
          {!product ? null : (
            <>
              <Dialog.Title className="sr-only">{product.title} — quick view</Dialog.Title>

              <div className="relative w-full lg:w-1/2 aspect-[4/5] bg-sand/30 shrink-0">
                <Image
                  src={product.media[0].url}
                  alt={product.media[0].altText}
                  fill
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 p-6 lg:p-8 flex flex-col gap-5 overflow-y-auto">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{product.tags[0]}</p>
                    <h2 className="font-display text-3xl mt-2 leading-[0.95]">
                      {product.title}
                    </h2>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close quick view"
                      className="size-9 grid place-items-center text-ink/60 hover:text-ink"
                    >
                      <X className="size-4" strokeWidth={1.4} />
                    </button>
                  </Dialog.Close>
                </div>

                <Price value={product.priceRange.min} className="text-base" />

                <p className="text-sm text-ink-soft leading-relaxed">
                  {product.description}
                </p>

                {colours.length > 1 && (
                  <div>
                    <p className="eyebrow mb-2">Colour · {selectedColour}</p>
                    <div className="flex gap-2">
                      {colours.map(([name, hex]) => (
                        <Swatch
                          key={name}
                          hex={hex}
                          label={name}
                          selected={selectedColour === name}
                          onSelect={() => setColour(name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {sizes.length > 1 && (
                  <div>
                    <p className="eyebrow mb-2">Size · {selectedSize}</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={selectedSize === s}
                          onClick={() => setSize(s)}
                          className={`min-w-11 h-10 px-3 rounded-full border font-mono text-[11px] uppercase tracking-[0.22em] ${selectedSize === s ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/40"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2 space-y-3">
                  {variant && (
                    <AddToCart product={product} variant={variant} className="w-full justify-between" />
                  )}
                  <Link
                    href={`/shop/${product.handle}`}
                    className="block text-center font-mono text-[11px] uppercase tracking-[0.24em] underline underline-offset-8 hover:text-cobalt"
                  >
                    Full details →
                  </Link>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
