"use client";

import { supabase } from "@/lib/supabase";

export default function AccountModal({
  copy,
  user,
  offers = [],
  router,
  accountOpen,
  setAccountOpen,
  setWishlistOpen,
  setHeroActive,
}) {
  if (!accountOpen) return null;

  return (
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
  );
}
