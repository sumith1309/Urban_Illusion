import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "new" | "low-stock" | "last-chance" | "drop" | "gold" | "navy";

const tones: Record<Tone, string> = {
  new:           "bg-cobalt text-paper",
  "low-stock":   "bg-gold text-ink",
  "last-chance": "bg-ink text-paper",
  drop:          "bg-navy text-paper",
  gold:          "border border-gold text-gold bg-transparent",
  navy:          "border border-navy text-navy bg-transparent",
};

export function Badge({
  tone = "navy",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
