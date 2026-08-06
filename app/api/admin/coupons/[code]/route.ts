import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/require-admin";
import { setCouponActive } from "@/lib/coupons";

export async function PATCH(request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await params;
  const body = (await request.json().catch(() => ({}))) as { active?: boolean };
  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "active (boolean) is required" }, { status: 400 });
  }

  await setCouponActive(code, body.active);
  return NextResponse.json({ ok: true });
}
