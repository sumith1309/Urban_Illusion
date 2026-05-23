"use client";
import { useCart } from "@/store/cart";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export default function CheckoutHandoffPage() {
  const cart = useCart((s) => s.cart);

  return (
    <main className="min-h-dvh bg-paper pt-24 lg:pt-28">
      <div className="container-lux px-4 lg:px-8 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 section-pad">
        {/* Left: handoff explanation */}
        <div className="max-w-[44ch]">
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95]">
            Almost yours.
          </h1>
          <p className="text-lead mt-6 text-ink-soft">
            In production this hands off to the PCI-compliant payment provider
            (Shopify Checkout / Stripe). Cards, UPI, Apple Pay, Google Pay, and
            Shop Pay are surfaced server-side — no card data ever touches this
            app.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink-soft">
            <Lock className="size-3.5" strokeWidth={1.6} />
            <span>Secure tokenised handoff</span>
          </div>

          <div className="mt-12 space-y-3">
            <Button
              variant="navy"
              size="lg"
              iconArrow
              className="w-full justify-between"
              disabled
            >
              Complete checkout (stub)
            </Button>
            <Button href="/shop" variant="ghost" className="block text-center">
              Keep browsing
            </Button>
          </div>
        </div>

        {/* Right: order summary */}
        <aside className="bg-sand/40 border border-ink/8 rounded-lg p-6 lg:p-8 h-fit">
          <p className="eyebrow mb-4">Order summary</p>
          {cart.lines.length === 0 ? (
            <p className="text-ink-soft">Your bag is empty.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {cart.lines.map((l) => (
                <li key={l.id} className="py-3 flex justify-between gap-4">
                  <div>
                    <p className="font-display text-lg leading-tight">{l.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft mt-0.5">
                      {l.variantTitle} · ×{l.quantity}
                    </p>
                  </div>
                  <Price value={l.unitPrice} />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 pt-4 border-t border-ink/10 flex items-baseline justify-between">
            <span className="eyebrow">Subtotal</span>
            <Price value={cart.subtotal} className="text-base" />
          </div>
        </aside>
      </div>
    </main>
  );
}
