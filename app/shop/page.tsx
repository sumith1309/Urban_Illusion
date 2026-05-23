import { getAllProducts } from "@/lib/shopify";
import { PLPGrid } from "@/components/commerce/PLPGrid";

export const metadata = { title: "Shop" };

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <main className="pt-24 lg:pt-28 bg-paper">
      {/* Editorial collection header */}
      <section className="section-pad pt-12 lg:pt-16 pb-0 container-lux">
        <p className="eyebrow">All pieces · {products.length}</p>
        <h1 className="mt-3 max-w-[20ch]">The shop.</h1>
        <p className="text-lead mt-6 max-w-[58ch] text-ink-soft">
          Limited drops, hand-finished. Every piece carries the eye — printed,
          embroidered, or rendered as the original amulet itself.
        </p>
      </section>

      <PLPGrid products={products} />
    </main>
  );
}
