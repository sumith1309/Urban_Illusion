"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useUI } from "@/store/ui";
import { search, trending, type SearchHit } from "@/lib/algolia";

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const closeSearch = useUI((s) => s.closeSearch);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!open) return;
    start(async () => setHits(await trending()));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      start(async () => setHits(await search(q)));
    }, 120);
    return () => window.clearTimeout(id);
  }, [q, open]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && closeSearch()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-paper/95 backdrop-blur-md data-[state=open]:animate-[fadeIn_var(--dur-base)_var(--ease-lux)]" />
        <Dialog.Content
          className="fixed inset-x-0 top-0 z-[var(--z-modal)] bg-paper data-[state=open]:animate-[slideDown_var(--dur-base)_var(--ease-lux)] focus:outline-none"
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <Dialog.Title>Search</Dialog.Title>
          </VisuallyHidden>
          <div className="container-lux px-4 lg:px-8 py-6">
            <div className="flex items-center gap-4 border-b border-ink/15 pb-4">
              <SearchIcon className="size-5 text-ink-soft shrink-0" strokeWidth={1.4} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the maison — tees, the eye, watercolour…"
                className="flex-1 bg-transparent outline-none font-display text-2xl lg:text-3xl placeholder:text-ink/30"
              />
              <Dialog.Close asChild>
                <button
                  aria-label="Close search"
                  className="size-9 grid place-items-center text-ink/60 hover:text-ink"
                >
                  <X className="size-4" strokeWidth={1.4} />
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-4">
                {q ? (pending ? "Searching…" : `Results · ${hits.length}`) : "Trending"}
              </p>
              {hits.length === 0 ? (
                <p className="text-ink-soft py-8 text-center">No matches yet.</p>
              ) : (
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 pb-12">
                  {hits.map((h) => (
                    <li key={h.productHandle}>
                      <Dialog.Close asChild>
                        <Link href={`/shop/${h.productHandle}`} className="group block">
                          <div className="relative aspect-[4/5] bg-sand/30 rounded-sm overflow-hidden">
                            {h.image && (
                              <Image
                                src={h.image}
                                alt={h.title}
                                fill
                                sizes="(max-width: 1024px) 50vw, 22vw"
                                className="object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                              />
                            )}
                          </div>
                          <div className="mt-3 flex justify-between gap-3">
                            <span className="font-display text-base leading-tight">{h.title}</span>
                            <span className="font-mono text-[11px] tracking-[0.18em]">{h.price}</span>
                          </div>
                        </Link>
                      </Dialog.Close>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <style>{`@keyframes slideDown { from { transform: translateY(-12px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
