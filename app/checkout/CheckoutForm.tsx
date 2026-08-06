"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatMoney, PAYMENT_METHODS } from "@/lib/config";

export default function CheckoutForm({
  products,
  initialQty,
}: {
  products: Product[];
  initialQty: Record<string, number>;
}) {
  const router = useRouter();
  const [qty, setQty] = useState<Record<string, number>>(initialQty);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fields, setFields] = useState({
    customerName: "",
    customerEmail: "",
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",
  });

  const items = useMemo(
    () => products.filter((p) => (qty[p.slug] ?? 0) > 0).map((p) => ({ product: p, qty: qty[p.slug] })),
    [products, qty]
  );

  const subtotalCents = items.reduce((sum, i) => sum + i.product.price_cents * i.qty, 0);

  function setQtyFor(slug: string, value: number, max: number) {
    setQty((q) => ({ ...q, [slug]: Math.max(0, Math.min(max, value)) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Select at least one pin.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.product.slug, qty: i.qty })),
          ...fields,
          paymentMethod,
          couponCode: couponCode || undefined,
        }),
      });
      const data = (await res.json()) as { orderNumber?: string; error?: string };
      if (!res.ok || !data.orderNumber) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push(`/order/${data.orderNumber}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <h2 className="font-medium mb-3">Pins</h2>
        <div className="space-y-3">
          {products.map((product) => {
            const soldOut = product.inventory <= 0;
            return (
              <div
                key={product.slug}
                className="flex items-center justify-between rounded-xl border border-black/10 p-4"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-black/50">
                    {formatMoney(product.price_cents)} · {soldOut ? "Sold out" : `${product.inventory} in stock`}
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={product.inventory}
                  disabled={soldOut}
                  value={qty[product.slug] ?? 0}
                  onChange={(e) => setQtyFor(product.slug, parseInt(e.target.value, 10) || 0, product.inventory)}
                  className="w-20 rounded-lg border border-black/20 px-3 py-2 text-center disabled:opacity-40"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Full name"
            className="rounded-lg border border-black/20 px-3 py-2 sm:col-span-2"
            value={fields.customerName}
            onChange={(e) => setFields((f) => ({ ...f, customerName: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-lg border border-black/20 px-3 py-2 sm:col-span-2"
            value={fields.customerEmail}
            onChange={(e) => setFields((f) => ({ ...f, customerEmail: e.target.value }))}
          />
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">Shipping address</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Address line 1"
            className="rounded-lg border border-black/20 px-3 py-2 sm:col-span-2"
            value={fields.shippingLine1}
            onChange={(e) => setFields((f) => ({ ...f, shippingLine1: e.target.value }))}
          />
          <input
            placeholder="Address line 2 (optional)"
            className="rounded-lg border border-black/20 px-3 py-2 sm:col-span-2"
            value={fields.shippingLine2}
            onChange={(e) => setFields((f) => ({ ...f, shippingLine2: e.target.value }))}
          />
          <input
            required
            placeholder="City"
            className="rounded-lg border border-black/20 px-3 py-2"
            value={fields.shippingCity}
            onChange={(e) => setFields((f) => ({ ...f, shippingCity: e.target.value }))}
          />
          <input
            required
            placeholder="State"
            className="rounded-lg border border-black/20 px-3 py-2"
            value={fields.shippingState}
            onChange={(e) => setFields((f) => ({ ...f, shippingState: e.target.value }))}
          />
          <input
            required
            placeholder="ZIP"
            className="rounded-lg border border-black/20 px-3 py-2"
            value={fields.shippingZip}
            onChange={(e) => setFields((f) => ({ ...f, shippingZip: e.target.value }))}
          />
          <input
            required
            placeholder="Country"
            className="rounded-lg border border-black/20 px-3 py-2"
            value={fields.shippingCountry}
            onChange={(e) => setFields((f) => ({ ...f, shippingCountry: e.target.value }))}
          />
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">Payment method</h2>
        <div className="flex gap-3 flex-wrap">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`rounded-full border px-4 py-2 cursor-pointer text-sm ${
                paymentMethod === m.id ? "border-[#1f2430] bg-[#1f2430] text-white" : "border-black/20"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={paymentMethod === m.id}
                onChange={() => setPaymentMethod(m.id)}
                className="sr-only"
              />
              {m.label}
            </label>
          ))}
        </div>
        <p className="text-xs text-black/50 mt-2">
          You&apos;ll get the exact handle/QR to send payment to on the confirmation page and in your email.
        </p>
      </section>

      <section>
        <h2 className="font-medium mb-3">Coupon code</h2>
        <input
          placeholder="Optional"
          className="rounded-lg border border-black/20 px-3 py-2 w-full sm:w-64"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </section>

      <section className="border-t border-black/10 pt-6">
        <div className="flex items-center justify-between text-lg font-medium">
          <span>Subtotal</span>
          <span>{formatMoney(subtotalCents)}</span>
        </div>
        <p className="text-xs text-black/50 mt-1">
          Final total (after any coupon) is shown on the confirmation page.
        </p>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-[#1f2430] text-white py-3 font-medium hover:bg-[#343b4a] disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </section>
    </form>
  );
}
