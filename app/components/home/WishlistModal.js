export default function WishlistModal({
  copy,
  wishlistOpen,
  setWishlistOpen,
  setAccountOpen,
  setNewOfferOpen,
  setHeroActive,
}) {
  if (!wishlistOpen) return null;

  return (
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
  );
}
