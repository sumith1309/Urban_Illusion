export const metadata = { title: "Journal" };

const ENTRIES = [
  {
    slug: "the-history-of-the-eye",
    date: "January 2026",
    read: "6 min",
    title: "The history of the eye.",
    blurb:
      "A motif older than written language, carried from Mesopotamian terracotta to the cobalt glass of modern Istanbul.",
  },
  {
    slug: "watercolour-as-resistance",
    date: "December 2025",
    read: "4 min",
    title: "Watercolour as resistance.",
    blurb:
      "Why we still hand-paint our washes in an age of generative pattern. The argument for slow surfaces.",
  },
  {
    slug: "first-drop-field-notes",
    date: "November 2025",
    read: "8 min",
    title: "First drop · field notes.",
    blurb:
      "Notes from the studio in the weeks before the launch drop went live. What we got right, what we re-cut.",
  },
];

export default function JournalPage() {
  return (
    <main className="pt-24 lg:pt-28 bg-paper min-h-dvh">
      <section className="container-lux px-4 lg:px-8 section-pad text-center">
        <p className="eyebrow">House · Journal</p>
        <h1 className="font-display text-5xl lg:text-6xl mt-4 leading-[0.95] tracking-[-0.02em] max-w-[18ch] mx-auto">
          Long reads from the studio.
        </h1>
        <p className="mt-6 text-ink-soft text-lead max-w-[48ch] mx-auto">
          Essays on the symbol, the craft, and the city the maison was made in.
        </p>
      </section>

      <section className="container-lux px-4 lg:px-8 pb-24 max-w-3xl mx-auto">
        <ul className="divide-y divide-ink/10">
          {ENTRIES.map((e) => (
            <li key={e.slug}>
              <article className="py-10 grid sm:grid-cols-[auto_1fr] gap-x-8 gap-y-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft pt-2">
                  <p>{e.date}</p>
                  <p className="mt-1 text-ink/40">{e.read}</p>
                </div>
                <div>
                  <h2 className="font-display text-3xl leading-tight">{e.title}</h2>
                  <p className="mt-3 text-ink-soft max-w-[52ch]">{e.blurb}</p>
                  <p className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">
                    Full entry · with the next drop
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft text-center">
          New entries land with each drop · join the list to be the first to read.
        </p>
      </section>
    </main>
  );
}
