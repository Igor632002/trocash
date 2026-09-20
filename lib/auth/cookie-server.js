import { cookies } from "next/headers";

export const AUTH_SESSION_COOKIE = "trocash_auth_session";

export async function getServerAuthSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}
