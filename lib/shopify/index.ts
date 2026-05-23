/**
 * Shopify Storefront adapter — STUBBED for Phase 0.
 *
 * Returns seeded catalog data from /content/catalog.ts behind the EXACT shape
 * we'd receive from the real Storefront API. When the client provides their
 * Storefront token, swap the function bodies for live GraphQL calls — every
 * consumer already speaks this shape, no downstream changes required.
 *
 * Mode is gated by env: NEXT_PUBLIC_DATA_MODE=stub (default) | live.
 */

import { PRODUCTS, COLLECTIONS, PRODUCT_BY_HANDLE, COLLECTION_BY_HANDLE } from "@/content/catalog";
import type { Cart, CartLine, Collection, Product } from "./types";

export const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE ?? "stub";

/* ─── Read paths ────────────────────────────────────────────────────────── */

export async function getAllProducts(): Promise<Product[]> {
  if (DATA_MODE === "live") throw new Error("Live Shopify not wired yet.");
  return PRODUCTS;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (DATA_MODE === "live") throw new Error("Live Shopify not wired yet.");
  return PRODUCT_BY_HANDLE[handle] ?? null;
}

export async function getCollection(handle: string): Promise<{
  collection: Collection;
  products: Product[];
} | null> {
  if (DATA_MODE === "live") throw new Error("Live Shopify not wired yet.");
  const collection = COLLECTION_BY_HANDLE[handle];
  if (!collection) return null;
  const products = collection.productHandles
    .map((h) => PRODUCT_BY_HANDLE[h])
    .filter(Boolean);
  return { collection, products };
}

export async function getAllCollections(): Promise<Collection[]> {
  if (DATA_MODE === "live") throw new Error("Live Shopify not wired yet.");
  return COLLECTIONS;
}

/* ─── Cart paths (in-memory stub for Phase 0; Phase 1 wires zustand) ────── */

let _cart: Cart = {
  id: "cart-stub",
  lines: [],
  subtotal: { amount: "0.00", currencyCode: "INR" },
  total: { amount: "0.00", currencyCode: "INR" },
  estimatedShipping: { amount: "0.00", currencyCode: "INR" },
  freeShippingThreshold: { amount: "5000.00", currencyCode: "INR" },
  checkoutUrl: "/checkout",
};

const recompute = (c: Cart): Cart => {
  const subtotal = c.lines.reduce(
    (sum, l) => sum + Number(l.unitPrice.amount) * l.quantity,
    0,
  );
  return {
    ...c,
    subtotal: { amount: subtotal.toFixed(2), currencyCode: "INR" },
    total: { amount: subtotal.toFixed(2), currencyCode: "INR" },
  };
};

export async function getCart(): Promise<Cart> {
  return _cart;
}

export async function addToCart(input: {
  productHandle: string;
  variantId: string;
  quantity: number;
}): Promise<Cart> {
  const product = PRODUCT_BY_HANDLE[input.productHandle];
  if (!product) throw new Error(`Unknown product: ${input.productHandle}`);
  const variant = product.variants.find((v) => v.id === input.variantId);
  if (!variant) throw new Error(`Unknown variant: ${input.variantId}`);

  const existing = _cart.lines.find((l) => l.variantId === variant.id);
  let lines: CartLine[];
  if (existing) {
    lines = _cart.lines.map((l) =>
      l.variantId === variant.id ? { ...l, quantity: l.quantity + input.quantity } : l,
    );
  } else {
    lines = [
      ..._cart.lines,
      {
        id: `line-${Date.now()}-${variant.id}`,
        variantId: variant.id,
        productHandle: product.handle,
        title: product.title,
        variantTitle: variant.title,
        image: product.media[0],
        unitPrice: variant.price,
        quantity: input.quantity,
      },
    ];
  }
  _cart = recompute({ ..._cart, lines });
  return _cart;
}

export async function updateCartLine(lineId: string, quantity: number): Promise<Cart> {
  const lines = _cart.lines
    .map((l) => (l.id === lineId ? { ...l, quantity } : l))
    .filter((l) => l.quantity > 0);
  _cart = recompute({ ..._cart, lines });
  return _cart;
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  const lines = _cart.lines.filter((l) => l.id !== lineId);
  _cart = recompute({ ..._cart, lines });
  return _cart;
}

export * from "./types";
