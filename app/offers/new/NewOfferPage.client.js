"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useOffers } from "@/lib/hooks/useOffers";
import { useCategories } from "@/lib/hooks/useCategories";
import { useLocations } from "@/lib/hooks/useLocations";
import NewOfferModal from "@/app/components/home/NewOfferModal";

export default function NewOfferPageClient({ copy }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/offers";
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = React.useState("");
  const { categoriesList } = useCategories();
  const { locationsList } = useLocations();
  const { loading, notice, photos, addPhotos, removePhoto, form, setForm, addOffer } = useOffers({
    user,
    copy,
    category,
    onPublished: () => router.push(returnTo),
  });

  const [newOfferOpen, setNewOfferOpen] = React.useState(false);
  const [wishlistOpen, setWishlistOpen] = React.useState(false);
  const [heroActive, setHeroActive] = React.useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
      return;
    }
    if (!authLoading && user) {
      setNewOfferOpen(true);
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, category }));
  }, [category, setForm]);

  if (authLoading || !newOfferOpen) {
    return <main className="site-shell tc-page" style={{ padding: 20 }}>Carregando...</main>;
  }

  return (
    <main className="site-shell tc-page">
      <NewOfferModal
        copy={copy}
        newOfferOpen={newOfferOpen}
        setNewOfferOpen={setNewOfferOpen}
        setWishlistOpen={setWishlistOpen}
        setHeroActive={setHeroActive}
        onBack={() => router.push(returnTo)}
        onClose={() => router.push(returnTo)}
        showBackButton={true}
        addOffer={addOffer}
        category={category}
        setCategory={setCategory}
        categoriesList={categoriesList}
        locationsList={locationsList}
        form={form}
        setForm={setForm}
        photos={photos}
        addPhotos={addPhotos}
        removePhoto={removePhoto}
        loading={loading}
        notice={notice}
      />

      <div style={{ padding: 20, textAlign: "center" }}>
        <button
          type="button"
          className="nav-btn"
          onClick={() => router.push("/offers")}
        >
          Voltar às ofertas
        </button>
      </div>
    </main>
  );
}
