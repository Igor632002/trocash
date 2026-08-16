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

export async function insertOffer(form, userId) {
  const payload = { owner_id: userId, ...form, status: "active" };
  const { error } = await supabase.from("offers").insert([payload]);
  if (error) throw error;
  return true;
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