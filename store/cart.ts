"use client";
/**
 * Cart store — client-side source of truth, persisted to localStorage.
 *
 * In Phase 1 the stub adapter is the only backend, so we don't round-trip
 * to a server for every mutation; we mutate locally and persist. When the
 * live Shopify Storefront adapter swaps in, the same store can call server
 * actions and reconcile — the API surface stays the same.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Cart, CartLine, Money, Product, Variant } from "@/lib/shopify/types";

type AddArgs = { product: Product; variant: Variant; quantity?: number };

interface CartStore {
  cart: Cart;
  add: (args: AddArgs) => void;
  update: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  itemCount: () => number;
}

const ZERO: Money = { amount: "0.00", currencyCode: "INR" };
const FREE_SHIP: Money = { amount: "5000.00", currencyCode: "INR" };

const emptyCart: Cart = {
  id: "cart-local",
  lines: [],
  subtotal: ZERO,
  total: ZERO,
  estimatedShipping: ZERO,
  freeShippingThreshold: FREE_SHIP,
  checkoutUrl: "/checkout",
};

const recompute = (lines: CartLine[]): Cart => {
  const sub = lines.reduce((sum, l) => sum + Number(l.unitPrice.amount) * l.quantity, 0);
  return {
    ...emptyCart,
    lines,
    subtotal: { amount: sub.toFixed(2), currencyCode: "INR" },
    total: { amount: sub.toFixed(2), currencyCode: "INR" },
  };
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: emptyCart,

      add: ({ product, variant, quantity = 1 }) => {
        const state = get().cart;
        const existing = state.lines.find((l) => l.variantId === variant.id);
        const lines = existing
          ? state.lines.map((l) =>
              l.variantId === variant.id ? { ...l, quantity: l.quantity + quantity } : l,
            )
          : [
              ...state.lines,
              {
                id: `line-${Date.now()}-${variant.id}`,
                variantId: variant.id,
                productHandle: product.handle,
                title: product.title,
                variantTitle: variant.title,
                image: product.media[0],
                unitPrice: variant.price,
                quantity,
              } satisfies CartLine,
            ];
        set({ cart: recompute(lines) });
      },

      update: (lineId, quantity) => {
        const lines = get()
          .cart.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l))
          .filter((l) => l.quantity > 0);
        set({ cart: recompute(lines) });
      },

      remove: (lineId) => {
        const lines = get().cart.lines.filter((l) => l.id !== lineId);
        set({ cart: recompute(lines) });
      },

      clear: () => set({ cart: emptyCart }),

      itemCount: () => get().cart.lines.reduce((n, l) => n + l.quantity, 0),
    }),
    {
      name: "ui-cart-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // hydrate manually in a provider to avoid SSR mismatch
    },
  ),
);
