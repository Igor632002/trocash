"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HomeView from "./components/HomeView";
import { copy as uiCopy, LANGUAGES } from "@/lib/uiResources";
import { getVisibleListings } from "@/lib/uiHelpers";
import { useAuth } from "@/lib/hooks/useAuth";
import { useOffers } from "@/lib/hooks/useOffers";
import { useCategories } from "@/lib/hooks/useCategories";
import { useLocations } from "@/lib/hooks/useLocations";

export default function Home({ initialLang = "pt" }) {
  const [lang, setLang] = useState(initialLang);
  const [languageOpen, setLanguageOpen] = useState(false);
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
  const router = useRouter();

  const { user } = useAuth();
  const {
    offers,
    loading,
    notice,
    photos,
    addPhotos,
    removePhoto,
    form,
    setForm,
    addOffer,
    proposeExchange,
  } = useOffers({ user, copy, category, onPublished: () => setNewOfferOpen(false) });
  const { categoriesList } = useCategories();
  const { locationsList } = useLocations();

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
      categoriesList={categoriesList}
      locationsList={locationsList}
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