import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/require-admin";
import { listProducts } from "@/lib/products";
import { listOrders } from "@/lib/orders";
import { listCoupons } from "@/lib/coupons";
import AdminDashboard from "./AdminDashboard";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  const [products, orders, coupons] = await Promise.all([
    listProducts(),
    listOrders(),
    listCoupons(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <LogoutButton />
      </div>
      <AdminDashboard products={products} orders={orders} coupons={coupons} />
    </div>
  );
}
