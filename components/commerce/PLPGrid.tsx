"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { QuickView } from "@/components/commerce/QuickView";
import type { Product } from "@/lib/shopify/types";

type Sort = "featured" | "price-asc" | "price-desc" | "newest";

export function PLPGrid({ products }: { products: Product[] }) {
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [colours, setColours] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<Sort>("featured");
  const [quickView, setQuickView] = useState<Product | null>(null);

  const allSizes = useMemo(
    () =>
      Array.from(
        new Set(products.flatMap((p) => p.variants.map((v) => v.size))),
      ).sort(sizeOrder),
    [products],
  );
  const allColours = useMemo(
    () =>
      Array.from(
        new Map(
          products.flatMap((p) =>
            p.variants.map((v) => [v.color, v.colorHex] as const),
          ),
        ).entries(),
      ),
    [products],
  );

  const filtered = useMemo(() => {
    let out = products.filter((p) => {
      const sizeOk =
        sizes.size === 0 || p.variants.some((v) => sizes.has(v.size));
      const colourOk =
        colours.size === 0 || p.variants.some((v) => colours.has(v.color));
      return sizeOk && colourOk;
    });
    switch (sort) {
      case "price-asc":
        out = [...out].sort(
          (a, b) =>
            Number(a.priceRange.min.amount) - Number(b.priceRange.min.amount),
        );
        break;
      case "price-desc":
        out = [...out].sort(
          (a, b) =>
            Number(b.priceRange.min.amount) - Number(a.priceRange.min.amount),
        );
        break;
      case "newest":
        out = [...out].sort((a, b) =>
          a.badges.includes("new") === b.badges.includes("new")
            ? 0
            : a.badges.includes("new")
              ? -1
              : 1,
        );
        break;
    }
    return out;
  }, [products, sizes, colours, sort]);

  const toggle = (set: Set<string>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  return (
    <>
      {/* Filter bar */}
      <div className="container-lux px-4 lg:px-8 mt-10 mb-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-ink/10 pb-6">
        <FilterGroup label="Size">
          {allSizes.map((s) => (
            <FilterChip
              key={s}
              active={sizes.has(s)}
              onClick={() => setSizes((p) => toggle(p, s))}
            >
              {s}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label="Colour">
          {allColours.map(([name, hex]) => (
            <button
              key={name}
              type="button"
              onClick={() => setColours((p) => toggle(p, name))}
              aria-pressed={colours.has(name)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border text-[10px] font-mono uppercase tracking-[0.22em] ${colours.has(name) ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink hover:border-ink/40"}`}
            >
              <span
                className="inline-block size-3 rounded-full ring-1 ring-ink/10"
                style={{ background: hex }}
              />
              {name}
            </button>
          ))}
        </FilterGroup>

        <div className="ml-auto flex items-center gap-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            Sort
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-transparent border-b border-ink/30 font-mono text-[11px] uppercase tracking-[0.2em] py-1 pr-6 focus:outline-none focus:border-ink"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="container-lux px-4 lg:px-8">
        {filtered.length === 0 ? (
          <p className="py-24 text-center font-display text-2xl">
            No pieces match this filter — try fewer constraints.
          </p>
        ) : (
          <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14 pb-24">
            {filtered.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} onQuickView={setQuickView} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft mr-1">
        {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-w-9 px-2.5 h-7 rounded-full border text-[10px] font-mono uppercase tracking-[0.22em] ${active ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink hover:border-ink/40"}`}
    >
      {children}
    </button>
  );
}

const sizeOrder = (a: string, b: string) => {
  const order = ["XS", "S", "M", "L", "XL", "XXL", "ONE"];
  return order.indexOf(a) - order.indexOf(b);
};
