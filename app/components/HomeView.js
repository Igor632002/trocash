"use client"

import React from "react"
import { supabase } from "@/lib/supabase"
import { areas } from "@/lib/constants"
import { fetchCategories } from "@/lib/dal"
import Logo from "./Logo"
import { SearchIcon } from "@/lib/icons"

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
  } = props

  const [heroActive, setHeroActive] = React.useState(null);
  const [categoriesList, setCategoriesList] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await fetchCategories();
        if (mounted) setCategoriesList(cats);
      } catch (err) {
        console.error('fetchCategories failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const langToPath = (code) => {
    const c = (code || "").toLowerCase();
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (c === "pt") return isLocal ? "http://localhost:3000/" : "https://trocash.pt/";
    if (c === "gb" || c === "en") return "/en";
    if (c === "ua" || c === "uk") return "/uk";
    return "/";
  };
  return (
    <main className="site-shell tc-page">
      <header className="topbar tc-nav">
        <button className="logo-button" onClick={() => { scrollTo && scrollTo("top"); }}>
          <Logo />
        </button>
        <nav className="desktop-nav">
          <button onClick={() => scrollTo && scrollTo("how")}>{copy?.navHow}</button>
          <button onClick={() => { scrollTo && scrollTo("explore"); }}>{copy?.navExplore}</button>
          <button onClick={() => { if (!user) router.push("/auth"); else setAccountOpen(true); }}>{copy?.navMine}</button>
          <button onClick={() => setWishlistOpen(true)}>{copy?.navWish}</button>
          <button onClick={() => scrollTo && scrollTo("trust")}>{copy?.navMessages}</button>
          <button onClick={() => scrollTo && scrollTo("premium")}>{copy?.navAbout}</button>
        </nav>
        <div className="top-actions nav-actions quick">
          <div style={{ position: "relative" }}>
            <button className="nav-btn" onClick={() => setLanguageOpen && setLanguageOpen(v => !v)} aria-label="Idioma">
              {LANGUAGES?.find(x => x.code === lang)?.flag}
            </button>
            {languageOpen && (
              <div className="language-menu">
                {LANGUAGES?.map(l => (
                  <button
                    key={l.code}
                    className={"flag-btn " + (lang === l.code ? "active" : "")}

                    onClick={() => {
                      const path = langToPath(l.code);
                      setLang && setLang(l.code);
                      setLanguageOpen && setLanguageOpen(false);
                      if (typeof path === "string" && path.startsWith("http")) {
                        window.location.href = path;
                      } else if (router && router.push) {
                        router.push(path);
                      } else {
                        window.location.href = path;
                      }
                    }}
                    title={l.label}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="nav-btn" onClick={() => setWishlistOpen(true)} aria-label={copy?.wishlistAria || "Lista de Desejos"}>♡</button>
          {user ? (
            <button className="avatar" onClick={() => setAccountOpen(true)}>
              {(user.email || "U")[0].toUpperCase()}
            </button>
          ) : (
            <button className="ghost-btn" onClick={() => router.push("/auth")}>Entrar</button>
          )}
          <button className="gold-btn" onClick={() => { if (!user) router.push("/auth"); else setNewOfferOpen(true); }}>
            ＋ {copy?.publish}
          </button>
        </div>
      </header>
      {/* --- HERO --- */}
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

      {/* --- SEARCH PANEL --- */}
      <section id="explore" style={{ border: "1px solid lightgray" }} className={`search-panel ${searchTab === "Tenho" ? "have" : "want"}`} >
        <div className="hero-actions">
          <button
            className={(searchTab === "Procuro" && heroActive !== "publish") ? "gold-btn large btn-centered" : "gold-btn light-btn large nav-btn"}
            onClick={() => { setSearchTab && setSearchTab("Procuro"); setHeroActive && setHeroActive(null); }}
          >
            <SearchIcon width={20} height={20} />{'\u00A0\u00A0'}
            {copy?.want || "Procuro"}
          </button>

          <button
            className={(searchTab === "Tenho" && heroActive !== "publish") ? "gold-btn large btn-centered" : "gold-btn light-btn large nav-btn"}
            onClick={() => { setSearchTab && setSearchTab("Tenho"); setHeroActive && setHeroActive(null); }}
          >
            {copy?.have || "Tenho"}
          </button>
          <button
            className={heroActive === "publish" ? "gold-btn large btn-centered" : "gold-btn light-btn large nav-btn"}
            onClick={() => {
              if (!user) router.push("/auth");
              else {
                setNewOfferOpen(true);
                setHeroActive && setHeroActive("publish");
              }
            }}
          >
            ＋ {copy?.publish}
          </button>
        </div>
        {/* 1. ЗАГОЛОВОК */}
        <br></br>
        <div className="search-heading">
          <span style={{ marginLeft: "18px", fontSize: "16px", display: "inline-flex", gap: 8, alignItems: "baseline", whiteSpace: "nowrap" }}>
            <b>{searchTab === "Procuro" ? copy?.searchTitle : copy?.searchOfferTitle}</b>
            <span style={{ fontSize: "14px" }}>
              {searchTab === "Procuro"
                ? (copy?.searchSub || "Encontra uma troca que faça sentido para ti")
                : (copy?.offerSub || "Veja os itens ou serviços que você oferece")}
            </span>
          </span>
        </div>
        <br></br>
        <div className="panel-inner">
          {/* 2. СПІЛЬНІ ФІЛЬТРИ (Категорія присутня в обох табах) */}
          <label className="filter-label">
            {copy?.category || "Категорія:"}
            <select
              value={category}
              onChange={e => setCategory?.(e.target.value)}
            >
              <option value="" disabled>{copy?.selectCategory || "Оберіть категорію"}</option>
              <option value="Todas">{copy?.categories?.Todas || "Todas"}</option>
              {categoriesList
                .filter(c => c.name !== "Todas" && c.name !== "Todos")
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {copy?.categories?.[c.name] || c.name}
                  </option>
                ))}
            </select>
          </label>

          {/* 3. УНІКАЛЬНІ ФІЛЬТРИ (Я хочу / Відстань) */}
          {/* Показуємо ці поля, коли вкладка НЕ "Tenho" (тобто "Procuro" або інша) */}
          {searchTab !== "Tenho" && (
            <>
              <label className="filter-label">
                {copy?.want || "Я хочу"}
                <input
                  value={want}
                  onChange={e => setWant?.(e.target.value)}
                  placeholder={copy?.offerWishPlaceholder || "Ex.: sofá, câmara, outro serviço..."}
                />
              </label>
              <label className="filter-label">
                {copy?.area || "Населений пункт:"}
                <select value={radius} onChange={e => setRadius?.(e.target.value)}>
                  <option value="">Оберіть населений пункт</option>
                  {areas.map(a => (<option key={a} value={a}>{a}</option>))}
                </select>
              </label>
              <label className="filter-label narrow">
                {copy?.distance || "Відстань:"}
                <select value={radius} style={{ width: 120 }} onChange={e => setRadius?.(e.target.value)}>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="Algarve">Algarve</option>
                </select>
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* 4. КНОПКА ПОШУКУ */}
                <button
                  className={`btn-12ch large ${searchTab === "Procuro"
                    ? "active gold-btn btn-centered"
                    : "gold-btn light-btn nav-btn"
                    }`}
                  onClick={() => setSearchOpen?.(true)}  >
                  <SearchIcon width={20} height={20} />{'\u00A0\u00A0'}
                  {copy?.searchButton || "Pesquisar"}
                </button>

                {/* 5. КНОПКА АВТО ПОШУКУ  */}
                <button
                  className={`btn-12ch large ${searchTab === "Procuro"
                    ? "active gold-btn btn-centered"
                    : "gold-btn light-btn nav-btn"
                    }`}

                  onClick={() => {
                    setHeroActive("auto"); setSearchOpen && setSearchOpen(true);
                  }}   >
                  ✦ {copy?.autoMatches}
                </button>
              </div>
            </>
          )}

          {/* 6. ТЕКСТ ПІСЛЯ КНОПОК ЗБІГІВ */}
          {searchOpen && (
            <div
              // Краще винести ці стилі в окремий клас, наприклад, className="smart-matches-alert"
              style={{ gridColumn: "1 / -1", marginTop: 14, padding: 14, borderRadius: 14, background: "#fff8e9", color: "#765824" }}
            >
              {copy?.smartMatches
                ?.replace("{have}", have || copy?.have || "Tenho")
                .replace("{want}", want || copy?.want || "Procuro")}
            </div>
          )}
        </div>
      </section>

      {/* --- Featured  / CARDS --- */}
      <section className="content-section section" id="SelectedListings">
        <div className="section-head section-title">
          <div>
            <span className="eyebrow gold-label">Featured</span>
            <h2>{copy?.matches} ✦</h2>
            <p>O sistema aproxima pessoas com desejos compatíveis.</p>
          </div>
          <button className="text-btn" onClick={() => setCategory && setCategory("")}>{copy?.viewAll || "Ver todas →"}</button>
        </div>

        <div className="listing-grid cards">
          {visibleListings.map((o, i) => (
            <article className="listing-card card" key={o.id || i}>
              <div className="listing-image" style={{ backgroundImage: `url(${o.image})` }}>
                <span>{o.kind === "Serviço" ? "Serviço" : "Troca"}</span>
                <button aria-label={copy?.wishlistAria || "Lista de Desejos"}>♡</button>
              </div>
              <div className="listing-body card-body">
                <small>{o.area || "Algarve"} · {i + 2} km</small>
                <h3>{o.title}</h3>
                <div className="swap-line meta">
                  <span>Oferece</span> <b>{o.wish || "algo que procuras"}</b>
                </div>
                <button className="mini-btn gold-btn" onClick={() => proposeExchange && proposeExchange(o.id)}>Ver troca</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* --- MATCHES / CARDS --- */}
      <section className="content-section section" id="matches">
        <div className="section-head section-title">
          <div>
            <span className="eyebrow gold-label">SMART MATCHES</span>
            <h2>{copy?.matches} ✦</h2>
            <p>O sistema aproxima pessoas com desejos compatíveis.</p>
          </div>
          <button className="text-btn" onClick={() => setCategory && setCategory("")}>{copy?.viewAll || "Ver todas →"}</button>
        </div>

        <div className="listing-grid cards">
          {visibleListings.map((o, i) => (
            <article className="listing-card card" key={o.id || i}>
              <div className="listing-image" style={{ backgroundImage: `url(${o.image})` }}>
                <span>{o.kind === "Serviço" ? "Serviço" : "Troca"}</span>
                <button aria-label={copy?.wishlistAria || "Lista de Desejos"}>♡</button>
              </div>
              <div className="listing-body card-body">
                <small>{o.area || "Algarve"} · {i + 2} km</small>
                <h3>{o.title}</h3>
                <div className="swap-line meta">
                  <span>Oferece</span> <b>{o.wish || "algo que procuras"}</b>
                </div>
                <button className="mini-btn gold-btn" onClick={() => proposeExchange && proposeExchange(o.id)}>Ver troca</button>
              </div>
            </article>
          ))}
        </div>

        {loading && <div className="soft-notice">A actualizar ofertas…</div>}
        {notice && <div className="soft-notice">{notice}</div>}
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip" id="trust">
        <div className="trust-lead">
          <div className="trust-icon">◎</div>
          <div>
            <h3>{copy?.trust}</h3>
            <p>{copy?.trustLong}</p>
            <small className="slogan-note">{copy?.slogan2}</small>
          </div>
        </div>
        <div className="metric"><b>{offers.length || "—"}</b><span>ofertas reais</span></div>
        <div className="metric"><b>100%</b><span>foco local</span></div>
        <div className="metric"><b>4,9/5</b><span>meta de comunidade</span></div>
      </section>

      {/* BENEFITS */}
      <section className="benefits" id="how">
        <div><span>✓</span><b>{copy?.verificationTitle}</b><small>{copy?.verificationSub}</small></div>
        <div><span>↔</span><b>{copy?.noMoneyTitle}</b><small>{copy?.noMoneySub}</small></div>
        <div><span>◎</span><b>{copy?.supportTitle}</b><small>{copy?.supportSub}</small></div>
        <div><span>⌁</span><b>{copy?.privacyTitle}</b><small>{copy?.privacySub}</small></div>
      </section>

      {/* PREMIUM */}
      <section className="premium" id="premium">
        <div>
          <span className="premium-badge">{copy?.premium || copy?.footerTroCASH}</span>
          <h2>{copy?.premiumHeading}</h2>
          <p>{copy?.premiumSub}</p>
        </div>
        <div className="premium-price">
          <b>{copy?.premiumPriceLabel?.split(" ")[0] || copy?.premiumPriceLabel}</b><span>{copy?.premiumPriceLabel?.replace(/^[^\s]+\s*/, "") || ""}</span>
          <button className="gold-btn" onClick={() => setPremiumOpen && setPremiumOpen(true)}>{copy?.premiumButton}</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <Logo compact />
          <p>{copy?.footerLine1}</p>
          <small>{copy?.footerLine2}</small>
          <small>{copy?.footerLine3}</small>
        </div>
        <div><b>{copy?.footerTroCASH}</b><button>{copy?.footerAbout}</button><button>{copy?.footerHow}</button><button>{copy?.footerRules}</button></div>
        <div><b>{copy?.footerSupportTitle}</b><button>{copy?.footerSupportHelp}</button><button>{copy?.footerSupportSecurity}</button><button>{copy?.footerSupportPrivacy}</button></div>
        <div><b>{copy?.footerCommunityTitle}</b>{(copy?.footerCommunityItems || "").split("|").map((x, i) => (<button key={i}>{x}</button>))}</div>
        <div className="footer-news">
          <b>{copy?.footerNewsTitle}</b>
          <p>{copy?.footerNewsSub}</p>
          <div><input placeholder={copy?.footerNewsTitle || "Your email"} /><button className="gold-btn">→</button></div>
        </div>
      </footer>
      <div className="copyright">© 2026 {copy?.footerTroCASH} · Algarve, Portugal <span>Comunidade · Confiança · Liberdade</span></div>

      {/* MODALS & DRAWERS */}
      {
        accountOpen && (
          <div className="panel modal-backdrop" onClick={() => { setAccountOpen(false); setHeroActive(null); }}>
            <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-head">
                <h2>{copy?.accountModalTitle || "Meu perfil"}</h2>
                <button className="close modal-close" onClick={() => { setAccountOpen(false); setHeroActive(null); }}>×</button>
              </div>
              <div className="account-hero">
                <div className="avatar">{(user?.email || "T")[0].toUpperCase()}</div>
                <h3 style={{ margin: "12px 0 4px" }}>{copy?.accountTitle || "O teu espaço no troCASH"}</h3>
                <small>{user?.email || copy?.accountSubtitle || "Perfil, ofertas, trocas e preferências."}</small>
              </div>
              <div className="account-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
                <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                  <strong>{offers.filter(o => o.owner_id === user?.id).length}</strong>
                  <div>
                    <a
                      href={user?.id ? `/offers?owner=${user.id}` : '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        setAccountOpen(false);
                        setHeroActive(null);
                        if (user?.id) {
                          if (router && router.push) router.push(`/offers?owner=${user.id}`);
                          else window.location.href = `/offers?owner=${user.id}`;
                        }
                      }}
                      style={{ color: '#1a73e8', textDecoration: 'underline' }}
                    >
                      {copy?.accountOffersLabel || "Ofertas publicadas"}
                    </a>
                  </div>
                </div>
                <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                  <strong>0</strong>
                  <div>{copy?.accountExchangesLabel || "Trocas concluídas"}</div>
                </div>
              </div>
              <button className="nav-btn gold-btn" style={{ width: "100%", marginTop: 18 }} onClick={() => { setAccountOpen(false); setWishlistOpen(true); setHeroActive(null); }}>
                {copy?.accountOpenWishlist || "Abrir Desejos →"}
              </button>

              <button
                className="nav-btn ghost-btn"
                style={{ width: "100%", marginTop: 10 }}
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch (err) {
                    console.error('Sign out error', err);
                  } finally {
                    setAccountOpen(false);
                    setHeroActive(null);
                    window.location.reload();
                  }
                }}
              >
                {copy?.signOut || "Sair"}
              </button>
            </aside>
          </div>
        )
      }
      {
        wishlistOpen && (
          <div className="panel modal-backdrop" onClick={() => { setWishlistOpen(false); setHeroActive(null); }}>
            <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-head">
                <h2>{copy?.wishlistTitle || "Lista de Desejos"}</h2>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="close modal-close" onClick={() => { setWishlistOpen(false); setAccountOpen(true); setHeroActive(null); }}>←</button>
                  <button className="close modal-close" onClick={() => { setWishlistOpen(false); setHeroActive(null); }}>×</button>
                </div>
              </div>


              <p style={{ color: "#7b8494" }}>{copy?.wishlistDescription || "Guarda aquilo que queres encontrar através de uma troca."}</p>
              {["Bicicleta urbana", "Sofá pequeno", "Câmara fotográfica"].map((x, i) => (
                <div className="wish-item" key={x} style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0" }}>
                  <div className="wish-icon">♡</div>
                  <div>
                    <strong>{x}</strong>
                    <div className="meta">{i === 0 ? "Faro" : i === 1 ? "Loulé" : "Albufeira"} · Procurar troca</div>
                  </div>
                </div>
              ))}
              <button className="gold-btn" style={{ marginTop: 22, width: "100%" }} onClick={() => { setWishlistOpen(false); setNewOfferOpen(true); setHeroActive(null); }}>
                {copy?.wishlistAddButton || "Adicionar desejo +"}
              </button>
            </aside>
          </div>
        )
      }

      {
        newOfferOpen && (
          <div className="panel modal-backdrop" onClick={() => { setNewOfferOpen(false); setHeroActive(null); }}>
            <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-head">
                <h2>{copy?.newOfferTitle || "Criar oferta"}</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className="close modal-close"
                    onClick={() => {
                      setNewOfferOpen(false);
                      setWishlistOpen(true);
                      setHeroActive(null);
                    }}
                  >←</button>
                  <button className="close modal-close" onClick={() => { setNewOfferOpen(false); setHeroActive(null); }}>×</button>
                </div>
              </div>
              <form className="offer-form" onSubmit={addOffer}>
                <div className="field">
                  <label>{copy?.categoryLabel || "Categoria"}</label>
                  <select value={category} onChange={e => setCategory && setCategory(e.target.value)}>
                    {categoriesList
                      .filter(c => c.name !== "Todas" && c.name !== "Todos")
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {copy?.categories?.[c.name] || c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="field">
                  <label>{copy?.offerTitleLabel || "Título do anúncio"}</label>
                  <input
                    placeholder={copy?.offerTitlePlaceholder || "Ex.: calças, bicicleta, aulas..."}
                    value={form?.title || ""}
                    onChange={e => setForm && setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>{copy?.areaLabel || "Área"}</label>
                  <select value={form?.area} onChange={e => setForm && setForm({ ...form, area: e.target.value })}>
                    {areas.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>{copy?.offerWishLabel || "O que procuras em troca?"}</label>
                  <input
                    placeholder={copy?.offerWishPlaceholder || "Ex.: sofá, câmara, outro serviço..."}
                    value={form?.wish || ""}
                    onChange={e => setForm && setForm({ ...form, wish: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>{copy?.descriptionLabel || "Descrição"}</label>
                  <textarea
                    placeholder={copy?.offerDescriptionPlaceholder || "Conta um pouco mais sobre a tua oferta..."}
                    value={form?.description || ""}
                    onChange={e => setForm && setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#586174", marginBottom: 7 }}>{copy?.photosLabel || "Fotografias"}</label>
                  <div className="upload-box">
                    <input id="offer-photo" type="file" accept="image/*" multiple onChange={addPhotos} hidden />
                    <label htmlFor="offer-photo" className="upload-label gold-btn" style={{ display: "inline-block", cursor: "pointer", padding: "6px 12px" }}>
                      ＋ {copy?.addPhotosLabel || "Adicionar fotografias"}
                    </label>
                    {photos.length > 0 && (
                      <div className="photo-list" style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        {photos.map((p, i) => (
                          <div key={i} style={{ position: "relative", width: 60, height: 60, borderRadius: 6, overflow: "hidden" }}>
                            <img className="photo-thumb" src={p.preview || p.url} alt={p.name || ("photo-" + i)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            {removePhoto && (
                              <button type="button" onClick={() => removePhoto(i)} style={{
                                position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff",
                                border: "none", borderRadius: 12, width: 20, height: 20, cursor: "pointer", lineHeight: "18px", padding: 0
                              }}>×</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button className="gold-btn large" style={{ width: "100%", marginTop: 14 }} disabled={loading}>
                  {loading ? copy?.publishing || "A publicar…" : copy?.publishOfferButton || "Publicar oferta →"}
                </button>
                <div style={{ marginTop: 12 }}>
                  {notice && (
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        background: (String(notice).toLowerCase().includes("ok") || String(notice).toLowerCase().includes("added") || String(notice).toLowerCase().includes("publicad") || String(notice).toLowerCase().includes("publicado") || String(notice).toLowerCase().includes("sucesso")) ? "#d4edda" : "#f8d7da",
                        color: (String(notice).toLowerCase().includes("ok") || String(notice).toLowerCase().includes("added") || String(notice).toLowerCase().includes("publicad") || String(notice).toLowerCase().includes("publicado") || String(notice).toLowerCase().includes("sucesso")) ? "#155724" : "#721c24",
                      }}
                    >
                      {notice}
                    </div>
                  )}
                </div>
              </form>
            </aside>
          </div>
        )
      }

      {
        premiumOpen && (
          <div className="modal-backdrop" onClick={() => setPremiumOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setPremiumOpen(false)}>×</button>
              <span className="premium-badge">{copy?.premium || copy?.footerTroCASH}</span>
              <h2>{copy?.premiumModalHeading}</h2>
              <p>{copy?.premiumModalBody}</p>
              <ul>
                {(copy?.premiumModalList || "").split("|").map((it, i) => (<li key={i}>{it}</li>))}
              </ul>
              <button className="gold-btn large" onClick={() => setPremiumOpen(false)}>{copy?.premiumButton || "Continuar →"}</button>
            </div>
          </div>
        )
      }
    </main >
  )
}
