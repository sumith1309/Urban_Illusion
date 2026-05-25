import { redirect } from "next/navigation";

/**
 * /wishlist is a drawer-driven experience, not a standalone page. If a visitor
 * lands here directly (bookmark, typed URL, external link) we redirect to home
 * with a query param that the WishlistDrawer reader picks up to auto-open the
 * drawer. Prevents the unbranded 404 the audit flagged as a BLOCKER.
 */
export default function WishlistRedirect() {
  redirect("/?wishlist=open");
}
