import type { Metadata } from "next";
import { getProduct } from "@/lib/products/catalog";
import { ProductShell } from "@/components/studio/product-shell";
import { QuillmarkWorkspace } from "@/components/products/quillmark-workspace";

export const metadata: Metadata = {
  title: "Quillmark",
  description: "Architecture decision records with diligence packet export.",
};

export default function QuillmarkPage() {
  return (
    <ProductShell product={getProduct("quillmark")}>
      <QuillmarkWorkspace />
    </ProductShell>
  );
}
