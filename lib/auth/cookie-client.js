export const AUTH_SESSION_COOKIE = "trocash_auth_session";

function toCookieValue(session) {
  if (!session?.user?.id) return "";
  const payload = {
    id: session.user.id,
    email: session.user.email || null,
    expiresAt: session.expires_at || null,
  };
  return encodeURIComponent(JSON.stringify(payload));
}

export function writeAuthSessionCookie(session) {
  if (typeof document === "undefined") return;

  const value = toCookieValue(session);
  if (!value) {
    clearAuthSessionCookie();
    return;
  }

  const maxAge = session?.expires_at
    ? Math.max(session.expires_at - Math.floor(Date.now() / 1000), 60)
    : 60 * 60 * 24 * 7;

  document.cookie = `${AUTH_SESSION_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearAuthSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
