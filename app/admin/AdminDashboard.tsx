"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import type { Order, OrderItem } from "@/lib/orders";
import type { Coupon } from "@/lib/coupons";
import { formatMoney } from "@/lib/config";

type Tab = "inventory" | "orders" | "coupons";

export default function AdminDashboard({
  products,
  orders,
  coupons,
}: {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
}) {
  const [tab, setTab] = useState<Tab>("inventory");

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-black/10">
        {(["inventory", "orders", "coupons"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize ${
              tab === t ? "border-[#1f2430]" : "border-transparent text-black/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "inventory" && <InventoryPanel products={products} />}
      {tab === "orders" && <OrdersPanel orders={orders} />}
      {tab === "coupons" && <CouponsPanel coupons={coupons} />}
    </div>
  );
}

function InventoryPanel({ products }: { products: Product[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(products.map((p) => [p.slug, String(p.inventory)]))
  );
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  async function save(slug: string) {
    const inventory = parseInt(values[slug], 10);
    if (!Number.isFinite(inventory) || inventory < 0) return;
    setSavingSlug(slug);
    await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, inventory }),
    });
    setSavingSlug(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.slug} className="flex items-center justify-between rounded-xl border border-black/10 p-4">
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-black/50">{formatMoney(p.price_cents)}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={values[p.slug]}
              onChange={(e) => setValues((v) => ({ ...v, [p.slug]: e.target.value }))}
              className="w-24 rounded-lg border border-black/20 px-3 py-2 text-center"
            />
            <button
              onClick={() => save(p.slug)}
              disabled={savingSlug === p.slug}
              className="rounded-full bg-[#1f2430] text-white text-sm px-4 py-2 disabled:opacity-50"
            >
              {savingSlug === p.slug ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersPanel({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function act(orderNumber: string, action: "paid" | "shipped" | "cancel") {
    setBusy(orderNumber + action);
    await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(null);
    router.refresh();
  }

  if (orders.length === 0) return <p className="text-black/50">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const items: OrderItem[] = JSON.parse(order.items_json);
        return (
          <div key={order.order_number} className="rounded-xl border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.order_number}</p>
                <p className="text-sm text-black/50">
                  {order.customer_name} · {order.customer_email}
                </p>
              </div>
              <span
                className={`text-xs rounded-full px-3 py-1 capitalize ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-black/10 text-black/60"
                }`}
              >
                {order.status}
              </span>
            </div>
            <ul className="text-sm mt-2 text-black/70">
              {items.map((item) => (
                <li key={item.slug}>
                  {item.name} × {item.qty}
                </li>
              ))}
            </ul>
            <p className="text-sm mt-1 font-medium">{formatMoney(order.total_cents)} · {order.payment_method}</p>

            <div className="flex gap-2 mt-3">
              {order.status === "pending" && (
                <>
                  <button
                    onClick={() => act(order.order_number, "paid")}
                    disabled={busy === order.order_number + "paid"}
                    className="text-sm rounded-full bg-green-700 text-white px-3 py-1.5 disabled:opacity-50"
                  >
                    Mark paid
                  </button>
                  <button
                    onClick={() => act(order.order_number, "cancel")}
                    disabled={busy === order.order_number + "cancel"}
                    className="text-sm rounded-full bg-red-700 text-white px-3 py-1.5 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {order.status === "paid" && (
                <button
                  onClick={() => act(order.order_number, "shipped")}
                  disabled={busy === order.order_number + "shipped"}
                  className="text-sm rounded-full bg-blue-700 text-white px-3 py-1.5 disabled:opacity-50"
                >
                  Mark shipped
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CouponsPanel({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("10");
  const [maxUses, setMaxUses] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        type,
        value: parseInt(value, 10),
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Failed to create coupon");
      return;
    }
    setCode("");
    setValue("10");
    setMaxUses("");
    router.refresh();
  }

  async function toggleActive(couponCode: string, active: boolean) {
    await fetch(`/api/admin/coupons/${couponCode}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={createCoupon} className="rounded-xl border border-black/10 p-4 mb-6 space-y-3">
        <h2 className="font-medium">New coupon</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            required
            placeholder="CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="rounded-lg border border-black/20 px-3 py-2 sm:col-span-2"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "percent" | "fixed")}
            className="rounded-lg border border-black/20 px-3 py-2"
          >
            <option value="percent">% off</option>
            <option value="fixed">$ off</option>
          </select>
          <input
            required
            type="number"
            min={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg border border-black/20 px-3 py-2"
            placeholder={type === "percent" ? "e.g. 10" : "cents, e.g. 500"}
          />
        </div>
        <input
          type="number"
          min={1}
          placeholder="Max uses (optional)"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          className="rounded-lg border border-black/20 px-3 py-2 w-full sm:w-48"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#1f2430] text-white text-sm px-4 py-2 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create coupon"}
        </button>
      </form>

      <div className="space-y-2">
        {coupons.length === 0 && <p className="text-black/50">No coupons yet.</p>}
        {coupons.map((c) => (
          <div key={c.code} className="flex items-center justify-between rounded-xl border border-black/10 p-4">
            <div>
              <p className="font-medium">{c.code}</p>
              <p className="text-sm text-black/50">
                {c.type === "percent" ? `${c.value}% off` : `${formatMoney(c.value)} off`} · used {c.uses}
                {c.max_uses ? `/${c.max_uses}` : ""}
              </p>
            </div>
            <button
              onClick={() => toggleActive(c.code, !c.active)}
              className={`text-sm rounded-full px-3 py-1.5 ${
                c.active ? "bg-black/10" : "bg-green-100 text-green-800"
              }`}
            >
              {c.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
