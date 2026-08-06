import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/require-admin";
import { listOrders } from "@/lib/orders";
import LabelBlock from "./LabelBlock";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function LabelsPage() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  const orders = await listOrders();
  const readyToShip = orders.filter((o) => o.status === "paid");

  return (
    <div>
      <div className="no-print mx-auto max-w-4xl px-4 sm:px-6 py-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-black/50 hover:underline">
            ← Back to admin
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            Shipping labels — {readyToShip.length} ready to ship
          </h1>
          <p className="text-sm text-black/50 mt-1">
            One address per page. Paid orders that haven&apos;t been marked shipped yet.
          </p>
        </div>
        {readyToShip.length > 0 && <PrintButton />}
      </div>

      {readyToShip.length === 0 && (
        <p className="no-print mx-auto max-w-4xl px-4 sm:px-6 text-black/50">
          Nothing paid-and-unshipped right now.
        </p>
      )}

      {readyToShip.map((order) => (
        <LabelBlock key={order.order_number} order={order} />
      ))}
    </div>
  );
}
