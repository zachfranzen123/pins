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
      <span className="pop-shadow inline-block -rotate-2 rounded-full border-2 border-[var(--ink)] bg-[var(--teal)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
        Almost there
      </span>
      <h1 className="font-display text-3xl font-semibold tracking-tight mt-4 mb-8">Checkout</h1>
      <CheckoutForm products={products} initialQty={initialQty} />
    </div>
  );
}
