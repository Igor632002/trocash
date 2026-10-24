"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HomeView from "../components/HomeView";
import { copy as uiCopy, LANGUAGES } from "@/lib/uiResources";
import { getVisibleListings } from "@/lib/uiHelpers";
import { useAuth } from "@/lib/hooks/useAuth";
import { fetchTopOffers } from "@/lib/dal/offers";
import { useOffers } from "@/lib/hooks/useOffers";
import { useCategories } from "@/lib/hooks/useCategories";
import { useLocations } from "@/lib/hooks/useLocations";

const KIND_TO_CATEGORY_NAME = {
  personal: "Moda",
  realestate: "Casa",
  car: "Outros",
  collectibles: "Outros",
};

export default function Home({ initialLang = "pt" }) {
  const [lang, setLang] = useState(initialLang);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [placeholder] = useState("");
  const [category, setCategory] = useState("");
  //const [category, setCategory] = useState("");
  const [have, setHave] = useState("");
  const [want, setWant] = useState("");
  const [locationId, setLocationId] = useState("");
  // Фактично застосовані фільтри

  const [searchFilters, setSearchFilters] = useState({
    category: "Todas",
    have: "",
    want: "",
    locationId: "Todas",
  });

  const [searchTab, setSearchTab] = useState("Procuro");
  const [searchOpen, setSearchOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistReturnTo, setWishlistReturnTo] = useState(null);
  const [newWishOpen, setNewWishOpen] = useState(false);
  const [newOfferOpen, setNewOfferOpen] = useState(false);

  const copy = uiCopy[lang] || uiCopy.pt;
  const router = useRouter();

  const { user } = useAuth();
  const {
    offers,
    visibleListings,
    setVisibleListings,
    isTopList,
    setIsTopList,
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

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Stylesheets of /exchange conflict with the home page ones; on browser back/forward
  // to any non-exchange page do a full document reload instead of a client navigation.
  // The listener is intentionally not removed on unmount: Next unmounts this page before
  // popstate listeners run, so a cleanup would remove it before it could fire.
  useEffect(() => {
    if (window.__exchangePopstateReload) return;
    window.__exchangePopstateReload = true;
    window.addEventListener("popstate", () => {
      if (window.location.pathname.startsWith("/exchange")) return;
      setTimeout(() => window.location.reload(), 0);
    });
  }, []);

  // Apply the ?category=<kind> filter coming from the home page category cards.
  // Maps a card kind to the DB category name; adjust names to match the "category" table.
  const categoryParamApplied = useRef(false);
  useEffect(() => {
    if (categoryParamApplied.current || offers.length === 0 || categoriesList.length === 0) return;
    categoryParamApplied.current = true;
    const kind = new URLSearchParams(window.location.search).get("category");
    const dbName = KIND_TO_CATEGORY_NAME[kind];
    const match = categoriesList.find((c) => c.name === dbName);
    if (!match) return;
    const id = String(match.id);
    setCategory(id);
    setSearchFilters((prev) => ({ ...prev, category: id }));
    setVisibleListings(getVisibleListings({ offers, category: id, locationId: "Todas" }));
    setIsTopList(false);
  }, [offers, categoriesList, setVisibleListings, setIsTopList]);

  const changeLang = (code) => {
    setLang(code);
    window.history.replaceState(null, "", `/exchange/${code}`);
  };

  const handleSearch = (overrides = {}) => {
    const next = { category, have, want, locationId, ...overrides };
    // treat empty (placeholder) as 'Todas' for applied filters
    next.category = next.category || "Todas";
    next.locationId = next.locationId || "Todas";
    setSearchFilters(next);
    setVisibleListings(getVisibleListings({ offers, ...next }));
    setIsTopList(false);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <HomeView
      copy={copy}
      LANGUAGES={LANGUAGES}
      lang={lang}
      setLang={changeLang}
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

      locationId={locationId}
      setLocationId={setLocationId}

      searchTab={searchTab}
      setSearchTab={setSearchTab}

      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
      handleSearch={handleSearch}
      visibleListings={visibleListings}
      isTopList={isTopList}

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
      wishlistReturnTo={wishlistReturnTo}
      setWishlistReturnTo={setWishlistReturnTo}

      newWishOpen={newWishOpen}
      setNewWishOpen={setNewWishOpen}

      newOfferOpen={newOfferOpen}
      setNewOfferOpen={setNewOfferOpen}

      router={router}
      scrollTo={scrollTo}
    />
  );
}
