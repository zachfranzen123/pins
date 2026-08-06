import { listProducts } from "@/lib/products";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; qty?: string }>;
}) {
  const [products, params] = await Promise.all([listProducts(), searchParams]);

  const initialQty: Record<string, number> = {};
  if (params.slug) {
    initialQty[params.slug] = Math.max(1, parseInt(params.qty ?? "1", 10) || 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Checkout</h1>
      <CheckoutForm products={products} initialQty={initialQty} />
    </div>
  );
}
