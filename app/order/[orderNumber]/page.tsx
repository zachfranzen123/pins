import { notFound } from "next/navigation";
import { getOrderByNumber, type OrderItem } from "@/lib/orders";
import { getEnv } from "@/lib/db";
import { formatMoney, paymentInstructions } from "@/lib/config";
import { linkify } from "@/lib/linkify";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const env = await getEnv();
  const items: OrderItem[] = JSON.parse(order.items_json);
  const instructions = paymentInstructions(env, order.payment_method, order.total_cents);

  const statusLabel: Record<string, string> = {
    pending: "Awaiting payment",
    paid: "Payment received",
    shipped: "Shipped",
    canceled: "Canceled",
  };

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-8">
      <p className="text-sm font-bold uppercase tracking-wide text-black/40">Order {order.order_number}</p>
      <h1 className="font-display text-2xl font-semibold tracking-tight mt-1">
        {order.status === "pending" ? "Thanks! One more step. 🎉" : statusLabel[order.status]}
      </h1>

      {order.status === "pending" && (
        <div className="pop-shadow mt-4 rounded-2xl border-2 border-[var(--ink)] bg-[var(--yellow)] p-4">
          <h2 className="font-display font-semibold text-base mb-2">How to pay</h2>
          <p className="text-black/80">{linkify(instructions)}</p>
          <p className="text-sm text-black/60 mt-3">
            We&apos;ll email you as soon as we see the payment come through.
          </p>
        </div>
      )}

      <div className="mt-4 rounded-2xl border-2 border-[var(--ink)] bg-white p-4">
        <h2 className="font-display font-semibold text-base mb-2">Order summary</h2>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.slug} className="flex justify-between">
              <span>
                {item.name} × {item.qty}
              </span>
              <span className="font-semibold">{formatMoney(item.unit_price_cents * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t-2 border-dashed border-[var(--ink)]/20 mt-3 pt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotal_cents)}</span>
          </div>
          {order.discount_cents > 0 && (
            <div className="flex justify-between">
              <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
              <span>-{formatMoney(order.discount_cents)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span>{formatMoney(order.total_cents)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-[var(--ink)] bg-white p-4 text-sm">
        <h2 className="font-display font-semibold text-base mb-2">Shipping to</h2>
        <p className="text-black/70">
          {order.customer_name}
          <br />
          {order.shipping_line1}
          {order.shipping_line2 ? <><br />{order.shipping_line2}</> : null}
          <br />
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
          <br />
          {order.shipping_country}
        </p>
      </div>
    </div>
  );
}
