export default function NewOfferModal({
  copy,
  newOfferOpen,
  setNewOfferOpen,
  setWishlistOpen,
  setHeroActive,
  addOffer,
  category,
  setCategory,
  categoriesList = [],
  locationsList = [],
  form,
  setForm,
  photos = [],
  addPhotos,
  removePhoto,
  loading,
  notice,
}) {
  if (!newOfferOpen) return null;

  return (
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
              {locationsList.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
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
  );
}
