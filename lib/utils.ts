import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class-name merger used across the design system. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Money price (INR default). */
export function formatPrice(
  amount: string | number,
  currency: "INR" | "USD" | "EUR" | "GBP" = "INR",
): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (currency === "INR") return `₹${value.toLocaleString("en-IN")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}
