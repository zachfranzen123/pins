import { Resend } from "resend";
import type { Order, OrderItem } from "./orders";
import { getEnv } from "./db";
import { STORE_NAME, formatMoney, paymentInstructions } from "./config";

function itemsList(order: Order): string {
  const items: OrderItem[] = JSON.parse(order.items_json);
  return items
    .map((i) => `  • ${i.name} × ${i.qty} — ${formatMoney(i.unit_price_cents * i.qty)}`)
    .join("\n");
}

function shippingBlock(order: Order): string {
  return [
    order.customer_name,
    order.shipping_line1,
    order.shipping_line2,
    `${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}`,
    order.shipping_country,
  ]
    .filter(Boolean)
    .join("\n");
}

async function send(to: string, subject: string, text: string) {
  const env = await getEnv();
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    console.warn("RESEND_API_KEY or FROM_EMAIL not configured; skipping email send.");
    return;
  }
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: `${STORE_NAME} <${env.FROM_EMAIL}>`,
    to,
    subject,
    text,
  });
}

export async function sendOrderReceivedEmail(order: Order) {
  const env = await getEnv();
  const instructions = paymentInstructions(env, order.payment_method, order.total_cents);
  const text = `Hi ${order.customer_name},

Thanks for your order from ${STORE_NAME}! Here's what we've got:

${itemsList(order)}

Subtotal: ${formatMoney(order.subtotal_cents)}${
    order.discount_cents ? `\nDiscount: -${formatMoney(order.discount_cents)}` : ""
  }
Total: ${formatMoney(order.total_cents)}

Order #: ${order.order_number}

Shipping to:
${shippingBlock(order)}

--- How to pay ---
${instructions}

Once we see your payment come through we'll send a confirmation email and get your pin(s) in the mail. Questions? Just reply to this email.

Thanks!
${STORE_NAME}`;

  await send(order.customer_email, `Order received — ${order.order_number}`, text);
}

export async function sendNewOrderNotification(order: Order) {
  const env = await getEnv();
  const to = env.ADMIN_NOTIFICATION_EMAIL || env.FROM_EMAIL;
  const text = `New order ${order.order_number} — ${formatMoney(order.total_cents)} via ${order.payment_method}

${order.customer_name} <${order.customer_email}>

${itemsList(order)}

Total: ${formatMoney(order.total_cents)}

Ship to:
${shippingBlock(order)}

Once you see the payment land, mark it paid in /admin so the buyer gets their confirmation email.`;

  await send(to, `New order — ${order.order_number} (${formatMoney(order.total_cents)})`, text);
}

export async function sendPaymentConfirmedEmail(order: Order) {
  const text = `Hi ${order.customer_name},

Payment received for order ${order.order_number} — thank you! Your pin(s) will ship soon to:

${shippingBlock(order)}

${itemsList(order)}
Total paid: ${formatMoney(order.total_cents)}

Thanks for supporting ${STORE_NAME}!`;

  await send(order.customer_email, `Payment confirmed — ${order.order_number}`, text);
}
