"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Encapsulates the Supabase session check that used to live inline in app/page.js
export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user || null);
      } catch (e) {
        console.warn("supabase session check failed", e);
      }
    })();
  }, []);

  return { user, setUser };
}
