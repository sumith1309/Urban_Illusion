import * as React from "react";
import { formatPrice } from "@/lib/utils";
import type { Money } from "@/lib/shopify/types";

export function Price({
  value,
  compareAt,
  className,
}: {
  value: Money;
  compareAt?: Money;
  className?: string;
}) {
  const hasDiscount =
    compareAt && Number(compareAt.amount) > Number(value.amount);

  return (
    <span className={`font-mono text-xs tracking-[0.18em] ${className ?? ""}`}>
      {hasDiscount && (
        <span className="line-through text-ink/40 mr-2">
          {formatPrice(compareAt.amount, compareAt.currencyCode)}
        </span>
      )}
      <span className={hasDiscount ? "text-cobalt" : ""}>
        {formatPrice(value.amount, value.currencyCode)}
      </span>
    </span>
  );
}
