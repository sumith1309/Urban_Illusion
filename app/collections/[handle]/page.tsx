import { notFound } from "next/navigation";
import { getAllCollections, getCollection } from "@/lib/shopify";
import { PLPGrid } from "@/components/commerce/PLPGrid";

export async function generateStaticParams() {
  const cols = await getAllCollections();
  return cols.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const data = await getCollection(handle);
  return {
    title: data?.collection.title ?? "Collection",
    description: data?.collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const data = await getCollection(handle);
  if (!data) notFound();

  return (
    <main className="pt-24 lg:pt-28 bg-paper">
      <section className="section-pad pt-12 lg:pt-16 pb-0 container-lux">
        <p className="eyebrow">Edit · {data.products.length} pieces</p>
        <h1 className="mt-3 max-w-[20ch]">{data.collection.title}</h1>
        <p className="text-lead mt-6 max-w-[60ch] text-ink-soft">
          {data.collection.description}
        </p>
      </section>

      <PLPGrid products={data.products} />
    </main>
  );
}
