import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/* `display: swap` + default preloads kept FCP at 0.8s on simulated slow-4G;
   `preload:false` regressed FCP to 1.5s (fonts discovered late) so reverted.
   Cormorant trimmed to weight 500 only — ~1 woff2 instead of 4. */
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
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
