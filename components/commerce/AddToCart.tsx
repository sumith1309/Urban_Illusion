"use client";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { track } from "@/lib/analytics";
import type { Product, Variant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/* Add-to-Cart with GSAP FLIP flight from the button origin into the cart icon.
   GSAP imports are dynamic so the chunk only loads on first interaction. */

export function AddToCart({
  product,
  variant,
  className,
  size = "md",
}: {
  product: Product;
  variant: Variant;
  className?: string;
  size?: "md" | "lg";
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pending, start] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  const onAdd = () => {
    if (pending) return;
    start(async () => {
      // 1) Fire the FLIP flight first so it overlaps the state update
      try {
        await flyToCart(btnRef.current, product.media[0]?.url);
      } catch {
        /* non-fatal — reduce motion or no GSAP, just skip */
      }
      // 2) Mutate cart
      add({ product, variant, quantity: 1 });
      track({
        name: "add_to_cart",
        productHandle: product.handle,
        variantId: variant.id,
        quantity: 1,
        value: Number(variant.price.amount),
      });
      // 3) Open drawer + visual pulse
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1200);
      openCart();
    });
  };

  return (
    <Button
      ref={btnRef}
      onClick={onAdd}
      disabled={pending || !variant.available}
      variant="navy"
      size={size}
      iconArrow
      className={cn("group/btn", justAdded && "ring-2 ring-cobalt ring-offset-2 ring-offset-paper", className)}
    >
      {!variant.available
        ? "Sold out"
        : pending
          ? "Adding…"
          : justAdded
            ? "Added ✓"
            : "Add to bag"}
    </Button>
  );
}

/* Animates a small clone of the product image from the button origin into
   the cart icon target (id="cart-icon-target" in the Header). GSAP Flip
   loaded dynamically so the chunk is on-demand, not on first paint. */
async function flyToCart(originEl: HTMLElement | null, imageUrl?: string) {
  if (!originEl || !imageUrl) return;
  const target = document.getElementById("cart-icon-target");
  if (!target) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const [{ gsap }] = await Promise.all([import("gsap")]);

  const start = originEl.getBoundingClientRect();
  const end = target.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.src = imageUrl;
  flyer.alt = "";
  flyer.setAttribute("aria-hidden", "true");
  Object.assign(flyer.style, {
    position: "fixed",
    left: `${start.left + start.width / 2 - 24}px`,
    top: `${start.top + start.height / 2 - 24}px`,
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "999px",
    boxShadow: "0 12px 24px -10px rgba(11,27,63,0.35)",
    pointerEvents: "none",
    zIndex: "70",
    willChange: "transform, opacity",
  });
  document.body.appendChild(flyer);

  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);

  await gsap.to(flyer, {
    x: dx,
    y: dy,
    scale: 0.25,
    opacity: 0.2,
    duration: 0.7,
    ease: "power2.in",
    onComplete: () => flyer.remove(),
  });

  // Cart icon pulse
  gsap.fromTo(
    target,
    { scale: 1 },
    { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
  );
}
