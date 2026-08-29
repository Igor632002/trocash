import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getTokenFromReq(req) {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7);
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/sb-access-token=([^;]+)/) || cookie.match(/supabase-auth-token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  return null;
}

export async function POST(req, context) {
  let id = context?.params?.id;
  let action = context?.params?.action;

  // Fallback: if Next didn't populate params for some reason (dev server, proxy, etc.),
  // try to extract `id` and `action` from the request URL path.
  if ((!id || !action) && typeof req.url === "string") {
    try {
      const u = new URL(req.url);

      // normalize path without leading/trailing slashes
      let path = u.pathname;
      if (path.startsWith("/")) path = path.slice(1);
      if (path.endsWith("/")) path = path.slice(0, -1);
      const parts = path.split("/");

      // path may be like /api/offers/:id/:action
      const offersIdx = parts.indexOf("offers");
      if (offersIdx !== -1 && parts.length > offersIdx + 2) {
        id = id || parts[offersIdx + 1];
        action = action || parts[offersIdx + 2];
      }
    } catch (e) { }
  }

  if (!id || !action) return new Response("missing params", { status: 400 });

  const token = getTokenFromReq(req);
  if (!token) return new Response("unauthenticated", { status: 401 });

  const supabase = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  try {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return new Response("invalid token", { status: 401 });
    const user = userData.user;

    const { data: row, error: fetchErr } = await supabase
      .from("offers")
      .select("id,owner_id")
      .eq("id", id)
      .limit(1)
      .single();

    if (fetchErr) return new Response(fetchErr.message || "cannot fetch offer", { status: 500 });
    if (!row) return new Response("not found", { status: 404 });
    if (row.owner_id !== user.id) return new Response("forbidden", { status: 403 });

    if (action === "delete") {
      const { error: delErr } = await supabase.from("offers").delete().eq("id", id);
      if (delErr) return new Response(delErr.message, { status: 500 });
      return new Response("deleted", { status: 200 });
    }

    if (action === "hide") {
      const { error: updErr } = await supabase.from("offers").update({ status: "paused" }).eq("id", id);
      if (updErr) return new Response(updErr.message, { status: 500 });
      return new Response("paused", { status: 200 });
    }
    return new Response("action not supported", { status: 400 });
  }

  catch (e) {
    return new Response(String(e), { status: 500 });
  }
}