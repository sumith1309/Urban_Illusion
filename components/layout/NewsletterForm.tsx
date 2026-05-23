"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="flex items-end gap-3 max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        // Wire to /api/newsletter in Phase 4 (Klaviyo handoff)
      }}
    >
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          inputMode="email"
          required
          placeholder={submitted ? "Thank you — you're on the list." : "you@example.com"}
          disabled={submitted}
          className="w-full bg-transparent border-b border-paper/30 focus:border-paper text-paper placeholder:text-paper/40 py-3 outline-none font-body disabled:text-gold-soft"
        />
      </label>
      <button
        type="submit"
        disabled={submitted}
        className="btn-press shrink-0 font-mono text-[11px] uppercase tracking-[0.24em] text-paper border-b border-paper py-3 pb-2.5 hover:text-gold-soft disabled:opacity-40"
      >
        {submitted ? "Joined ✓" : "Join →"}
      </button>
    </form>
  );
}
