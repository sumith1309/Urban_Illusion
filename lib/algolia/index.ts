/**
 * Algolia search adapter — STUBBED for Phase 0.
 *
 * Performs naive substring matching on the seeded catalog. Replace with the
 * Algolia InstantSearch client when an Algolia app + index are provisioned.
 */

import { PRODUCTS } from "@/content/catalog";
import type { Product } from "@/lib/shopify/types";

export type SearchHit = {
  productHandle: string;
  title: string;
  image?: string;
  price: string;
};

export async function search(query: string, limit = 8): Promise<SearchHit[]> {
  if (!query.trim()) return trending(limit);
  const q = query.toLowerCase();
  return PRODUCTS.filter((p) =>
    [p.title, p.description, ...p.tags].some((s) => s.toLowerCase().includes(q)),
  )
    .slice(0, limit)
    .map(toHit);
}

export async function trending(limit = 6): Promise<SearchHit[]> {
  return PRODUCTS.filter((p) => p.collections.includes("best-sellers") || p.badges.includes("new"))
    .slice(0, limit)
    .map(toHit);
}

const toHit = (p: Product): SearchHit => ({
  productHandle: p.handle,
  title: p.title,
  image: p.media[0]?.url,
  price: `₹${Number(p.priceRange.min.amount).toLocaleString("en-IN")}`,
});
