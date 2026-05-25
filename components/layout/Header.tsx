"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
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
  const wishlistCount = useWishlist((s) => s.items.length);
  const openSearch = useUI((s) => s.openSearch);
  const openCart = useUI((s) => s.openCart);
  const openWishlist = useUI((s) => s.openWishlist);

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
        <div className="container-lux flex items-center gap-4 px-4 lg:px-8 h-20 lg:h-24">
          {/* Brand lockup — customer master mark + wordmark, links home */}
          <Link
            href="/"
            className="group flex items-center gap-3 mr-6"
            aria-label="Urban Illusion — home"
          >
            <Image
              src="/brand/eye-disc@2x.png"
              alt=""
              width={378}
              height={378}
              sizes="(max-width: 640px) 44px, 56px"
              priority
              className="size-11 sm:size-14 shrink-0 object-contain select-none transition-transform duration-[var(--dur-base)] ease-[var(--ease-lux)] group-hover:rotate-[6deg] drop-shadow-[0_2px_6px_rgba(11,27,63,0.18)]"
            />
            <div className="leading-[0.95] text-navy">
              <span className="block font-display-bold text-2xl sm:text-[1.7rem] tracking-[-0.02em]">
                URBAN
              </span>
              <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-navy/85 mt-1">
                Illusion
              </span>
            </div>
          </Link>

          {/* MegaMenu (lg+); mobile gets a hamburger sheet in Phase 1b */}
          <div className="hidden lg:flex">
            <MegaMenu />
          </div>

          <div className="flex-1" />

          <IconButton srLabel="Search" onClick={openSearch}>
            <Search className="size-5" strokeWidth={1.4} />
          </IconButton>
          <Link
            href="/account"
            aria-label="Account"
            className="relative hidden sm:inline-grid place-items-center size-11 rounded-full text-current hover:text-cobalt transition-colors"
          >
            <User className="size-5" strokeWidth={1.4} />
          </Link>
          <IconButton
            srLabel={`Wishlist (${wishlistCount})`}
            onClick={openWishlist}
            className="hidden sm:inline-grid"
          >
            <Heart
              className="size-5"
              strokeWidth={1.4}
              fill={wishlistCount > 0 ? "currentColor" : "none"}
            />
            {wishlistCount > 0 && (
              <span
                className="absolute top-0 right-0 grid place-items-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-cobalt text-paper font-mono text-[10px] tracking-normal leading-none"
                aria-hidden
              >
                {wishlistCount}
              </span>
            )}
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
