"use client";
/**
 * Wishlist store — saved products ("liked") persisted to localStorage.
 *
 * Mirrors the cart store shape so a future server-side wishlist (Shopify
 * customer account, account-bound wishlist API) can swap in behind the same
 * client API.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Image, Money, Product } from "@/lib/shopify/types";

export type WishlistItem = {
  id: string;            // product id
  handle: string;        // product handle
  title: string;
  image: Image;          // hero image snapshot
  price: Money;          // priceRange.min snapshot
  addedAt: number;
};

interface WishlistStore {
  items: WishlistItem[];
  has: (productId: string) => boolean;
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  clear: () => void;
  count: () => number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      has: (productId) => get().items.some((i) => i.id === productId),

      add: (product) => {
        if (get().items.some((i) => i.id === product.id)) return;
        const item: WishlistItem = {
          id: product.id,
          handle: product.handle,
          title: product.title,
          image: product.media[0],
          price: product.priceRange.min,
          addedAt: Date.now(),
        };
        set({ items: [item, ...get().items] });
      },

      remove: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      toggle: (product) => {
        if (get().items.some((i) => i.id === product.id)) {
          get().remove(product.id);
        } else {
          get().add(product);
        }
      },

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: "ui-wishlist-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
