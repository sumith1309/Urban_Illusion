import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { CartHydrator } from "@/components/providers/CartHydrator";

/* ─── Display serif (the wordmark / headlines) — SWAPPABLE ─────────────── */
/* One line to swap the display face once the type sign-off lands.
   Candidates considered:
     • Cormorant_Garamond  weight 500  — delicate Garamond, high contrast (current)
     • Cormorant_Garamond  weight 600  — same face, more presence at 16vw
     • Fraunces            weight 600  — optical-size axis, modern luxe maison

   Token flows through globals.css → every h1/h2/h3/.font-display.
   Change ONLY the function call below to swap; everything else stays. */
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],   // 500 today; 600 reserved for hero/wordmark via .font-display-bold
  display: "swap",
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
        <Header />
        <CartHydrator />
        <div className="flex-1">{children}</div>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
        {/* Grain overlay — fixed, pointer-events-none, multiply blend.
            Signature printed-paper texture without hurting perf. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
