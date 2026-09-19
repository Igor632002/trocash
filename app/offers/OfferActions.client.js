"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { copy as UI_COPY } from "@/lib/uiResources";

const L = UI_COPY.pt;

export default function OfferActions({ id, onDone }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function doAction(action) {
    if (action === "delete" && !confirm(L.deleteConfirmation || "Видалити цю пропозицію?")) return;
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
      if (typeof onDone === "function") onDone();
      else router.refresh();
    } catch (e) {
      alert((L.noResults || "Помилка") + ": " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="offer-actions" style={{ marginTop: 8 }}>
      <a className="nav-btn" href={`/offers/${id}/edit`}>{L.editButton}</a>
      <button className="nav-btn" onClick={() => doAction("hide")} disabled={loading}>{L.hideButton}</button>
      <button className="nav-btn" onClick={() => doAction("active")} disabled={loading}>{L.showButton}</button>
      <button className="nav-btn" onClick={() => doAction("delete")} disabled={loading}>{L.deleteButton}</button>
    </div>
  );
}