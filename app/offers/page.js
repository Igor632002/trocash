import React from "react";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import OfferActions from "./OfferActions.client";
import demoListings from "@/lib/data/demoListings";
import OwnerOffers from "./OwnerOffers.client";
import PublishButton from "./PublishButton.client";
import OffersNav from "./OffersNav.client";
import { getServerAuthSession } from "@/lib/auth/cookie-server";

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
export default async function OffersPage(props) {
  const spRaw = props?.searchParams;
  const sp = spRaw && typeof spRaw.then === "function" ? await spRaw : spRaw;
  let owner = null;

  if (typeof sp === "string") {
    owner = new URLSearchParams(sp).get("owner") ?? null;
  } else {
    owner = sp?.owner ?? null;
  }
  const session = await getServerAuthSession();

  // If owner query present, render owner view (client component will handle auth)
  if (owner) {
    if (!session?.id) {
      return redirect('/auth');
    }

    if (session.id !== owner) {
      return (
        <main className="site-shell tc-page">
          <header className="topbar tc-nav">
            <a className="logo-button" href="/">
              <Logo />
            </a>
            <OffersNav />
            <div className="top-actions nav-actions quick">
              <PublishButton />
            </div>
          </header>
          <main style={{ padding: 20 }}>
            <h1>Não autorizado</h1>
          </main>
        </main>
      );
    }

    return (
      <main className="site-shell tc-page">
        <header className="topbar tc-nav">
          <a className="logo-button" href="/">
            <Logo />
          </a>
          <OffersNav />
          <div className="top-actions nav-actions quick">
            {/* <a className="nav-btn" href="/offers">Ofertas</a> */}
            <PublishButton />
          </div>
        </header>

        <OwnerOffers ownerId={owner} />

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
  }

  // If no owner query (public /offers), require server-side session and redirect unauthenticated users
  if (!owner && !session?.id) {
    return redirect('/auth');
  }

  try {
    const q = owner
      ? supabase.from("offers").select("*").eq("owner_id", owner).order("created_at", { ascending: false })
      : supabase.from("offers").select("*").neq("status", "pausednjhsre").order("created_at", { ascending: false });
    const { data: offers = [], error } = await q;
    if (error) throw error;

    return (
      <main className="site-shell tc-page">
        <header className="topbar tc-nav">
          <a className="logo-button" href="/">
            <Logo />
          </a>
          <nav className="desktop-nav">
            <a href="/#explore">Explorar</a>
            <a href="/auth">Meu perfil</a>
            <a href="/#premium">Sobre</a>
          </nav>
          <div className="top-actions nav-actions quick">
            <a className="nav-btn" href="/offers">Ofertas</a>
            <PublishButton />
          </div>
        </header>

        <section className="content-section section" style={{ padding: 20 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>{owner ? "Ofertas publicadas" : "Ofertas"}</h1>

            {offers.length === 0 ? (<p>Não há ofertas a mostrar.</p>) : 
            (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {offers.map(o => {
                  const img =
                    o.image_url ||
                    (o.photo_urls && o.photo_urls[0]) ||
                    demoListings[(o.id || "").toString().length % demoListings.length].image;

                  return (
                    <li key={o.id} style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
                      <div className="listing-image" style={{ width: 140, minWidth: 140, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 8 }} />
                      <div style={{ flex: 1 }}>
                        <a href={`/offers/${o.id}`} style={{ color: "#1a73e8", textDecoration: "none" }}>
                          <strong>{o.title || `Oferta ${o.id}`}</strong>
                        </a>
                        <div style={{ color: "#666", marginTop: 6 }}>{o.area} · {o.wish}</div>
                        <div style={{ marginTop: 8 }}>
                          <OfferActions id={o.id} />
                        </div>
                      </div>
                    </li>
                  );
                })}
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