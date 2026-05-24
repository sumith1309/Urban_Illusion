import { notFound } from "next/navigation";
import Link from "next/link";

type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

const DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: "Privacy",
    updated: "Updated · January 2026",
    intro:
      "Urban Illusion respects the people who shop with us. This notice explains what we collect, why, and the choices you have.",
    sections: [
      {
        heading: "What we collect",
        body:
          "Order details (name, shipping address, contact, what you bought) so we can fulfil orders. Optional newsletter email if you join the drop list. Anonymous analytics on which pages you visit, so we can keep improving the experience.",
      },
      {
        heading: "What we don't collect",
        body:
          "Card data never touches our servers — payments are tokenised by our PCI-compliant payment provider. We do not sell, share, or rent personal data to third parties.",
      },
      {
        heading: "Your rights",
        body:
          "You can request a copy of your data, ask us to correct it, or ask us to delete it. Reach us at hello@urbanillusion.example or via WhatsApp and we will respond within 30 days.",
      },
      {
        heading: "Cookies",
        body:
          "See the Cookies notice for the small set of cookies we use to keep your cart, wishlist, and session intact.",
      },
    ],
  },
  terms: {
    title: "Terms",
    updated: "Updated · January 2026",
    intro:
      "These terms apply when you browse or shop on urbanillusion.example. Plain English where possible.",
    sections: [
      {
        heading: "Orders",
        body:
          "An order is confirmed when we send the order confirmation email. Drop pieces are limited and final sale; standard pieces follow the returns policy on the Shipping & returns page.",
      },
      {
        heading: "Pricing",
        body:
          "Prices are in INR and inclusive of GST where applicable. International orders may incur duties at the destination, collected by the carrier.",
      },
      {
        heading: "Intellectual property",
        body:
          "The marks, prints, photographs, and copy on this site belong to Urban Illusion. Don't reproduce them commercially without permission — but tag us when you wear the pieces, we love seeing it.",
      },
      {
        heading: "Disputes",
        body:
          "Anything we can't resolve over WhatsApp falls under the courts of Hyderabad, India.",
      },
    ],
  },
  cookies: {
    title: "Cookies",
    updated: "Updated · January 2026",
    intro:
      "We use a small set of cookies and local-storage entries to keep the experience working. No third-party advertising cookies.",
    sections: [
      {
        heading: "Strictly necessary",
        body:
          "ui-cart-v1 and ui-wishlist-v1 are stored in your browser to remember your bag and your liked pieces across visits. Removing them empties your bag and wishlist.",
      },
      {
        heading: "Analytics",
        body:
          "Privacy-respecting, IP-anonymised analytics let us see which pages perform. No cross-site tracking.",
      },
      {
        heading: "Your control",
        body:
          "Your browser settings let you clear cookies and local storage at any time. If you do, your saved bag and wishlist will reset.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = DOCS[slug];
  return { title: doc?.title ?? "Legal" };
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <main className="pt-24 lg:pt-28 bg-paper min-h-dvh">
      <article className="container-lux px-4 lg:px-8 section-pad max-w-3xl">
        <p className="eyebrow">Legal · {doc.title}</p>
        <h1 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95] tracking-[-0.02em]">
          {doc.title}
        </h1>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          {doc.updated}
        </p>
        <p className="mt-8 text-ink-soft text-lead max-w-[55ch]">{doc.intro}</p>

        <div className="mt-12 space-y-10">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl mb-3">{s.heading}</h2>
              <p className="text-ink-soft leading-relaxed max-w-[60ch]">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
          <Link href="/legal/privacy" className="hover:text-cobalt underline underline-offset-8">
            Privacy
          </Link>
          <Link href="/legal/terms" className="hover:text-cobalt underline underline-offset-8">
            Terms
          </Link>
          <Link href="/legal/cookies" className="hover:text-cobalt underline underline-offset-8">
            Cookies
          </Link>
        </div>
      </article>
    </main>
  );
}
