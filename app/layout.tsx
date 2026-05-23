import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/* ─── Fonts ─────────────────────────────────────────────────────────────── */
/* All SIL OFL / free for commercial use. Loaded via next/font/google with
   automatic CLS-safe size-adjust metrics override. No paid font files in repo. */

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  // Single weight = single woff2 = ~30KB instead of 4× that. Phase 2 can add
  // weight 600 if the cinematic hero needs more presence.
  weight: ["500"],
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
        {children}
        {/* Grain overlay — fixed, pointer-events-none, multiply blend.
            Adds the signature printed-paper texture without hurting perf. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
