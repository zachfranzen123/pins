import { getDB } from "./db";
import { decrementInventory, restoreInventory } from "./products";

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  unit_price_cents: number;
};

export type Order = {
  id: number;
  order_number: string;
  created_at: string;
  status: "pending" | "paid" | "shipped" | "canceled";
  customer_name: string;
  customer_email: string;
  shipping_line1: string;
  shipping_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  items_json: string;
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
  coupon_code: string | null;
  payment_method: string;
  paid_at: string | null;
  shipped_at: string | null;
  canceled_at: string | null;
};

function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const randPart = Array.from(bytes, (b) => b.toString(36)).join("").toUpperCase();
  return `PIN-${datePart}-${randPart}`;
}

export class OutOfStockError extends Error {
  constructor(public slug: string) {
    super(`Not enough stock for ${slug}`);
  }
}

export async function createOrder(input: {
  items: { slug: string; name: string; qty: number; unit_price_cents: number }[];
  customerName: string;
  customerEmail: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod: string;
  couponCode?: string | null;
  discountCents?: number;
}): Promise<Order> {
  const decremented: { slug: string; qty: number }[] = [];
  for (const item of input.items) {
    const ok = await decrementInventory(item.slug, item.qty);
    if (!ok) {
      // roll back any items we already decremented before failing
      for (const d of decremented) await restoreInventory(d.slug, d.qty);
      throw new OutOfStockError(item.slug);
    }
    decremented.push({ slug: item.slug, qty: item.qty });
  }

  const subtotalCents = input.items.reduce((sum, i) => sum + i.unit_price_cents * i.qty, 0);
  const discountCents = Math.min(input.discountCents ?? 0, subtotalCents);
  const totalCents = subtotalCents - discountCents;
  const orderNumber = generateOrderNumber();

  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO orders (
        order_number, customer_name, customer_email,
        shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_zip, shipping_country,
        items_json, subtotal_cents, discount_cents, total_cents, coupon_code, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      orderNumber,
      input.customerName,
      input.customerEmail,
      input.shippingLine1,
      input.shippingLine2 ?? null,
      input.shippingCity,
      input.shippingState,
      input.shippingZip,
      input.shippingCountry,
      JSON.stringify(input.items),
      subtotalCents,
      discountCents,
      totalCents,
      input.couponCode ?? null,
      input.paymentMethod
    )
    .run();

  const order = await getOrderByNumber(orderNumber);
  if (!order) throw new Error("Failed to load order after creation");
  return order;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .bind(orderNumber)
    .first<Order>();
  return row ?? null;
}

export async function listOrders(): Promise<Order[]> {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all<Order>();
  return results;
}

export async function markOrderPaid(orderNumber: string): Promise<Order | null> {
  const db = await getDB();
  await db
    .prepare("UPDATE orders SET status = 'paid', paid_at = datetime('now') WHERE order_number = ? AND status = 'pending'")
    .bind(orderNumber)
    .run();
  return getOrderByNumber(orderNumber);
}

export async function markOrderShipped(orderNumber: string): Promise<Order | null> {
  const db = await getDB();
  await db
    .prepare("UPDATE orders SET status = 'shipped', shipped_at = datetime('now') WHERE order_number = ? AND status = 'paid'")
    .bind(orderNumber)
    .run();
  return getOrderByNumber(orderNumber);
}

export async function cancelOrder(orderNumber: string): Promise<Order | null> {
  const order = await getOrderByNumber(orderNumber);
  if (!order || order.status === "canceled") return order;

  const items: OrderItem[] = JSON.parse(order.items_json);
  for (const item of items) {
    await restoreInventory(item.slug, item.qty);
  }

  const db = await getDB();
  await db
    .prepare("UPDATE orders SET status = 'canceled', canceled_at = datetime('now') WHERE order_number = ?")
    .bind(orderNumber)
    .run();
  return getOrderByNumber(orderNumber);
}
