import { useState } from "react";
import { LogoMark2, Wordmark } from "@/components/LogoMark2";
import { MenuIcon } from "@/components/Icons";

const MENU_LABELS = {
  pt: { open: "Abrir menu", close: "Fechar menu" },
  en: { open: "Open menu", close: "Close menu" },
  uk: { open: "Відкрити меню", close: "Закрити меню" },
};

export default function SiteHeader({
  copy,
  LANGUAGES,
  lang,
  setLang,
  languageOpen,
  setLanguageOpen,
  user,
  hideGuestButtons = false,
  router,
  scrollTo,
  setAccountOpen,
  setWishlistOpen,
  setWishlistReturnTo,
  setNewOfferOpen,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const brandHref = copy?.brandHref ?? `/${lang}`;

  return (
    <header className="topbar tc-nav site-header--teal">
      {/* Повне завантаження: головна та exchange мають різні CSS-набори */}
      <a href={brandHref} className="brand" aria-label="troCASH">
        <span style={{ display: "inline-flex", transform: "translateY(1px)" }}>
          <LogoMark2 />
        </span>
        <Wordmark compact />
      </a>
      <nav className={`desktop-nav ${menuOpen ? "main-nav--open" : ""}`}>
        <button onClick={() => scrollTo && scrollTo("how")}>{copy?.navHow}</button>
        <button onClick={() => { scrollTo && scrollTo("explore"); }}>{copy?.navExplore}</button>
        {!hideGuestButtons && (
          <>
            <button onClick={() => { if (!user) router.push("/auth"); else router.push(`/offers?owner=${user.id}`); }}>
              {copy?.navMine}
            </button>
            <button onClick={() => { setWishlistReturnTo?.(null); setWishlistOpen(true); }}>{copy?.navWish}</button>
            <button onClick={() => router.push("/chat")}>{copy?.navMessages}</button>
          </>
        )}
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
                    setLang && setLang(l.code);
                    setLanguageOpen && setLanguageOpen(false);
                  }}
                  title={l.label}
                >
                  {l.flag}
                </button>
              ))}
            </div>
          )}
        </div>
        {!hideGuestButtons && (
          <>
            <button className="nav-btn" onClick={() => { setWishlistReturnTo?.(null); setWishlistOpen(true); }} aria-label={copy?.wishlistAria || "Lista de Desejos"}>♡</button>
            <button className="light-btn nav-btn" onClick={() => { if (!user) router.push("/auth"); else setNewOfferOpen(true); }}>
              +&nbsp;{copy?.publishOfferButton}
            </button>
          </>
        )}

        {user ? (
          <button className="avatar" onClick={() => setAccountOpen(true)}>
            {(user.email || "U")[0].toUpperCase()}
          </button>
        ) : (
          <button className="light-btn nav-btn" onClick={() => router.push("/auth")}>
            {copy?.login}
          </button>
        )}
        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen
              ? MENU_LABELS[lang]?.close ?? MENU_LABELS.pt.close
              : MENU_LABELS[lang]?.open ?? MENU_LABELS.pt.open
          }
          aria-expanded={menuOpen}
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
