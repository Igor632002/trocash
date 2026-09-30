import { supabase } from "@/lib/supabase";

function getUserId(userOrId) {
  return typeof userOrId === "string" ? userOrId : userOrId?.id;
}

async function assertCurrentSession(userId, actionName) {
  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUserId = sessionData?.session?.user?.id;

  if (!sessionUserId) {
    throw new Error("No active auth session (not signed in).");
  }

  if (userId && sessionUserId !== userId) {
    throw new Error(`Auth session user does not match owner_id for ${actionName} (please re-login).`);
  }

  return sessionUserId;
}

function normalizeExampleUrls(payload) {
  if (payload.example_urls == null && payload.exampleUrls == null) {
    return payload;
  }

  const rawUrls = payload.example_urls ?? payload.exampleUrls;
  const urls = Array.isArray(rawUrls) ? rawUrls : [rawUrls];

  payload.example_urls = urls.filter(Boolean);
  delete payload.exampleUrls;

  return payload;
}

function stripUndefinedFields(payload) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

export async function fetchActiveWishes() {
  const { data, error } = await supabase
    .from("wishes")
    .select("*, profiles(display_name, area, email)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchWishById(id) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("wishes")
    .select("*, profiles(display_name, area, email)")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function fetchWishesByOwner(ownerId) {
  if (!ownerId) return [];

  const { data, error } = await supabase
    .from("wishes")
    .select("*, profiles(display_name, area, email)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function insertWish(form, userOrId) {
  const userId = getUserId(userOrId);
  if (!userId) throw new Error("Missing user id for insertWish");

  await assertCurrentSession(userId, "insertWish");

  const payload = stripUndefinedFields(
    normalizeExampleUrls({
      owner_id: userId,
      ...form,
      status: "active",
    })
  );

  delete payload.id;
  delete payload.ownerId;

  const { data, error } = await supabase
    .from("wishes")
    .insert([payload])
    .select()
    .maybeSingle();

  if (error) {
    console.error("insertWish failed", { payload, error });
    throw error;
  }

  return data || true;
}

export async function updateWish(wishId, updates, userOrId) {
  if (!wishId) throw new Error("Missing wish id for updateWish");

  const userId = getUserId(userOrId);
  if (!userId) throw new Error("Missing user id for updateWish");

  await assertCurrentSession(userId, "updateWish");

  const payload = stripUndefinedFields(
    normalizeExampleUrls({
      ...updates,
    })
  );

  delete payload.id;
  delete payload.owner_id;
  delete payload.ownerId;

  const { data, error } = await supabase
    .from("wishes")
    .update(payload)
    .eq("id", wishId)
    .eq("owner_id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("updateWish failed", { wishId, payload, error });
    throw error;
  }

  return data || true;
}

export async function deleteWish(wishId, userOrId) {
  if (!wishId) throw new Error("Missing wish id for deleteWish");

  const userId = getUserId(userOrId);
  if (!userId) throw new Error("Missing user id for deleteWish");

  await assertCurrentSession(userId, "deleteWish");

  const { data, error } = await supabase
    .from("wishes")
    .update({ status: "deleted" })
    .eq("id", wishId)
    .eq("owner_id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("deleteWish failed", { wishId, error });
    throw error;
  }

  return data || true;
}