import type { NextConfig } from "next";

/**
 * Security headers per TRD §25.
 * - HSTS, no-sniff, frame-deny, restrictive Referrer-Policy.
 * - Permissions-Policy denies camera/mic/geolocation by default.
 * - CSP is intentionally permissive in dev (allows inline styles + eval for
 *   Turbopack HMR + GSAP/R3F) and tightened in production. The shape is set
 *   here so Phase 5 can lock it down without scaffolding work.
 */

const isProd = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  // Next.js inlines small scripts; GSAP/R3F evaluate at runtime. 'unsafe-eval'
  // can be removed in Phase 5 once we've confirmed every dynamic-import path
  // works without it. 'unsafe-inline' on style stays for Tailwind v4 inline.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.shopify.com",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
