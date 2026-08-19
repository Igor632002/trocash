"use client"

import React from "react"
import { supabase } from "@/lib/supabase"
import { CATEGORIES, areas } from "@/lib/constants"

function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`} aria-label="troCASH">
      <svg className="brand-mark" viewBox="0 0 100 72" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="goldLogo" x1="0" x2="1">
            <stop offset="0" stopColor="#C58A20" />
            <stop offset="0.5" stopColor="#F2D08A" />
            <stop offset="1" stopColor="#B87810" />
          </linearGradient>
        </defs>
        <circle cx="25" cy="12" r="5.5" fill="url(#goldLogo)" />
        <circle cx="75" cy="12" r="5.5" fill="url(#goldLogo)" />
        <path
          d="M47 35 C36 18, 10 18, 10 36 C10 54, 36 54, 50 36 C64 18, 90 18, 90 36 C90 54, 64 54, 50 36 C36 18, 10 18, 10 36"
          fill="none"
          stroke="url(#goldLogo)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <div className="brand-wordmark">
        <span>tro</span><b>CASH</b>
        <small>JUNTOS CRIAMOS VALOR.</small>
      </div>
    </div>
  )
}

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

  return (
    <main className="site-shell tc-page">
      <header className="topbar tc-nav">
        <button className="logo-button" onClick={() => { scrollTo && scrollTo("top"); }}>
          <Logo />
        </button>

        <nav className="desktop-nav">
          <button onClick={() => { scrollTo && scrollTo("explore"); }}>{copy?.navExplore}</button>
          <button onClick={() => { if (!user) router.push("/auth"); else setAccountOpen(true); }}>{copy?.navMine}</button>
          <button onClick={() => setWishlistOpen(true)}>{copy?.navWish}</button>
          <button onClick={() => scrollTo && scrollTo("trust")}>{copy?.navMessages}</button>
          <button onClick={() => scrollTo && scrollTo("how")}>{copy?.navHow}</button>
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
                    onClick={() => { setLang && setLang(l.code); setLanguageOpen && setLanguageOpen(false); }}
                    title={l.label}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="nav-btn" onClick={() => setWishlistOpen(true)} aria-label="Wish List">♡</button>

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
          <div className="hero-content">
            <div className="eyebrow">{copy?.hero1}</div>
            <h1 className="hero-title">
              <span>{copy?.hero1}</span>
              <strong>{copy?.hero2}</strong>
            </h1>
            <p className="hero-sub">{copy?.heroSub}</p>

            <div className="hero-actions">
              <button className="gold-btn large" onClick={() => scrollTo && scrollTo("explore")}>
                {copy?.explore} →
              </button>
              <button
                className="light-btn large nav-btn"
                onClick={() => { if (!user) router.push("/auth"); else setNewOfferOpen(true); }}
              >
                {copy?.publish} ＋
              </button>
            </div>

            <div className="dream-pill">{copy?.dream}</div>

            <div className="trust-row">
              <span>◈ <b>Seguro</b><small>Verificado</small></span>
              <span>◌ <b>Comunidade</b><small>Confiável</small></span>
              <span>◇ <b>Sustentável</b><small>Consciente</small></span>
              <span>⌂ <b>Local</b><small>Algarve</small></span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEARCH PANEL --- */}
      <section className="search-panel" id="explore">
        <div className="search-heading">
          <b>{copy?.searchTitle}</b>
          <span>Encontra uma troca que faça sentido para ti.</span>
        </div>

        <div className="search-tabs">
          <button className={searchTab === "Tenho" ? "active" : ""} onClick={() => setSearchTab && setSearchTab("Tenho")}>Tenho</button>
          <button className={searchTab === "Procuro" ? "active" : ""} onClick={() => setSearchTab && setSearchTab("Procuro")}>Procuro</button>
        </div>

        <label>
          {copy?.have}
          <select value={category} onChange={e => setCategory && setCategory(e.target.value)}>
            {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label>
          {copy?.want}
          <input value={want} onChange={e => setWant && setWant(e.target.value)} placeholder={placeholder} />
        </label>

        <label>
          {copy?.distance}
          <select value={radius} onChange={e => setRadius && setRadius(e.target.value)}>
            <option>5 km</option>
            <option>10 km</option>
            <option>25 km</option>
            <option>50 km</option>
            <option>Algarve</option>
          </select>
        </label>

        <button className="search-btn" aria-label="Pesquisar" onClick={() => setSearchOpen && setSearchOpen(true)}>⌕</button>

        {searchOpen && (
          <div style={{ gridColumn: "1 / -1", marginTop: 14, padding: 14, borderRadius: 14, background: "#fff8e9", color: "#765824" }}>
            Smart Matches: a pesquisar trocas compatíveis para <strong>{have || "o que tens"}</strong> → <strong>{want || "o que procuras"}</strong>.
          </div>
        )}
      </section>

      {/* --- MATCHES / CARDS --- */}
      <section className="content-section section" id="matches">
        <div className="section-head section-title">
          <div>
            <span className="eyebrow gold-label">SMART MATCHES</span>
            <h2>{copy?.matches} ✦</h2>
            <p>O sistema aproxima pessoas com desejos compatíveis.</p>
          </div>
          <button className="text-btn" onClick={() => setCategory && setCategory("Todas")}>Ver todas →</button>
        </div>

        <div className="listing-grid cards">
          {visibleListings.map((o, i) => (
            <article className="listing-card card" key={o.id || i}>
              <div className="listing-image" style={{ backgroundImage: `url(${o.image})` }}>
                <span>{o.kind === "Serviço" ? "Serviço" : "Troca"}</span>
                <button aria-label="Wishlist">♡</button>
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
        <div><span>✓</span><b>Verificação de membros</b><small>Mais segurança para todos.</small></div>
        <div><span>↔</span><b>Sem dinheiro entre membros</b><small>Troca valor por valor.</small></div>
        <div><span>◎</span><b>Suporte dedicado</b><small>Ajuda quando precisares.</small></div>
        <div><span>⌁</span><b>Privacidade</b><small>Os teus dados protegidos.</small></div>
      </section>

      {/* PREMIUM */} 
      <section className="premium" id="premium">
        <div>
          <span className="premium-badge">troCASH PREMIUM</span>
          <h2>Mais oportunidades. Menos esforço.</h2>
          <p>Destaca as tuas ofertas, encontra correspondências mais depressa e navega sem distrações.</p>
        </div>
        <div className="premium-price">
          <b>€4,99</b><span>/ mês</span>
          <button className="gold-btn" onClick={() => setPremiumOpen && setPremiumOpen(true)}>Quero Premium</button>
        </div>
      </section>

      {/* FOOTER */} 
      <footer className="footer">
        <div>
          <Logo compact />
          <p>Swap more. Keep your cash.</p>
          <small>Realiza os teus sonhos a custo 0.</small>
          <small>Exchange more. Spend less. Live more.</small>
        </div>
        <div><b>troCASH</b><button>Sobre nós</button><button>Como funciona</button><button>Regras da comunidade</button></div>
        <div><b>Suporte</b><button>Centro de ajuda</button><button>Segurança</button><button>Privacidade</button></div>
        <div><b>Comunidade</b><button>Sustentabilidade</button><button>Dicas e artigos</button><button>Eventos locais</button></div>
        <div className="footer-news">
          <b>Recebe novidades</b>
          <p>Ideias para trocar melhor, gastar menos e viver mais.</p>
          <div><input placeholder="O teu email" /><button className="gold-btn">→</button></div>
        </div>
      </footer>
      <div className="copyright">© 2026 troCASH · Algarve, Portugal <span>Comunidade · Confiança · Liberdade</span></div>

      {/* MODALS & DRAWERS */}
      {accountOpen && (
        <div className="panel modal-backdrop" onClick={() => setAccountOpen(false)}>
          <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>Meu perfil</h2>
              <button className="close modal-close" onClick={() => setAccountOpen(false)}>×</button>
            </div>
            <div className="account-hero">
              <div className="avatar">{(user?.email || "T")[0].toUpperCase()}</div>
              <h3 style={{ margin: "12px 0 4px" }}>O teu espaço no troCASH</h3>
              <small>{user?.email || "Perfil, ofertas, trocas e preferências."}</small>
            </div>
            <div className="account-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
              <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                <strong>{offers.filter(o => o.owner_id === user?.id).length}</strong>
                <div>Ofertas publicadas</div>
              </div>
              <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                <strong>0</strong>
                <div>Trocas concluídas</div>
              </div>
            </div>
            <button className="nav-btn gold-btn" style={{ width: "100%", marginTop: 18 }} onClick={() => { setAccountOpen(false); setWishlistOpen(true); }}>
              Abrir Wish List →
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
                  window.location.reload();
                }
              }}
            >
              Sair
            </button>
          </aside>
        </div>
      )}

      {wishlistOpen && (
        <div className="panel modal-backdrop" onClick={() => setWishlistOpen(false)}>
          <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>Wish List</h2>
              <button className="close modal-close" onClick={() => setWishlistOpen(false)}>×</button>
            </div>
            <p style={{ color: "#7b8494" }}>Guarda aquilo que queres encontrar através de uma troca.</p>
            {["Bicicleta urbana", "Sofá pequeno", "Câmara fotográfica"].map((x, i) => (
              <div className="wish-item" key={x} style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0" }}>
                <div className="wish-icon">♡</div>
                <div>
                  <strong>{x}</strong>
                  <div className="meta">{i === 0 ? "Faro" : i === 1 ? "Loulé" : "Albufeira"} · Procurar troca</div>
                </div>
              </div>
            ))}
            <button className="gold-btn" style={{ marginTop: 22, width: "100%" }} onClick={() => { setWishlistOpen(false); setNewOfferOpen(true); }}>
              Adicionar desejo +
            </button>
          </aside>
        </div>
      )}

      {newOfferOpen && (
        <div className="panel modal-backdrop" onClick={() => setNewOfferOpen(false)}>
          <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>Criar oferta</h2>
              <button className="close modal-close" onClick={() => setNewOfferOpen(false)}>×</button>
            </div>
            <form className="offer-form" onSubmit={addOffer}>
              <div className="field">
                <label>Categoria</label>
                <select value={category} onChange={e => setCategory && setCategory(e.target.value)}>
                  {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Título do anúncio</label>
                <input
                  placeholder="Ex.: calças, bicicleta, aulas..."
                  value={form?.title || ""}
                  onChange={e => setForm && setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Área</label>
                <select value={form?.area} onChange={e => setForm && setForm({ ...form, area: e.target.value })}>
                  {areas.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label>O que procuras em troca?</label>
                <input
                  placeholder="Ex.: sofá, câmara, outro serviço..."
                  value={form?.wish || ""}
                  onChange={e => setForm && setForm({ ...form, wish: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Descrição</label>
                <textarea
                  placeholder="Conta um pouco mais sobre a tua oferta..."
                  value={form?.description || ""}
                  onChange={e => setForm && setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#586174", marginBottom: 7 }}>Fotografias</label>
                <div className="upload-box">
                  <input id="offer-photo" type="file" accept="image/*" multiple onChange={addPhotos} hidden />
                  <label htmlFor="offer-photo" className="upload-label gold-btn" style={{ display: "inline-block", cursor: "pointer", padding: "6px 12px" }}>
                    ＋ Adicionar fotografias
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
                {loading ? "A publicar…" : "Publicar oferta →"}
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
      )}

      {premiumOpen && (
        <div className="modal-backdrop" onClick={() => setPremiumOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPremiumOpen(false)}>×</button>
            <span className="premium-badge">troCASH PREMIUM</span>
            <h2>Mais trocas. Menos gastos.</h2>
            <p>O preço de €4,99/mês foi desenhado para ser simples e transparente. A ligação ao pagamento será ativada quando o checkout estiver ligado ao teu MB WAY.</p>
            <ul>
              <li>Ofertas destacadas</li>
              <li>Correspondências prioritárias</li>
              <li>Sem publicidade</li>
              <li>Suporte prioritário</li>
            </ul>
            <button className="gold-btn large" onClick={() => setPremiumOpen(false)}>Continuar →</button>
          </div>
        </div>
      )}
    </main>
  )
}