import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { checkCoupon, redeemCoupon } from "@/lib/coupons";
import { createOrder, OutOfStockError } from "@/lib/orders";
import { sendOrderReceivedEmail } from "@/lib/email";
import { formatMoney, PAYMENT_METHODS } from "@/lib/config";
import { getEnv } from "@/lib/db";

type CartLine = { slug: string; qty: number };

type OrderRequestBody = {
  items?: CartLine[];
  customerName?: string;
  customerEmail?: string;
  shippingLine1?: string;
  shippingLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  couponCode?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as OrderRequestBody;

  const items = (body.items ?? []).filter((i) => i && i.qty > 0);
  if (items.length === 0) {
    return NextResponse.json({ error: "Select at least one pin" }, { status: 400 });
  }

  const requiredFields: (keyof OrderRequestBody)[] = [
    "customerName",
    "customerEmail",
    "shippingLine1",
    "shippingCity",
    "shippingState",
    "shippingZip",
    "shippingCountry",
    "paymentMethod",
  ];
  for (const field of requiredFields) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  if (!PAYMENT_METHODS.some((m) => m.id === body.paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  // Look up live product data (name + price) rather than trusting the client.
  const resolvedItems = [];
  for (const line of items) {
    const product = await getProduct(line.slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${line.slug}` }, { status: 400 });
    }
    if (line.qty > product.inventory) {
      return NextResponse.json(
        { error: `Only ${product.inventory} left of ${product.name}` },
        { status: 409 }
      );
    }
    resolvedItems.push({
      slug: product.slug,
      name: product.name,
      qty: line.qty,
      unit_price_cents: product.price_cents,
    });
  }

  const subtotalCents = resolvedItems.reduce((sum, i) => sum + i.unit_price_cents * i.qty, 0);

  let discountCents = 0;
  let couponCode: string | null = null;
  if (body.couponCode && body.couponCode.trim() !== "") {
    const check = await checkCoupon(body.couponCode, subtotalCents);
    if (!check.ok) {
      return NextResponse.json({ error: check.reason }, { status: 400 });
    }
    discountCents = check.discountCents;
    couponCode = check.coupon.code;
  }

  try {
    const order = await createOrder({
      items: resolvedItems,
      customerName: body.customerName!.trim(),
      customerEmail: body.customerEmail!.trim(),
      shippingLine1: body.shippingLine1!.trim(),
      shippingLine2: body.shippingLine2?.trim(),
      shippingCity: body.shippingCity!.trim(),
      shippingState: body.shippingState!.trim(),
      shippingZip: body.shippingZip!.trim(),
      shippingCountry: body.shippingCountry!.trim(),
      paymentMethod: body.paymentMethod!,
      couponCode,
      discountCents,
    });

    if (couponCode) await redeemCoupon(couponCode);
    await sendOrderReceivedEmail(order);

    let appleCashMessageUrl: string | undefined;
    if (body.paymentMethod === "apple_cash") {
      const env = await getEnv();
      const contact = env.APPLE_CASH_CONTACT?.trim();
      if (contact) {
        const message = `Hi! I’d like to send ${formatMoney(order.total_cents)} via Apple Cash for Layover Pins order ${order.order_number}.`;
        appleCashMessageUrl = `sms:${encodeURIComponent(contact)}&body=${encodeURIComponent(message)}`;
      }
    }

    return NextResponse.json({
      orderNumber: order.order_number,
      appleCashMessageUrl,
    });
  } catch (err) {
    if (err instanceof OutOfStockError) {
      return NextResponse.json({ error: `Sorry, we just sold out of ${err.slug}` }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
