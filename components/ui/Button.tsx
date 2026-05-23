import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* The royal button family.
   - variant `navy`/`ink`: the brand primary (the eye in a pill, dark)
   - variant `paper`: for use on dark/photographic surfaces
   - variant `ghost`: underline-only secondary
   - `iconArrow` opt-in renders the Button-in-Button trailing icon
   - pass `href` to render as next/link with the same internal layout
   All buttons honour 44×44px minimum touch target. */

type Variant = "navy" | "paper" | "ghost" | "ink";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  iconArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};
type ButtonAsLink = BaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};
type Props = ButtonAsButton | ButtonAsLink;

const base =
  "btn-press inline-flex items-center justify-center gap-3 font-mono uppercase tracking-[0.24em] " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease-lux)] " +
  "disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  navy:  "rounded-full bg-navy text-paper hover:bg-midnight",
  paper: "rounded-full bg-paper text-navy hover:bg-sand/60",
  ghost: "text-ink underline underline-offset-8 decoration-1 hover:decoration-cobalt",
  ink:   "rounded-full bg-ink text-paper hover:bg-ink-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-11 text-[10px] pl-5 pr-5",
  md: "h-12 text-[11px] pl-6 pr-2",
  lg: "h-14 text-[12px] pl-8 pr-3",
};

function Inner({
  iconArrow,
  variant,
  children,
}: {
  iconArrow?: boolean;
  variant: Variant;
  children: React.ReactNode;
}) {
  return (
    <>
      <span>{children}</span>
      {iconArrow && variant !== "ghost" && (
        <span
          aria-hidden
          className={cn(
            "grid place-items-center size-9 rounded-full transition-transform duration-[var(--dur-base)] ease-[var(--ease-lux)]",
            "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px",
            variant === "navy" || variant === "ink"
              ? "bg-paper text-navy"
              : "bg-navy text-paper",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  function Button(props, ref) {
    const { variant = "navy", size = "md", iconArrow, className, children, ...rest } = props;
    const cls = cn(
      "group/btn",
      base,
      variants[variant],
      variant !== "ghost" && sizes[size],
      className,
    );

    if ("href" in props && props.href) {
      const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      };
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cls}
          {...anchorRest}
        >
          <Inner iconArrow={iconArrow} variant={variant}>
            {children}
          </Inner>
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cls}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <Inner iconArrow={iconArrow} variant={variant}>
          {children}
        </Inner>
      </button>
    );
  },
);
