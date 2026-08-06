import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/require-admin";
import { setInventory } from "@/lib/products";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { slug?: string; inventory?: number };
  const { slug, inventory } = body;

  if (!slug || typeof inventory !== "number" || !Number.isFinite(inventory) || inventory < 0) {
    return NextResponse.json({ error: "slug and a non-negative inventory number are required" }, { status: 400 });
  }

  await setInventory(slug, inventory);
  return NextResponse.json({ ok: true });
}
