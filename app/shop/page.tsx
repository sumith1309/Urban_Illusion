import Link from "next/link";

export const metadata = { title: "Shop" };

export default function ShopPlaceholder() {
  return (
    <main className="section-pad container-lux min-h-[100dvh] flex flex-col justify-center">
      <p className="eyebrow">Phase 1 · Coming next</p>
      <h1 className="mt-4 max-w-[16ch]">The full shop opens at Phase 1.</h1>
      <p className="text-lead mt-6 max-w-[60ch] text-ink-soft">
        Product listing, filters, quick-view, and cart drawer land in the next
        commit. For now, the foundation is set.
      </p>
      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-2 font-mono text-xs tracking-[0.24em] uppercase underline underline-offset-8"
      >
        ← Back home
      </Link>
    </main>
  );
}
