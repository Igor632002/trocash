import Logo from "../Logo";

// Derives the target locale path/host from the current environment (local vs prod domains)
function langToPath(code) {
  const c = (code || "").toLowerCase();
  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  if (c === "pt") return isLocal ? "http://localhost:3000/" : "https://trocash.pt/";
  if (c === "gb" || c === "en") return "/en";
  if (c === "ua" || c === "uk") return "/uk";
  return "/";
}

export default function SiteHeader({
  copy,
  LANGUAGES,
  lang,
  setLang,
  languageOpen,
  setLanguageOpen,
  user,
  router,
  scrollTo,
  setAccountOpen,
  setWishlistOpen,
  setNewOfferOpen,
}) {
  return (
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
  );
}
