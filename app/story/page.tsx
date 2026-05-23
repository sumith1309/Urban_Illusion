import Link from "next/link";

export const metadata = { title: "The Eye" };

export default function StoryPlaceholder() {
  return (
    <main className="section-pad container-lux min-h-[100dvh] flex flex-col justify-center">
      <p className="eyebrow">Phase 2 · The Eye</p>
      <h1 className="mt-4 max-w-[18ch]">The scrollytelling story lands at Phase 2.</h1>
      <p className="text-lead mt-6 max-w-[60ch] text-ink-soft">
        Pinned scroll, the eye opens, the crosshairs draw on, the line lands.
      </p>
      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-2 font-mono text-xs tracking-[0.24em] uppercase underline underline-offset-8"
      >
        ← Back home
      </Link>
    </main>
  );
}
