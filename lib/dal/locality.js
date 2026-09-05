import { supabase } from "@/lib/supabase";

// Fetch all locations from the database
export async function fetchLocations() {
  const { data, error } = await supabase
    .from("location")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}
