"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { COLLECTIONS, PRODUCT_BY_HANDLE } from "@/content/catalog";
import { cn } from "@/lib/utils";

/* Mega-menu — full-width image-led panels. Built on Radix NavigationMenu for
   focus-trap, keyboard arrow nav, and ESC dismiss out of the box.

   Audit fix (2026-05-25): Radix doesn't close the panel on scroll, so it was
   left floating over the scrollytelling section as users scrolled the home
   page (BLOCKER B2). We control NavigationMenu.Root's `value` and clear it
   on any meaningful scroll movement. */

const TOP_LEVEL = [
  { label: "New In",         collection: "new-in" },
  { label: "The Edit",       collection: "the-nazar-edit" },
  { label: "Outerwear",      collection: "outerwear" },
  { label: "Bottoms",        collection: "bottoms" },
  { label: "Accessories",    collection: "accessories" },
];

export function MegaMenu() {
  const [openItem, setOpenItem] = useState<string>("");
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    // 240ms grace gives the user time to move from trigger → panel without
    // a flicker, but a deliberate cursor-elsewhere closes the panel.
    closeTimer.current = window.setTimeout(() => setOpenItem(""), 240);
  };

  // Close the panel on scroll. We compare absolute movement against a small
  // threshold so a 1-2px nudge from the user shifting their cursor on a track-
  // pad doesn't trigger a dismiss.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 24) {
        clearCloseTimer();
        setOpenItem("");
      }
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearCloseTimer();
    };
  }, []);

  return (
    <NavigationMenu.Root
      className="relative"
      delayDuration={120}
      value={openItem}
      onValueChange={setOpenItem}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      <NavigationMenu.List className="flex items-center gap-1">
        {TOP_LEVEL.map((item) => {
          const collection = COLLECTIONS.find((c) => c.handle === item.collection);
          const handles = collection?.productHandles ?? [];
          const previews = handles
            .slice(0, 3)
            .map((h) => PRODUCT_BY_HANDLE[h])
            .filter(Boolean);

          return (
            <NavigationMenu.Item key={item.label} value={item.label}>
              <NavigationMenu.Trigger
                className={cn(
                  "px-3 h-10 inline-flex items-center font-mono text-[11px] tracking-[0.24em] uppercase text-ink",
                  "data-[state=open]:text-cobalt focus:outline-none focus-visible:ring-1 focus-visible:ring-cobalt rounded-sm",
                )}
              >
                {item.label}
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute left-0 top-full mt-2 w-screen max-w-[min(100vw,1100px)] data-[motion=from-start]:animate-in data-[motion=to-start]:animate-out">
                <div className="bg-paper/95 backdrop-blur-xl border border-ink/8 rounded-lg shadow-[var(--shadow-float)] p-6">
                  {previews.length > 0 ? (
                    <div className="grid grid-cols-[1fr_2fr] gap-8">
                      <div>
                        <p className="eyebrow mb-3">{collection?.title}</p>
                        <p className="font-display text-2xl leading-tight max-w-[20ch]">
                          {collection?.description}
                        </p>
                        <Link
                          href={`/collections/${collection?.handle}`}
                          className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.24em] underline underline-offset-8 hover:text-cobalt"
                        >
                          Shop the edit →
                        </Link>
                      </div>
                      <ul className="grid grid-cols-3 gap-4">
                        {previews.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/shop/${p.handle}`}
                              className="group block"
                            >
                              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand/40">
                                <Image
                                  src={p.media[0].url}
                                  alt={p.media[0].altText}
                                  fill
                                  sizes="200px"
                                  className="object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                                />
                              </div>
                              <p className="mt-2 text-sm font-display leading-tight">
                                {p.title}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <NextDropPanel label={item.label} />
                  )}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}

        <NavigationMenu.Item>
          <Link
            href="/story"
            className="px-3 h-10 inline-flex items-center font-mono text-[11px] tracking-[0.24em] uppercase text-ink hover:text-cobalt"
          >
            The Eye
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div className="absolute left-0 top-full mt-2 perspective-[2000px] w-full">
        <NavigationMenu.Viewport className="origin-top w-full" />
      </div>
    </NavigationMenu.Root>
  );
}

function NextDropPanel({ label }: { label: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="eyebrow mb-3">{label}</p>
      <p className="font-display text-2xl mb-4">Next drop in the works.</p>
      <p className="text-ink-soft max-w-[44ch] mx-auto">
        Be the first to know — drop list opens at the bottom of the page.
      </p>
    </div>
  );
}
