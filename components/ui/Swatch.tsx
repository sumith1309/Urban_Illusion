"use client";
import { cn } from "@/lib/utils";

export function Swatch({
  hex,
  label,
  selected,
  onSelect,
  size = "md",
}: {
  hex: string;
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "size-5" : "size-7";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid place-items-center rounded-full p-[3px] transition-shadow",
        selected ? "ring-1 ring-ink ring-offset-2 ring-offset-paper" : "ring-1 ring-ink/10",
      )}
    >
      <span
        className={cn(sz, "rounded-full border border-ink/10")}
        style={{ background: hex }}
      />
    </button>
  );
}
