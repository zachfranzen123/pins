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
      const data = (await res.json()) as {
        orderNumber?: string;
        appleCashMessageUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.orderNumber) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const confirmationUrl = `/order/${data.orderNumber}`;
      router.push(confirmationUrl);

      if (paymentMethod === "apple_cash" && data.appleCashMessageUrl) {
        // Give Next.js a moment to save the confirmation page in browser history,
        // then hand off to Messages with the recipient and order details prefilled.
        window.setTimeout(() => {
          window.location.href = data.appleCashMessageUrl!;
        }, 250);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section>
        <h2 className="font-display font-semibold text-base mb-2">Pins</h2>
        <div className="space-y-3">
          {products.map((product) => {
            const soldOut = product.inventory <= 0;
            return (
              <div
                key={product.slug}
                className="flex items-center justify-between rounded-xl border-2 border-[var(--ink)] bg-white p-3"
              >
                <div>
                  <p className="font-bold">{product.name}</p>
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
                  className="w-20 rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 text-center font-semibold disabled:opacity-40"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-base mb-2">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Full name"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 sm:col-span-2 focus:border-[var(--ink)] outline-none"
            value={fields.customerName}
            onChange={(e) => setFields((f) => ({ ...f, customerName: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 sm:col-span-2 focus:border-[var(--ink)] outline-none"
            value={fields.customerEmail}
            onChange={(e) => setFields((f) => ({ ...f, customerEmail: e.target.value }))}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-base mb-2">Shipping address</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Address line 1"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 sm:col-span-2 focus:border-[var(--ink)] outline-none"
            value={fields.shippingLine1}
            onChange={(e) => setFields((f) => ({ ...f, shippingLine1: e.target.value }))}
          />
          <input
            placeholder="Address line 2 (optional)"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 sm:col-span-2 focus:border-[var(--ink)] outline-none"
            value={fields.shippingLine2}
            onChange={(e) => setFields((f) => ({ ...f, shippingLine2: e.target.value }))}
          />
          <input
            required
            placeholder="City"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 focus:border-[var(--ink)] outline-none"
            value={fields.shippingCity}
            onChange={(e) => setFields((f) => ({ ...f, shippingCity: e.target.value }))}
          />
          <input
            required
            placeholder="State"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 focus:border-[var(--ink)] outline-none"
            value={fields.shippingState}
            onChange={(e) => setFields((f) => ({ ...f, shippingState: e.target.value }))}
          />
          <input
            required
            placeholder="ZIP"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 focus:border-[var(--ink)] outline-none"
            value={fields.shippingZip}
            onChange={(e) => setFields((f) => ({ ...f, shippingZip: e.target.value }))}
          />
          <input
            required
            placeholder="Country"
            className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 focus:border-[var(--ink)] outline-none"
            value={fields.shippingCountry}
            onChange={(e) => setFields((f) => ({ ...f, shippingCountry: e.target.value }))}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-base mb-2">Payment method</h2>
        <div className="flex gap-3 flex-wrap">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`rounded-full border-2 border-[var(--ink)] px-4 py-2 cursor-pointer text-sm font-bold transition-colors ${
                paymentMethod === m.id ? "pop-shadow bg-[var(--yellow)]" : "bg-white"
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
          {paymentMethod === "apple_cash"
            ? "After the order is created, Messages will open with the recipient, total, and order number already filled in. You’ll still confirm and send the Apple Cash payment yourself."
            : "You’ll get the exact payment details on the confirmation page and in your email."}
        </p>
      </section>

      <section>
        <h2 className="font-display font-semibold text-base mb-2">Coupon code</h2>
        <input
          placeholder="Optional"
          className="rounded-lg border-2 border-[var(--ink)]/20 px-3 py-1.5 w-full sm:w-64 focus:border-[var(--ink)] outline-none"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </section>

      <section className="border-t-2 border-dashed border-[var(--ink)]/20 pt-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>{formatMoney(subtotalCents)}</span>
        </div>
        <p className="text-xs text-black/50 mt-1">
          Final total (after any coupon) is shown on the confirmation page.
        </p>

        {error && <p className="text-red-600 text-sm mt-4 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="pop-shadow mt-4 w-full rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-white py-3 font-bold text-base disabled:opacity-50"
        >
          {submitting
            ? "Placing order..."
            : paymentMethod === "apple_cash"
              ? "Place order & open Messages"
              : "Place order"}
        </button>
      </section>
    </form>
  );
}
