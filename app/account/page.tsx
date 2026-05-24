import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <main className="pt-24 lg:pt-28 bg-paper min-h-dvh">
      <section className="container-lux px-4 lg:px-8 section-pad max-w-2xl">
        <p className="eyebrow">Account</p>
        <h1 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95] tracking-[-0.02em]">
          Sign in to the maison.
        </h1>
        <p className="mt-6 text-ink-soft text-lead max-w-[44ch]">
          Member accounts open with the next drop. Customers placing orders today
          can track them through the email confirmation — no account required.
        </p>

        <form
          className="mt-10 space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="block">
            <span className="eyebrow mb-2 block">Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-transparent border-b border-ink/20 focus:border-ink py-3 outline-none font-body"
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-2 block">Password</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-ink/20 focus:border-ink py-3 outline-none font-body"
            />
          </label>
          <Button
            type="submit"
            variant="navy"
            size="lg"
            iconArrow
            disabled
            className="w-full justify-between"
          >
            Sign in (opens with next drop)
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-ink/10 grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="eyebrow mb-2">Order tracking</p>
            <p className="text-ink-soft">
              Use the link in your shipping email. Need help? Reach us on{" "}
              <a
                href="https://wa.me/917013436805"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-cobalt"
              >
                WhatsApp
              </a>
              .
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Wishlist</p>
            <p className="text-ink-soft">
              Liked pieces are saved to this device. Sign-in syncing arrives with
              accounts.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/shop"
            className="font-mono text-[11px] uppercase tracking-[0.24em] underline underline-offset-8 hover:text-cobalt"
          >
            Continue browsing →
          </Link>
        </div>
      </section>
    </main>
  );
}
