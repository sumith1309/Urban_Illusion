import { notFound } from "next/navigation";
import Link from "next/link";

type SupportArticle = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string | string[] }[];
};

const ARTICLES: Record<string, SupportArticle> = {
  shipping: {
    title: "Shipping & returns",
    eyebrow: "Care · Shipping",
    intro:
      "Every piece leaves the studio wrapped in linen and dispatched within 48 hours of order. Complimentary shipping over ₹5,000.",
    sections: [
      {
        heading: "Delivery windows",
        body: [
          "India · 2–4 business days (complimentary over ₹5,000).",
          "International · 7–12 business days, calculated at checkout.",
          "Drop pieces ship the week after the drop closes.",
        ],
      },
      {
        heading: "Returns",
        body: "Unworn pieces with tags intact can be returned within 30 days of delivery for a full refund to the original payment method. Drop pieces are final sale.",
      },
      {
        heading: "Exchanges",
        body: "Size or colour exchanges are free within India. Initiate via the link in your shipping email, or message us on WhatsApp.",
      },
    ],
  },
  "size-guide": {
    title: "Size guide",
    eyebrow: "Care · Sizing",
    intro:
      "Our pieces cut to a relaxed, drop-shoulder silhouette. Measurements taken garment-flat. When between sizes, size down for a cleaner line, up for the editorial drape.",
    sections: [
      {
        heading: "Tops & tees (inches)",
        body: [
          "XS · Chest 40 · Length 27",
          "S  · Chest 42 · Length 28",
          "M  · Chest 44 · Length 29",
          "L  · Chest 46 · Length 30",
          "XL · Chest 48 · Length 31",
          "XXL · Chest 50 · Length 32",
        ],
      },
      {
        heading: "How to measure",
        body: "Lay a well-fitting tee flat. Measure across the chest one inch below the armhole, and from the highest shoulder point to the hem. Compare against the table above.",
      },
      {
        heading: "Still unsure?",
        body: "Message us on WhatsApp with your usual size in two brands you love — we'll point you to the right pick.",
      },
    ],
  },
  faq: {
    title: "Frequently asked",
    eyebrow: "Care · FAQ",
    intro:
      "Quick answers. For anything else, our atelier is one message away on WhatsApp.",
    sections: [
      {
        heading: "Are pieces restocked?",
        body: "Drop pieces are made in small, numbered runs and never restocked. Core pieces from the maison restock on a quiet rolling basis.",
      },
      {
        heading: "Where is everything made?",
        body: "Hand-finished in small batches in India, with watercolour washes painted in-studio before printing.",
      },
      {
        heading: "How do I care for the watercolour prints?",
        body: "Cold wash inside-out. Hang dry. Iron reverse only. The pigment softens beautifully across wears — that's intentional.",
      },
      {
        heading: "Do you ship internationally?",
        body: "Yes — most of the world. Duties and taxes are calculated at checkout, and tracked end-to-end.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  return { title: article?.title ?? "Support" };
}

export default async function SupportArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <main className="pt-24 lg:pt-28 bg-paper min-h-dvh">
      <article className="container-lux px-4 lg:px-8 section-pad max-w-3xl">
        <p className="eyebrow">{article.eyebrow}</p>
        <h1 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95] tracking-[-0.02em]">
          {article.title}
        </h1>
        <p className="mt-6 text-ink-soft text-lead max-w-[55ch]">
          {article.intro}
        </p>

        <div className="mt-12 space-y-10">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl mb-3">{s.heading}</h2>
              {Array.isArray(s.body) ? (
                <ul className="space-y-1.5 text-ink-soft font-mono text-[13px]">
                  {s.body.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-ink-soft leading-relaxed max-w-[60ch]">{s.body}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
          <Link href="/support/shipping" className="hover:text-cobalt underline underline-offset-8">
            Shipping & returns
          </Link>
          <Link href="/support/size-guide" className="hover:text-cobalt underline underline-offset-8">
            Size guide
          </Link>
          <Link href="/support/faq" className="hover:text-cobalt underline underline-offset-8">
            FAQ
          </Link>
          <a
            href="https://wa.me/917013436805"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hover:text-cobalt underline underline-offset-8"
          >
            WhatsApp →
          </a>
        </div>
      </article>
    </main>
  );
}
