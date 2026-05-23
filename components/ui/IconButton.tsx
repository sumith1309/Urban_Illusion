import * as React from "react";
import { cn } from "@/lib/utils";

/* 44×44 touch-target icon button. Used by Header for search/account/cart. */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { srLabel: string }
>(({ className, children, srLabel, ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "relative inline-grid place-items-center size-11 rounded-full text-current hover:text-cobalt transition-colors",
      className,
    )}
    {...rest}
  >
    <span className="sr-only">{srLabel}</span>
    {children}
  </button>
));
IconButton.displayName = "IconButton";
