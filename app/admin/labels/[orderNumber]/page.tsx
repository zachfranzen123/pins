import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/require-admin";
import { getOrderByNumber } from "@/lib/orders";
import LabelBlock from "../LabelBlock";
import PrintButton from "../PrintButton";

export const dynamic = "force-dynamic";

export default async function SingleLabelPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div>
      <div className="no-print mx-auto max-w-4xl px-4 sm:px-6 py-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-black/50 hover:underline">
            ← Back to admin
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Label — {order.order_number}</h1>
        </div>
        <PrintButton />
      </div>
      <LabelBlock order={order} />
    </div>
  );
}
