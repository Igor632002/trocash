"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OfferActions({ id, onDone }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function doAction(action) {
    if (action === "delete" && !confirm("Видалити цю пропозицію?")) return;
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/offers/${id}/${action}`, {
        method: "POST",
        headers,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      // If parent provided a refresh handler (client-side lists), use it; otherwise
      // fall back to Next's router.refresh to revalidate server data.
      if (typeof onDone === "function") onDone();
      else router.refresh();
    } catch (e) {
      alert("Помилка: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="offer-actions" style={{ marginTop: 8 }}>
      <a className="nav-btn" href={`/offers/${id}/edit`}>Редагувати</a>
      <button className="nav-btn" onClick={() => doAction("hide")} disabled={loading}>Приховати</button>
      <button className="nav-btn" onClick={() => doAction("delete")} disabled={loading}>Видалити</button>
    </div>
  );
}