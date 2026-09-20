"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { clearAuthSessionCookie, writeAuthSessionCookie } from "@/lib/auth/cookie-client";

// Encapsulates the Supabase session check that used to live inline in app/page.js
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session || null;
        if (mounted) setUser(session?.user || null);
        if (session) writeAuthSessionCookie(session);
        else clearAuthSessionCookie();
      } catch (e) {
        console.warn("supabase session check failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Keep user state in sync with login/logout/token refresh events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user || null);
      if (session) writeAuthSessionCookie(session);
      else clearAuthSessionCookie();
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, setUser, loading };
}
