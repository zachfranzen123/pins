import { getDB } from "./db";

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number; // percent: 1-100, fixed: cents
  active: number; // 0 | 1
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  created_at: string;
};

export async function listCoupons(): Promise<Coupon[]> {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM coupons ORDER BY created_at DESC")
    .all<Coupon>();
  return results;
}

export async function createCoupon(input: {
  code: string;
  type: "percent" | "fixed";
  value: number;
  maxUses?: number | null;
  expiresAt?: string | null;
}): Promise<void> {
  const db = await getDB();
  const code = input.code.trim().toUpperCase();
  if (!code) throw new Error("Coupon code is required");
  if (input.type === "percent" && (input.value < 1 || input.value > 100)) {
    throw new Error("Percent discounts must be between 1 and 100");
  }
  if (input.type === "fixed" && input.value < 1) {
    throw new Error("Fixed discount must be a positive amount");
  }
  await db
    .prepare(
      `INSERT INTO coupons (code, type, value, max_uses, expires_at) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(code, input.type, input.value, input.maxUses ?? null, input.expiresAt ?? null)
    .run();
}

export async function setCouponActive(code: string, active: boolean): Promise<void> {
  const db = await getDB();
  await db
    .prepare("UPDATE coupons SET active = ? WHERE code = ?")
    .bind(active ? 1 : 0, code.toUpperCase())
    .run();
}

export type CouponCheck =
  | { ok: true; coupon: Coupon; discountCents: number }
  | { ok: false; reason: string };

/** Validates a coupon code against a subtotal and computes the discount, without redeeming it. */
export async function checkCoupon(code: string, subtotalCents: number): Promise<CouponCheck> {
  const db = await getDB();
  const coupon = await db
    .prepare("SELECT * FROM coupons WHERE code = ?")
    .bind(code.trim().toUpperCase())
    .first<Coupon>();

  if (!coupon) return { ok: false, reason: "Coupon not found" };
  if (!coupon.active) return { ok: false, reason: "Coupon is no longer active" };
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: "Coupon has expired" };
  }
  if (coupon.max_uses != null && coupon.uses >= coupon.max_uses) {
    return { ok: false, reason: "Coupon has reached its usage limit" };
  }

  const discountCents =
    coupon.type === "percent"
      ? Math.round((subtotalCents * coupon.value) / 100)
      : Math.min(coupon.value, subtotalCents);

  return { ok: true, coupon, discountCents };
}

export async function redeemCoupon(code: string): Promise<void> {
  const db = await getDB();
  await db
    .prepare("UPDATE coupons SET uses = uses + 1 WHERE code = ?")
    .bind(code.trim().toUpperCase())
    .run();
}
