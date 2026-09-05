"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchActiveOffers, createExchangeRequest, createOffer } from "@/lib/dal";
import { buildOfferPayload, validateOfferForm } from "@/lib/offers";

// Bundles offers listing, photo staging, publish and exchange flows that used to live inline in app/page.js
export function useOffers({ user, copy, category, onPublished } = {}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", area: "", kind: "", wish: "", notes: "" });

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetchActiveOffers();
      setOffers(items || []);
    } catch (e) {
      console.error(e);
      setNotice("Failed to load offers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  async function addOffer(e) {
    e?.preventDefault?.();
    if (!user) {
      setNotice("Please sign in to publish an offer.");
      return;
    }
    if (!validateOfferForm(form).valid) {
      setNotice(copy?.publishTitle || "Please provide a title.");
      return;
    }
    setLoading(true);
    try {
      const files = photos.map((p) => p.file).filter(Boolean);
      const payloadForm = buildOfferPayload(form, category);

      await createOffer(payloadForm, files, user);

      photos.forEach((p) => { try { URL.revokeObjectURL(p.preview); } catch (e) { } });
      setForm({ title: "", description: "", area: "", kind: "", wish: "", notes: "" });
      setPhotos([]);
      setNotice(copy?.offerPublished || "Offer published.");
      onPublished?.();
      await fetchOffers();
    } catch (err) {
      console.error("addOffer error", err);
      setNotice(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  function addPhotos(filesOrEvent = []) {
    const files = filesOrEvent?.target?.files
      ? Array.from(filesOrEvent.target.files)
      : Array.isArray(filesOrEvent)
        ? filesOrEvent
        : Array.from(filesOrEvent || []);
    const next = files.slice(0, 6).map((file) => ({ file, preview: URL.createObjectURL(file), name: file.name }));
    setPhotos((prev) => [...prev, ...next]);
  }

  function removePhoto(idx) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function proposeExchange(offerId, targetId) {
    try {
      await createExchangeRequest({ offerId, targetId, from: user?.id });
      setNotice(copy?.exchangeRequested || "Exchange requested.");
    } catch (e) {
      console.error(e);
      setNotice("Failed to request exchange");
    }
  }

  return {
    offers,
    loading,
    notice,
    setNotice,
    photos,
    addPhotos,
    removePhoto,
    form,
    setForm,
    fetchOffers,
    addOffer,
    proposeExchange,
  };
}
