import type { Route } from "next";
import { redirect } from "next/navigation";

/** Back-compat: the Customer scenario is now the "customer" Domain Pack. */
export default function CustomerRedirect() {
  redirect("/domain/customer" as Route);
}
