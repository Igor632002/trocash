"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InterestedButton({ offerId }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const senderEmail = sessionData?.session?.user?.email || "anonymous";

      const res = await fetch(`/api/offers/${offerId}/interested`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail }),
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({message:res.statusText}));
        throw new Error(body?.message || res.statusText);
      }
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  if (sent) return <button disabled className="gold-btn light-btn large nav-btn">Повідомлення надіслано</button>;

  return (
    <>
      <button onClick={handleClick} disabled={loading} className="gold-btn large btn-centered">
        {loading ? "Надсилаю…" : "Interested"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </>
  );
}