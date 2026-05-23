"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { IconButton } from "@/components/ui/IconButton";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

/* Top-stack: AnnouncementBar + Header inside one fixed wrapper at top:0.
   Header behaviour:
   - Transparent above the fold (over the cinematic hero)
   - Frosted glass + 1px hairline once scrolled past 24px
   - Hides on scroll-down, reveals on scroll-up (only past 240px) */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  const itemCount = useCart((s) => s.itemCount());
  const openSearch = useUI((s) => s.openSearch);
  const openCart = useUI((s) => s.openCart);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > 240) {
          setHidden(y > lastY);
        } else {
          setHidden(false);
        }
        setLastY(y);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-nav)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-lux)]",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
      data-scrolled={scrolled || undefined}
    >
      <AnnouncementBar />
      <header
        className={cn(
          "transition-colors duration-[var(--dur-base)] ease-[var(--ease-lux)]",
          scrolled
            ? "bg-paper/85 backdrop-blur-md border-b border-ink/8"
            : "bg-transparent",
        )}
      >
        <div className="container-lux flex items-center gap-4 px-4 lg:px-8 h-16">
          {/* Wordmark — links home */}
          <Link
            href="/"
            className="font-display-bold text-xl tracking-[-0.02em] text-navy mr-6 leading-none"
            aria-label="Urban Illusion — home"
          >
            URBAN
            <span className="ml-1 font-mono text-[9px] tracking-[0.32em] uppercase align-middle text-navy/80">
              Illusion
            </span>
          </Link>

          {/* MegaMenu (lg+); mobile gets a hamburger sheet in Phase 1b */}
          <div className="hidden lg:flex">
            <MegaMenu />
          </div>

          <div className="flex-1" />

          <IconButton srLabel="Search" onClick={openSearch}>
            <Search className="size-5" strokeWidth={1.4} />
          </IconButton>
          <IconButton srLabel="Account" className="hidden sm:inline-grid">
            <User className="size-5" strokeWidth={1.4} />
          </IconButton>
          <IconButton srLabel="Wishlist" className="hidden sm:inline-grid">
            <Heart className="size-5" strokeWidth={1.4} />
          </IconButton>
          <IconButton srLabel={`Cart (${itemCount})`} onClick={openCart} id="cart-icon-target">
            <ShoppingBag className="size-5" strokeWidth={1.4} />
            {itemCount > 0 && (
              <span
                className="absolute top-0 right-0 grid place-items-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-cobalt text-paper font-mono text-[10px] tracking-normal leading-none"
                aria-hidden
              >
                {itemCount}
              </span>
            )}
          </IconButton>
        </div>
      </header>
    </div>
  );
}
