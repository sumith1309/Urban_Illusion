"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";
import { X, Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { cn } from "@/lib/utils";

/* Slide-in wishlist drawer (right). Mirrors CartDrawer for visual continuity.
   Liked items are snapshots — clicking a row deep-links to the PDP where the
   live variant + add-to-cart lives. */
export function WishlistDrawer() {
  const open = useUI((s) => s.wishlistOpen);
  const closeWishlist = useUI((s) => s.closeWishlist);
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const clear = useWishlist((s) => s.clear);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => (o ? null : closeWishlist())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] z-[var(--z-overlay)] data-[state=open]:animate-[fadeIn_var(--dur-base)_var(--ease-lux)]" />
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 h-dvh w-full sm:w-[28rem] max-w-full bg-paper text-ink z-[var(--z-modal)]",
            "shadow-[var(--shadow-float)] flex flex-col",
            "data-[state=open]:animate-[slideInRight_var(--dur-base)_var(--ease-lux)]",
            "data-[state=closed]:animate-[slideOutRight_var(--dur-fast)_var(--ease-lux)]",
          )}
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <Dialog.Title>Wishlist</Dialog.Title>
          </VisuallyHidden>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-ink/8">
            <p className="eyebrow">The liked · {items.length}</p>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close wishlist"
                className="size-9 grid place-items-center text-ink/60 hover:text-ink"
              >
                <X className="size-4" strokeWidth={1.4} />
              </button>
            </Dialog.Close>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto size-12 rounded-full border border-ink/15 grid place-items-center mb-5 text-ink/40">
                  <Heart className="size-5" strokeWidth={1.4} />
                </div>
                <p className="font-display text-2xl">Nothing kept yet.</p>
                <p className="text-ink-soft mt-2 text-sm">
                  Tap the heart on any piece to save it for later.
                </p>
                <Dialog.Close asChild>
                  <Button href="/shop" variant="navy" iconArrow className="mt-6">
                    Browse the shop
                  </Button>
                </Dialog.Close>
              </div>
            ) : (
              <ul className="divide-y divide-ink/8">
                {items.map((item) => (
                  <li key={item.id} className="py-5 flex gap-4">
                    <Dialog.Close asChild>
                      <Link
                        href={`/shop/${item.handle}`}
                        className="relative size-20 shrink-0 bg-sand/30 rounded-sm overflow-hidden"
                      >
                        <Image
                          src={item.image.url}
                          alt={item.image.altText}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                    </Dialog.Close>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Dialog.Close asChild>
                          <Link
                            href={`/shop/${item.handle}`}
                            className="font-display text-lg leading-tight hover:text-cobalt"
                          >
                            {item.title}
                          </Link>
                        </Dialog.Close>
                        <Price value={item.price} className="shrink-0" />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Dialog.Close asChild>
                          <Link
                            href={`/shop/${item.handle}`}
                            className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 hover:text-ink underline underline-offset-4 decoration-ink/20"
                          >
                            View piece
                          </Link>
                        </Dialog.Close>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40 hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-ink/8 px-6 pt-5 pb-6 space-y-3 bg-paper">
              <Dialog.Close asChild>
                <Button href="/shop" variant="navy" iconArrow className="w-full justify-between">
                  Continue browsing
                </Button>
              </Dialog.Close>
              <button
                type="button"
                onClick={clear}
                className="w-full text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40 hover:text-ink py-2"
              >
                Clear wishlist
              </button>
            </div>
          )}

          <style>{`
            @keyframes slideInRight  { from { transform: translateX(100%); } to { transform: none; } }
            @keyframes slideOutRight { from { transform: none; } to { transform: translateX(100%); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
