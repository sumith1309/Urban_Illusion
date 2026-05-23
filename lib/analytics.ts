/**
 * GA4 dataLayer wrapper. No-op until a GA4 measurement ID is configured.
 * Server-side tagging will arrive in Phase 4 — for now this is a typed
 * client-side stub so commerce components can fire events without breaking.
 */

type EcomEvent =
  | { name: "view_item"; productHandle: string }
  | { name: "add_to_cart"; productHandle: string; variantId: string; quantity: number; value: number }
  | { name: "begin_checkout"; value: number }
  | { name: "purchase"; orderId: string; value: number };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(ev: EcomEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: ev.name, ...ev });
}
