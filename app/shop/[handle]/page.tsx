import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProductByHandle } from "@/lib/shopify";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { VariantSelector } from "@/components/commerce/VariantSelector";
import { ProductCard } from "@/components/commerce/ProductCard";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  return {
    title: product?.seo.title ?? product?.title ?? "Product",
    description: product?.seo.description,
  };
}

export default async function PDP({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const all = await getAllProducts();
  const completeTheLook = all
    .filter((p) => p.handle !== product.handle && p.tags.some((t) => product.tags.includes(t)))
    .slice(0, 3);

  return (
    <main className="pt-24 lg:pt-28 bg-paper">
      {/* Breadcrumb */}
      <div className="container-lux px-4 lg:px-8 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2 text-ink/30">/</span>
          <span className="text-ink">{product.title}</span>
        </p>
      </div>

      {/* Main split — gallery + buy column */}
      <section className="container-lux px-4 lg:px-8 mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 pb-20">
        <ProductGallery media={product.media} alt={product.title} />

        <div className="flex flex-col gap-8 lg:py-6">
          <header>
            <p className="eyebrow">{product.tags.find((t) => t !== "nazar") ?? "Piece"}</p>
            <h1 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95] tracking-[-0.02em]">
              {product.title}
            </h1>
            <p className="mt-5 text-ink-soft max-w-[50ch] leading-relaxed">
              {product.description}
            </p>
          </header>

          <VariantSelector product={product} />

          {/* Materials / Fit / Care */}
          <dl className="grid grid-cols-2 gap-y-4 gap-x-6 pt-6 border-t border-ink/10 text-sm">
            <div>
              <dt className="eyebrow mb-1.5">Fit</dt>
              <dd className="text-ink-soft">{product.metafields.fit}</dd>
            </div>
            {product.metafields.origin && (
              <div>
                <dt className="eyebrow mb-1.5">Origin</dt>
                <dd className="text-ink-soft">{product.metafields.origin}</dd>
              </div>
            )}
            <div className="col-span-2">
              <dt className="eyebrow mb-1.5">Materials</dt>
              <dd className="text-ink-soft">{product.metafields.materials.join(" · ")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow mb-1.5">Care</dt>
              <dd className="text-ink-soft">{product.metafields.care.join(" · ")}</dd>
            </div>
          </dl>

          {/* Trust strip */}
          <ul className="grid grid-cols-2 gap-2 pt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-soft">
            <li className="border border-ink/10 rounded-full px-3 py-2 text-center">Free returns 30d</li>
            <li className="border border-ink/10 rounded-full px-3 py-2 text-center">Free shipping ₹5,000+</li>
          </ul>
        </div>
      </section>

      {/* Product story */}
      <section className="bg-sand/40 border-y border-ink/8">
        <div className="container-lux px-4 lg:px-8 section-pad grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16">
          <p className="eyebrow">The Story</p>
          <p className="font-display text-3xl lg:text-4xl leading-snug max-w-[40ch]">
            {product.metafields.story}
          </p>
        </div>
      </section>

      {/* Complete the look */}
      {completeTheLook.length > 0 && (
        <section className="container-lux px-4 lg:px-8 section-pad">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="eyebrow">Complete the look</p>
              <h2 className="font-display text-3xl mt-2">Pairs we suggest.</h2>
            </div>
            <Link
              href="/shop"
              className="font-mono text-[11px] uppercase tracking-[0.24em] underline underline-offset-8 hover:text-cobalt"
            >
              See more →
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {completeTheLook.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
