import React from "react";
import { supabase } from "@/lib/supabase";

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
  );
}

export default async function OffersPage({ searchParams }) {
  const owner = searchParams?.owner || null;

  try {
    const q = owner
      ? supabase.from("offers").select("*").eq("owner_id", owner).order("created_at", { ascending: false })
      : supabase.from("offers").select("*").order("created_at", { ascending: false });

    const { data: offers = [], error } = await q;
    if (error) throw error;

    return (
      <main className="site-shell tc-page">
        <header className="topbar tc-nav">
          <a className="logo-button" href="/">
            <Logo />
          </a>
          <nav className="desktop-nav">
            <a href="/#explore">{`Explorar`}</a>
            <a href="/auth">{`Meu perfil`}</a>
            <a href="/#premium">{`Sobre`}</a>
          </nav>
          <div className="top-actions nav-actions quick">
            <a className="nav-btn" href="/offers">Ofertas</a>
            <a className="nav-btn" href="/auth">Entrar</a>
            <a className="gold-btn" href="/auth">＋ Publicar</a>
          </div>
        </header>

        <section className="content-section section" style={{ padding: 20 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>{owner ? "Ofertas publicadas" : "Ofertas"}</h1>

            {offers.length === 0 ? (
              <p>Não há ofertas a mostrar.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {offers.map(o => (
                  <li key={o.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    <a href={`/offers/${o.id}`} style={{ color: "#1a73e8", textDecoration: "none" }}>
                      <strong>{o.title || `Oferta ${o.id}`}</strong>
                    </a>
                    <div style={{ color: "#666", marginTop: 6 }}>{o.area} · {o.wish}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <footer className="footer">
          <div>
            <Logo compact />
            <p>Troca de coisas e serviços no Algarve.</p>
            <small>Comunidade · Confiança · Liberdade</small>
          </div>
          <div><b>Ajuda</b><a href="/">Sobre</a><a href="/">Como funciona</a></div>
        </footer>
        <div className="copyright">© 2026 troCASH · Algarve, Portugal</div>
      </main>
    );
  } catch (err) {
    console.error("Offers fetch error", err);
    return (
      <main className="site-shell tc-page" style={{ padding: 20 }}>
        <h1>Ofertas</h1>
        <p>Erro ao carregar ofertas. Verifique os logs do servidor.</p>
      </main>
    );
  }
}