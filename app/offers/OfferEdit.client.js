"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { copy as UI_COPY } from "@/lib/uiResources";

export default function OfferEditForm({ offer, lang = "pt" }) {
  const router = useRouter();
  const L = UI_COPY[lang] ?? UI_COPY.pt;
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
      alert(`${L.offerSaveError}: ${res.error.message}`);
      return;
    }
    setNotice(L.offerSaved);
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
            aria-label={L.offerCloseNotice}>× </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          {L.offerTitleLabel}
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          {L.offerDescriptionLabel}
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>
        <div>
          <button type="submit" disabled={loading} className="gold-btn">{loading ? L.offerSaving : L.saveButton}</button>
        </div>
      </form>
    </div>
  );
}