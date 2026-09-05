import { supabase } from "@/lib/supabase";

// Fetch active categories from the database
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("category")
    .select("id, name, description, status")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}
