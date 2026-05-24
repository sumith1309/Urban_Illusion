"use client";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

/* Hydrates persisted zustand stores from localStorage AFTER mount.
   Renders nothing; mounted once at the root to avoid SSR-mismatch on first paint. */
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useWishlist.persist.rehydrate();
  }, []);
  return null;
}
