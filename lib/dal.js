import { supabase } from "@/lib/supabase";

export async function fetchActiveOffers() {
  const { data, error } = await supabase
    .from("offers")
    .select("*, profiles(display_name, area)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// lib/dal.js
export async function insertOffer(form, userOrId) {
  const userId = typeof userOrId === "string" ? userOrId : userOrId?.id;
  const userEmail = typeof userOrId === "object" ? userOrId?.email : null;
  if (!userId) throw new Error("Missing user id for insertOffer");

  // Verify current auth session matches the requested owner id (helpful for RLS)
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const sessUserId = sessionData?.session?.user?.id;
    if (!sessUserId) {
      throw new Error("No active auth session (not signed in).");
    }
    if (sessUserId !== userId) {
      throw new Error("Auth session user does not match owner_id (please re-login).");
    }
  } catch (err) {
    // rethrow so caller shows friendly message
    throw err;
  }

  // Ensure profile exists
  try {
    const profilePayload = {
      id: userId,
      display_name: userEmail ? userEmail.split("@")[0] : userId.slice(0,8),
      area: form?.area || "Faro"
    };
    const { error: pErr } = await supabase.from("profiles").upsert([profilePayload]);
    if (pErr) throw pErr;
  } catch (err) {
    throw err;
  }

  // payload may contain photo_urls and/or image_url
  const payload = { owner_id: userId, ...form, status: "active" };

  try {
    const { data, error } = await supabase.from("offers").insert([payload]).select();
    if (error) {
      console.error("insertOffer failed", { payload, error });
      throw error;
    }
    return data?.[0] || true;
  } catch (err) {
    // If this is an RLS failure it will surface here; add actionable log
    console.error("insertOffer caught", { message: err?.message || err, payload });
    throw err;
  }
}
export async function createExchangeRequest(offerId, proposerId) {
  const { error } = await supabase.from("exchange_requests").insert([
    {
      offer_id: offerId,
      proposer_id: proposerId,
      proposal_type: "Objeto",
      proposal_text: "Quero trocar contigo!",
      status: "pending",
    },
  ]);
  if (error) throw error;
  return true;
}

export async function countOffersByOwner(ownerId) {
  const res = await supabase
    .from("offers")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId)
    .eq("status", "active");

  if (res.error) throw res.error;
  return res.count || 0;
}