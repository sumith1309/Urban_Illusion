"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { formatPrice, cn } from "@/lib/utils";

/* Slide-in cart drawer (right) with:
   - free-shipping progress bar
   - line items with qty steppers
   - subtotal + express-pay placeholder + checkout CTA
   Radix Dialog gives us focus-trap, scroll-lock, escape-to-close, aria. */
export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const closeCart = useUI((s) => s.closeCart);
  const cart = useCart((s) => s.cart);
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);

  const sub = Number(cart.subtotal.amount);
  const threshold = Number(cart.freeShippingThreshold.amount);
  const pct = Math.min(100, Math.round((sub / threshold) * 100));
  const remaining = Math.max(0, threshold - sub);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => (o ? null : closeCart())}>
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
            <Dialog.Title>Cart</Dialog.Title>
          </VisuallyHidden>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-ink/8">
            <p className="eyebrow">Your bag · {cart.lines.length}</p>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close cart"
                className="size-9 grid place-items-center text-ink/60 hover:text-ink"
              >
                <X className="size-4" strokeWidth={1.4} />
              </button>
            </Dialog.Close>
          </div>

          {/* Free-shipping progress */}
          <div className="px-6 py-4 border-b border-ink/8">
            {remaining > 0 ? (
              <p className="text-xs text-ink-soft">
                Add{" "}
                <strong className="font-mono">
                  {formatPrice(remaining, "INR")}
                </strong>{" "}
                more for complimentary shipping.
              </p>
            ) : (
              <p className="text-xs text-cobalt font-mono uppercase tracking-[0.18em]">
                Complimentary shipping unlocked.
              </p>
            )}
            <div className="mt-3 h-[2px] w-full bg-ink/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cobalt transition-[width] duration-500 ease-[var(--ease-lux)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Lines */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {cart.lines.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-display text-2xl">Your bag is quiet.</p>
                <p className="text-ink-soft mt-2 text-sm">
                  The amulets are waiting in the shop.
                </p>
                <Dialog.Close asChild>
                  <Button href="/shop" variant="navy" iconArrow className="mt-6">
                    Enter the shop
                  </Button>
                </Dialog.Close>
              </div>
            ) : (
              <ul className="divide-y divide-ink/8">
                {cart.lines.map((line) => (
                  <li key={line.id} className="py-5 flex gap-4">
                    {line.image && (
                      <div className="relative size-20 shrink-0 bg-sand/30 rounded-sm overflow-hidden">
                        <Image
                          src={line.image.url}
                          alt={line.image.altText}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/shop/${line.productHandle}`}
                            className="font-display text-lg leading-tight hover:text-cobalt"
                          >
                            {line.title}
                          </Link>
                          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-soft mt-1">
                            {line.variantTitle}
                          </p>
                        </div>
                        <Price value={line.unitPrice} className="shrink-0" />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-ink/15 rounded-full">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => update(line.id, line.quantity - 1)}
                            className="size-8 grid place-items-center text-ink/60 hover:text-ink"
                          >
                            <Minus className="size-3.5" strokeWidth={1.6} />
                          </button>
                          <span className="font-mono text-xs w-7 text-center">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => update(line.id, line.quantity + 1)}
                            className="size-8 grid place-items-center text-ink/60 hover:text-ink"
                          >
                            <Plus className="size-3.5" strokeWidth={1.6} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
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
          {cart.lines.length > 0 && (
            <div className="border-t border-ink/8 px-6 pt-5 pb-6 space-y-4 bg-paper">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">Subtotal</p>
                <Price value={cart.subtotal} className="text-base text-ink" />
              </div>
              <p className="text-[11px] text-ink-soft">
                Taxes calculated at checkout. Shipping calculated by destination.
              </p>
              <Dialog.Close asChild>
                <Button href="/checkout" variant="navy" iconArrow className="w-full justify-between">
                  Checkout
                </Button>
              </Dialog.Close>
              <div className="flex items-center justify-center gap-3 pt-1">
                {(["Apple Pay", "Google Pay", "Shop Pay"] as const).map((label, i) => (
                  <span key={label} className="contents">
                    {i > 0 && <span className="text-ink/20">·</span>}
                    <Dialog.Close asChild>
                      <Link
                        href="/checkout"
                        aria-label={`Express checkout with ${label}`}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40 hover:text-ink"
                      >
                        {label}
                      </Link>
                    </Dialog.Close>
                  </span>
                ))}
              </div>
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
