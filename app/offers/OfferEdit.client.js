"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OfferEditForm({ offer }) {
  const router = useRouter();
  const [title, setTitle] = useState(offer.title || "");
  const [description, setDescription] = useState(offer.description || "");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const imgSrc = offer.image_url || (offer.photo_urls && offer.photo_urls[0]) || null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    //console.log("Submitting update", { id: offer?.id, title, description });
    const res = await supabase
      .from("offers")
      .update({ title, description })
      .eq("id", offer.id)
      .select()
      .single();
    setLoading(false);

    //console.log("Update result", res);
    if (res.error) {
      alert("Помилка збереження: " + res.error.message);
      return;
    }
    setNotice("Збережено");
    if (router && router.refresh) router.refresh();
    // очистити повідомлення через 3 сек
    //setTimeout(() => setNotice(null), 3000);
  }

  return (
    <div>
      {imgSrc && (
        <div
          className="listing-image"
          style={{
            width: 140,
            minWidth: 140,
            height: 100,
            marginBottom: 16,
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 8,
          }}
        />
      )}
      
      {notice && (
        <div className="offer-edit-notice" role="status" aria-live="polite">
          <span>{notice}</span>
          <button  className="notice-close" onClick={() => setNotice(null)}
            aria-label="Закрити повідомлення">× </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Заголовок
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          Опис
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>
        <div>
          <button type="submit" disabled={loading} className="gold-btn">{loading ? "Зберегти..." : "Зберегти"}</button>
        </div>
      </form>
    </div>
  );
}