"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeView from "./components/HomeView";
import { copy as uiCopy, LANGUAGES } from "@/lib/uiResources";
import { getVisibleListings } from "@/lib/uiHelpers";
import { fetchActiveOffers, createExchangeRequest, createOffer } from "@/lib/dal";
import { supabase } from "@/lib/supabase";

export default function Home({ initialLang = "pt" }) {
  const [lang, setLang] = useState(initialLang);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", area: "", kind: "", wish: "", notes: "" });
  const [placeholder] = useState("");
  //const [category, setCategory] = useState("Todas");
  const [category, setCategory] = useState("");
  const [have, setHave] = useState("");
  const [want, setWant] = useState("");
  const [radius, setRadius] = useState(50);
  const [searchTab, setSearchTab] = useState("Procuro");
  const [searchOpen, setSearchOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [newOfferOpen, setNewOfferOpen] = useState(false);

  const copy = uiCopy[lang] || uiCopy.pt;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user || null);
      } catch (e) {
        console.warn("supabase session check failed", e);
      }
    })();
    fetchOffers();
  }, []);

  const router = useRouter();

  async function fetchOffers() {
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
  }

  async function addOffer(e) {
    e?.preventDefault?.();
    if (!user) {
      setNotice("Please sign in to publish an offer.");
      return;
    }
    if (!form.title || !form.title.trim()) {
      setNotice(copy?.publishTitle || "Please provide a title.");
      return;
    }
    setLoading(true);
    try {
      const files = photos.map((p) => p.file).filter(Boolean);

      // Derive a valid `kind` (matches DB: 'Objeto' | 'Serviço' | 'Horas')
      const derivedKind = form.kind && form.kind.trim()
        ? form.kind
        : category === "Serviços"
          ? "Serviço"
          : category === "Tempo"
            ? "Horas"
            : "Objeto";

      const payloadForm = { ...form, 
        kind: derivedKind,
        area: form.area || "Faro", 
        category_id: category === "Todas" ? null : category };

      await createOffer(payloadForm, files, user);

      photos.forEach((p) => { try { URL.revokeObjectURL(p.preview); } catch (e) { } });
      setForm({ title: "", description: "", area: "", kind: "", wish: "", notes: "" });
      setPhotos([]);
      setNotice(copy?.offerPublished || "Offer published.");
      setNewOfferOpen(false);
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

  const visibleListings = getVisibleListings({ offers, category, have, want });

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <HomeView
      copy={copy}
      LANGUAGES={LANGUAGES}
      lang={lang}
      setLang={setLang}
      languageOpen={languageOpen}
      setLanguageOpen={setLanguageOpen}
      user={user}
      offers={offers}
      loading={loading}
      notice={notice}
      placeholder={placeholder}
      category={category}
      setCategory={setCategory}
      have={have}
      setHave={setHave}
      want={want}
      setWant={setWant}
      radius={radius}
      setRadius={setRadius}
      searchTab={searchTab}
      setSearchTab={setSearchTab}
      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
      visibleListings={visibleListings}
      addPhotos={addPhotos}
      photos={photos}
      removePhoto={removePhoto}
      form={form}
      setForm={setForm}
      addOffer={addOffer}
      proposeExchange={proposeExchange}
      premiumOpen={premiumOpen}
      setPremiumOpen={setPremiumOpen}
      accountOpen={accountOpen}
      setAccountOpen={setAccountOpen}
      wishlistOpen={wishlistOpen}
      setWishlistOpen={setWishlistOpen}
      newOfferOpen={newOfferOpen}
      setNewOfferOpen={setNewOfferOpen}
      router={router}
      scrollTo={scrollTo}
    />
  );
}