"use client";
import { useEffect } from "react";
import { useCart } from "@/store/cart";

/* Hydrates the persisted zustand cart from localStorage AFTER mount.
   Renders nothing; mounted once at the root to avoid SSR-mismatch on first paint. */
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
