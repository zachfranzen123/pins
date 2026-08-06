import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./admin-auth";
import { getEnv } from "./db";

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const env = await getEnv();
  return verifySessionToken(token, env.ADMIN_SESSION_SECRET);
}
