import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { WishlistDrawer } from "@/components/commerce/WishlistDrawer";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { CartHydrator } from "@/components/providers/CartHydrator";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PageTransition } from "@/components/motion/PageTransition";
// Preloader intentionally NOT mounted: even as a pure-CSS hairline it kept
// Lighthouse's LCP measurement window open during its 1.1s animation, pushing
// DevTools LCP from 1.6s → 3.5s. Aesthetic gain wasn't worth the regression.
// The component still ships (components/scenes/Preloader.tsx) for future use
// when we can isolate it from the LCP measurement (e.g., second-visit only,
// gated on first interaction). Phase 5 may revisit.

/* ─── Display serif (the wordmark / headlines) — SWAPPABLE ─────────────── */
/* One line to swap the display face. Now Fraunces 600 (user prior, prefers
   the optical-size axis + more presence at 16vw vs Cormorant 500/600's
   hairlines). Revert to `Cormorant_Garamond({ weight: ["500","600"] })` if
   the visual review calls back.
   Token flows through globals.css → every h1/h2/h3/.font-display(-bold). */
/* Font-display strategy locked to protect LCP:
   - Geist (body / LCP element)   → swap, preloaded — must arrive early
   - Fraunces (display)            → optional — never re-paints LCP mid-load
   - Geist Mono (eyebrow)          → optional + no preload — never blocks CWV */
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  display: "optional",
  axes: ["opsz"],
  preload: false,
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

/* ─── Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://urbanillusion.example"),
  title: {
    default: "URBAN ILLUSION — Protection. Perception. Illusion.",
    template: "%s · URBAN ILLUSION",
  },
  description:
    "A jewelled evil-eye amulet rendered as ready-to-wear. The flagship Urban Illusion store: limited-run nazar collections, watercolour prints, and editorial drops.",
  openGraph: {
    title: "URBAN ILLUSION",
    description:
      "Protection. Perception. Illusion. — The flagship Urban Illusion store.",
    type: "website",
    siteName: "Urban Illusion",
    images: ["/brand/logo-master.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URBAN ILLUSION",
    description: "Protection. Perception. Illusion.",
    images: ["/brand/logo-master.png"],
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1B3F" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ─── Root layout ───────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh flex flex-col bg-paper text-ink">
        <ScrollProgress />
        <SmoothScrollProvider>
          <Header />
          <CartHydrator />
          <div className="flex-1">{children}</div>
          <Footer />
        </SmoothScrollProvider>
        <CartDrawer />
        <WishlistDrawer />
        <SearchOverlay />
        <MagneticCursor />
        <PageTransition />
        {/* Grain overlay — fixed, pointer-events-none, multiply blend.
            Signature printed-paper texture without hurting perf. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
