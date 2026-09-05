export default function HeroSection({ copy }) {
  return (
    <section id="top" className="hero">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div className="hero-content" >
          <br></br>
          <h1 className="hero-title">
            <span>{copy?.hero1}</span>
            <strong>{copy?.hero2}</strong>
          </h1>
          <p className="hero-sub">{copy?.heroSub}</p>

          {/* <div className="dream-pill">{copy?.dream}</div> */}
          <br></br>
          <div className="trust-row">
            <span>◈ <b>{copy?.trustBadge1Title}</b><small>{copy?.trustBadge1Sub}</small></span>
            <span>◌ <b>{copy?.trustBadge2Title}</b><small>{copy?.trustBadge2Sub}</small></span>
            <span>◇ <b>{copy?.trustBadge3Title}</b><small>{copy?.trustBadge3Sub}</small></span>
            <span>⌂ <b>{copy?.trustBadge4Title}</b><small>{copy?.trustBadge4Sub}</small></span>
          </div>
          {/* <div style={{ border: "1px solid blue", margin: "20px 0" }} className="hero-actions">
            <button
              className={heroActive === "explore" ? "gold-btn large btn-centered" : "gold-btn light-btn large nav-btn"}
              onClick={() => { setHeroActive("explore"); scrollTo && scrollTo("explore"); }} >
              <SearchIcon width={20} height={20} />{'\u00A0\u00A0'}
              {copy?.latest_offers}
            </button>

            <button className={searchTab === "Procuro" ? "active" : ""}
              onClick={() => setSearchTab && setSearchTab("Procuro")}  >
              {copy?.want || "Procuro"}
            </button>
            <button className={searchTab === "Tenho" ? "active" : ""}
              onClick={() => setSearchTab && setSearchTab("Tenho")}>
              {copy?.have || "Tenho"}
            </button>
            <button
              className={heroActive === "publish" ? "gold-btn large btn-centered" : "gold-btn light-btn large nav-btn"}
              onClick={() => { setHeroActive("publish"); if (!user) router.push("/auth"); else setNewOfferOpen(true); }} >
              ＋ {copy?.publish}
            </button>

            <button
              className={heroActive === "auto" ? "gold-btn large btn-centered" : "gold-btn light-btn large nav-btn"}
              onClick={() => { setHeroActive("auto"); setSearchOpen && setSearchOpen(true); }}
              style={{ marginLeft: 8 }} >
              ✦ {copy?.autoMatches}
            </button>
         </div> */}

        </div>
      </div>
    </section>
  );
}
