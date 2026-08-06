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
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-8">
      <span className="pop-shadow inline-block -rotate-2 rounded-full border-2 border-[var(--ink)] bg-[var(--teal)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
        Almost there
      </span>
      <h1 className="font-display text-2xl font-semibold tracking-tight mt-3 mb-6">Checkout</h1>
      <CheckoutForm products={products} initialQty={initialQty} />
    </div>
  );
}
