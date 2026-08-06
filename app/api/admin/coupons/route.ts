import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/require-admin";
import { createCoupon, listCoupons } from "@/lib/coupons";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const coupons = await listCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    code?: string;
    type?: "percent" | "fixed";
    value?: number;
    maxUses?: number | null;
    expiresAt?: string | null;
  };

  if (!body.code || !body.type || typeof body.value !== "number") {
    return NextResponse.json({ error: "code, type, and value are required" }, { status: 400 });
  }

  try {
    await createCoupon({
      code: body.code,
      type: body.type,
      value: body.value,
      maxUses: body.maxUses ?? null,
      expiresAt: body.expiresAt ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create coupon";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
