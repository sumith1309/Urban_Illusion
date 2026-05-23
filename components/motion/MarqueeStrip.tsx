/* Pure CSS marquee (animation declared in globals.css). No JS, no listeners.
   Items duplicate for a seamless loop. Animation paused under reduced motion
   via the global @media query in globals.css. */

export function MarqueeStrip({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  // Double the items for a seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden border-y border-ink/10 bg-paper py-5 ${className ?? ""}`}
      aria-hidden
    >
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-12 font-display-bold text-[clamp(2.5rem,6vw,5rem)] leading-none text-ink"
          >
            {item}
            <span className="text-gold text-3xl">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
