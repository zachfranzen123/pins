import type { Order, OrderItem } from "@/lib/orders";

export default function LabelBlock({ order }: { order: Order }) {
  const items: OrderItem[] = JSON.parse(order.items_json);
  const summary = items.map((i) => `${i.name} ×${i.qty}`).join(", ");

  return (
    <div className="label-block break-after-page min-h-[9in] px-16 py-20 flex flex-col justify-center">
      <p className="text-sm text-black/40 mb-10 print:text-black/50">
        Order {order.order_number} — {summary}
      </p>
      <div className="text-3xl leading-snug font-medium max-w-xl">
        <p>{order.customer_name}</p>
        <p>{order.shipping_line1}</p>
        {order.shipping_line2 && <p>{order.shipping_line2}</p>}
        <p>
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
        </p>
        <p>{order.shipping_country}</p>
      </div>
    </div>
  );
}
