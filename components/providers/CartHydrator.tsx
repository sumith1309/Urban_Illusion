"use client";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";

/* Hydrates persisted zustand stores from localStorage AFTER mount.
   Renders nothing; mounted once at the root to avoid SSR-mismatch on first paint.

   Also handles the ?wishlist=open / ?cart=open query params that the /wishlist
   route redirect (and any external links) use to open the relevant drawer on
   landing. URL is cleaned up after we read it so refreshing doesn't reopen. */
export function CartHydrator() {
  const openCart = useUI((s) => s.openCart);
  const openWishlist = useUI((s) => s.openWishlist);

  useEffect(() => {
    useCart.persist.rehydrate();
    useWishlist.persist.rehydrate();

    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const open = params.get("wishlist") === "open" ? "wishlist"
               : params.get("cart") === "open"     ? "cart"
               : null;
    if (!open) return;

    // Defer one frame so the drawer mount has settled.
    requestAnimationFrame(() => {
      if (open === "wishlist") openWishlist();
      else                      openCart();
      // Strip the query so a refresh doesn't reopen.
      params.delete("wishlist");
      params.delete("cart");
      const url = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.history.replaceState({}, "", url);
    });
  }, [openCart, openWishlist]);

  return null;
}
