import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const COLS = [
  {
    title: "Shop",
    links: [
      { label: "New In", href: "/collections/new-in" },
      { label: "The Nazar Edit", href: "/collections/the-nazar-edit" },
      { label: "Outerwear", href: "/collections/outerwear" },
      { label: "Accessories", href: "/collections/accessories" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "The Eye", href: "/story" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Shipping & returns", href: "/support/shipping" },
      { label: "Size guide", href: "/support/size-guide" },
      { label: "Contact", href: "/support/contact" },
      { label: "FAQ", href: "/support/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-paper">
      {/* Newsletter strip */}
      <div className="border-b border-paper/10">
        <div className="container-lux section-pad lg:py-20 grid lg:grid-cols-2 gap-10 lg:items-end">
          <div className="max-w-[28ch]">
            <p className="eyebrow text-paper/60">The Nazar List</p>
            <p className="font-display text-5xl lg:text-6xl mt-4 leading-[0.95] text-paper">
              First look at the next drop.
            </p>
            <p className="mt-6 text-paper/70 max-w-[42ch]">
              Limited pieces only — sign up for early access before public release.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Link columns */}
      <div className="container-lux section-pad lg:!py-20 grid grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="col-span-2 lg:col-span-1">
          <p className="eyebrow text-paper/60">Urban Illusion</p>
          <p className="mt-4 font-display text-3xl text-paper">
            Protection.<br />Perception.<br />Illusion.
          </p>
          <p className="mt-6 text-paper/60 text-sm max-w-[28ch]">
            A jewelled amulet rendered as ready-to-wear. Hand-finished in small batches.
          </p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title}>
            <p className="eyebrow text-paper/60 mb-4">{c.title}</p>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-paper/80 hover:text-paper text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Brand stamp */}
      <div
        aria-hidden
        className="container-lux px-4 lg:px-8 overflow-hidden pb-2"
      >
        <p className="font-display-bold text-paper/8 text-[clamp(6rem,18vw,16rem)] leading-[0.85] tracking-[-0.04em] select-none">
          URBAN ILLUSION
        </p>
      </div>

      {/* Bottom row */}
      <div className="border-t border-paper/10">
        <div className="container-lux px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
          <p>© 2026 Urban Illusion. All rights reserved.</p>
          <p>Made with care · INR · Est. 2026</p>
        </div>
      </div>
    </footer>
  );
}
