import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/require-admin";
import { cancelOrder, markOrderPaid, markOrderShipped } from "@/lib/orders";
import { sendPaymentConfirmedEmail, sendShippedEmail } from "@/lib/email";

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await params;
  const body = (await request.json().catch(() => ({}))) as { action?: "paid" | "shipped" | "cancel" };

  let order;
  switch (body.action) {
    case "paid":
      order = await markOrderPaid(orderNumber);
      if (order) await sendPaymentConfirmedEmail(order);
      break;
    case "shipped":
      order = await markOrderShipped(orderNumber);
      if (order) await sendShippedEmail(order);
      break;
    case "cancel":
      order = await cancelOrder(orderNumber);
      break;
    default:
      return NextResponse.json({ error: "action must be 'paid', 'shipped', or 'cancel'" }, { status: 400 });
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found or not in a valid state for that action" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order });
}
