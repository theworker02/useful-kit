import type { Metadata } from "next";
import { getProduct } from "@/lib/products/catalog";
import { ProductShell } from "@/components/studio/product-shell";
import { LedgerlineWorkspace } from "@/components/products/ledgerline-workspace";

export const metadata: Metadata = {
  title: "Ledgerline",
  description: "Invoice-to-payment reconciliation with exception queues.",
};

export default function LedgerlinePage() {
  return (
    <ProductShell product={getProduct("ledgerline")}>
      <LedgerlineWorkspace />
    </ProductShell>
  );
}
