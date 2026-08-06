import { getDB } from "./db";

export type Product = {
  slug: string;
  name: string;
  price_cents: number;
  inventory: number;
};

export async function listProducts(): Promise<Product[]> {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT slug, name, price_cents, inventory FROM products ORDER BY rowid")
    .all<Product>();
  return results;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT slug, name, price_cents, inventory FROM products WHERE slug = ?")
    .bind(slug)
    .first<Product>();
  return row ?? null;
}

export async function setInventory(slug: string, inventory: number): Promise<void> {
  const db = await getDB();
  await db
    .prepare("UPDATE products SET inventory = ? WHERE slug = ?")
    .bind(Math.max(0, Math.floor(inventory)), slug)
    .run();
}

/** Atomically decrements stock; returns false (no-op) if not enough was in stock. */
export async function decrementInventory(slug: string, qty: number): Promise<boolean> {
  const db = await getDB();
  const result = await db
    .prepare("UPDATE products SET inventory = inventory - ? WHERE slug = ? AND inventory >= ?")
    .bind(qty, slug, qty)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function restoreInventory(slug: string, qty: number): Promise<void> {
  const db = await getDB();
  await db
    .prepare("UPDATE products SET inventory = inventory + ? WHERE slug = ?")
    .bind(qty, slug)
    .run();
}
