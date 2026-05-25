import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Off the path",
  description: "The page you were looking for has slipped past the gaze.",
};

export default function NotFound() {
  return (
    <main className="min-h-[70svh] flex flex-col items-center justify-center text-center section-pad px-4">
      <div className="relative size-36 sm:size-44 opacity-90 mb-10">
        <Image
          src="/brand/eye-master@2x.png"
          alt=""
          fill
          sizes="(max-width: 640px) 144px, 176px"
          priority
          className="object-contain select-none"
        />
      </div>

      <p className="eyebrow mb-4">Off the path · 404</p>
      <h1 className="font-display-bold text-navy leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)" }}>
        The page slipped past the gaze.
      </h1>
      <p className="text-lead text-ink-soft mt-6 max-w-[44ch]">
        It may have been moved, renamed, or never existed at all. The amulet is patient — return to the shop and try another door.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
        <Link
          href="/shop"
          data-magnetic="0.35"
          className="btn-press group/btn inline-flex items-center gap-3 rounded-full bg-navy text-paper pl-6 pr-2 py-2 text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap"
        >
          <span>Enter the shop</span>
          <span aria-hidden className="grid place-items-center size-9 rounded-full bg-paper text-navy">→</span>
        </Link>
        <Link
          href="/"
          data-magnetic="0.2"
          className="btn-press text-[11px] font-mono tracking-[0.24em] uppercase underline underline-offset-8 decoration-1 hover:decoration-cobalt transition-colors whitespace-nowrap"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
