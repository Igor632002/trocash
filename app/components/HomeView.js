"use client"

import React from "react"
import SiteHeader from "./home/SiteHeader"
import HeroSection from "./home/HeroSection"
import SearchPanel from "./home/SearchPanel"
import FeaturedListings from "./home/FeaturedListings"
import MatchesSection from "./home/MatchesSection"
import TrustStrip from "./home/TrustStrip"
import BenefitsSection from "./home/BenefitsSection"
import PremiumTeaser from "./home/PremiumTeaser"
import SiteFooter from "./home/SiteFooter"
import AccountModal from "./home/AccountModal"
import WishlistModal from "./home/WishlistModal"
import NewOfferModal from "./home/NewOfferModal"
import PremiumModal from "./home/PremiumModal"

export default function HomeView(props) {
  const {
    copy,
    LANGUAGES,
    lang,
    setLang,
    languageOpen,
    setLanguageOpen,
    user,
    router,
    offers = [],
    loading,
    notice,
    placeholder,
    category,
    setCategory,
    have,
    setHave,
    want,
    setWant,
    radius,
    setRadius,
    searchTab,
    setSearchTab,
    searchOpen,
    setSearchOpen,
    visibleListings = [],
    addPhotos,
    photos = [],
    removePhoto,
    form,
    setForm,
    addOffer,
    proposeExchange,
    premiumOpen,
    setPremiumOpen,
    accountOpen,
    setAccountOpen,
    wishlistOpen,
    setWishlistOpen,
    newOfferOpen,
    setNewOfferOpen,
    scrollTo,
    categoriesList = [],
    locationsList = [],
  } = props

  const [heroActive, setHeroActive] = React.useState(null);

  return (
    <main className="site-shell tc-page">
      <SiteHeader
        copy={copy}
        LANGUAGES={LANGUAGES}
        lang={lang}
        setLang={setLang}
        languageOpen={languageOpen}
        setLanguageOpen={setLanguageOpen}
        user={user}
        router={router}
        scrollTo={scrollTo}
        setAccountOpen={setAccountOpen}
        setWishlistOpen={setWishlistOpen}
        setNewOfferOpen={setNewOfferOpen}
      />

      <HeroSection copy={copy} />

      <SearchPanel
        copy={copy}
        searchTab={searchTab}
        setSearchTab={setSearchTab}
        heroActive={heroActive}
        setHeroActive={setHeroActive}
        user={user}
        router={router}
        setNewOfferOpen={setNewOfferOpen}
        category={category}
        setCategory={setCategory}
        categoriesList={categoriesList}
        locationsList={locationsList}
        have={have}
        want={want}
        setWant={setWant}
        radius={radius}
        setRadius={setRadius}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />

      <FeaturedListings
        copy={copy}
        visibleListings={visibleListings}
        setCategory={setCategory}
        proposeExchange={proposeExchange}
      />

      <MatchesSection
        copy={copy}
        visibleListings={visibleListings}
        setCategory={setCategory}
        proposeExchange={proposeExchange}
        loading={loading}
        notice={notice}
      />

      <TrustStrip copy={copy} offers={offers} />

      <BenefitsSection copy={copy} />

      <PremiumTeaser copy={copy} setPremiumOpen={setPremiumOpen} />

      <SiteFooter copy={copy} />

      <AccountModal
        copy={copy}
        user={user}
        offers={offers}
        router={router}
        accountOpen={accountOpen}
        setAccountOpen={setAccountOpen}
        setWishlistOpen={setWishlistOpen}
        setHeroActive={setHeroActive}
      />

      <WishlistModal
        copy={copy}
        wishlistOpen={wishlistOpen}
        setWishlistOpen={setWishlistOpen}
        setAccountOpen={setAccountOpen}
        setNewOfferOpen={setNewOfferOpen}
        setHeroActive={setHeroActive}
      />

      <NewOfferModal
        copy={copy}
        newOfferOpen={newOfferOpen}
        setNewOfferOpen={setNewOfferOpen}
        setWishlistOpen={setWishlistOpen}
        setHeroActive={setHeroActive}
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

      <PremiumModal copy={copy} premiumOpen={premiumOpen} setPremiumOpen={setPremiumOpen} />
    </main>
  )
}
