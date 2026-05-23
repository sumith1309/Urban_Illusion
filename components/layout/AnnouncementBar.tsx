"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "Complimentary shipping over ₹5,000",
  "The Nazar Edit — limited drop · est. 2026",
  "Hand-finished in small batches",
];

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const id = window.setInterval(
      () => setIdx((n) => (n + 1) % MESSAGES.length),
      6000,
    );
    return () => window.clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="relative bg-ink text-paper">
      <div className="container-lux flex items-center justify-center px-4 py-2">
        <p
          key={idx}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-center animate-[fadeIn_var(--dur-base)_var(--ease-lux)]"
        >
          {MESSAGES[idx]}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 size-9 grid place-items-center text-paper/60 hover:text-paper"
        >
          <X className="size-4" strokeWidth={1.4} />
        </button>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
