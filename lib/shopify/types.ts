/**
 * Shopify Storefront API — type contracts.
 *
 * Mirror the shape we'd receive from a real Storefront GraphQL response
 * (Hydrogen utilities). Swapping to live data later becomes a one-line change
 * in the adapter — every consumer already speaks this shape.
 */

export type Money = { amount: string; currencyCode: "INR" | "USD" | "EUR" | "GBP" };

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Variant = {
  id: string;
  title: string;        // e.g. "M / Cream"
  size: string;         // XS, S, M, L, XL, XXL, ONE
  color: string;        // human-readable, e.g. "Cream", "Navy"
  colorHex: string;     // for swatch rendering
  sku: string;
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
  inventoryQty: number;
  image?: Image;
};

export type ProductMetafields = {
  story: string;        // editorial blurb
  materials: string[];  // e.g. ["100% organic cotton", "240gsm"]
  care: string[];       // e.g. ["Cold wash", "Tumble dry low"]
  fit: string;          // e.g. "Oversized, drop shoulder"
  origin?: string;      // e.g. "Made in India"
};

export type Product = {
  id: string;
  handle: string;       // url slug
  title: string;
  description: string;
  status: "active" | "draft";
  tags: string[];       // include category tags: tee, shirt, outerwear, bottoms, accessory
  collections: string[];
  badges: ("new" | "low-stock" | "last-chance" | "drop")[];
  media: Image[];       // hero gallery, ordered
  variants: Variant[];
  priceRange: { min: Money; max: Money };
  metafields: ProductMetafields;
  seo: { title: string; description: string };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  heroMedia?: Image;
  productHandles: string[];
};

export type CartLine = {
  id: string;
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  image?: Image;
  unitPrice: Money;
  quantity: number;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  subtotal: Money;
  total: Money;
  estimatedShipping: Money;
  freeShippingThreshold: Money;
  checkoutUrl: string;
};
