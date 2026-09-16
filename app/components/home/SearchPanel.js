import { SearchIcon } from "@/lib/icons";

export default function SearchPanel({
  copy,
  // keep props (some may be unused elsewhere)
  category,
  setCategory,
  categoriesList = [],
  locationsList = [],
  want,
  setWant,
  locationId,
  setLocationId,
  searchOpen,
  setSearchOpen,
  handleSearch,
}) {
  const selectedCategoryLabel = (() => {
    if (!category || category === "" || category === "Todas") return copy?.offersListHeading || "Lista de ofertas";
    const cat = categoriesList.find(c => String(c.id) === String(category));
    const name = cat ? (copy?.categories?.[cat.name] || cat.name) : category;
    return ` ${name} `;
  })();

  const selectedLocationLabel = (() => {
    if (!locationId || locationId === "" || locationId === "Todas") return copy?.allLocations || "de todas as localidades";
    const loc = locationsList.find(l => String(l.id) === String(locationId));
    const name = loc ? loc.name : locationId;
    return ` - ${name} `;
  })();

  const wantPart = want && String(want).trim() ? ` ${String(want).trim()}` : "";
  const searchSummary = `${copy?.offersListHeading || "Lista de ofertas"}: ${selectedCategoryLabel} ${selectedLocationLabel}${wantPart}`;

  return (
    <section id="explore" style={{ border: "1px solid lightgray", marginLeft: "5px", padding: "10px" }} className="search-panel">
      <div className="search-heading">
        <span style={{ marginLeft: "18px", fontSize: "16px", display: "inline-flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
          <b>{copy?.searchTitle || copy?.searchOfferTitle}</b>
        </span>
      </div>
      <br />
      <div className="panel-inner">
        <label className="filter-label">📂 {copy?.category || "Categoria"}
          <select value={category} onChange={e => setCategory?.(e.target.value)}>
            <option value="" disabled>{copy?.selectCategory || "Selecione a categoria"}</option>
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

        <label className="filter-label">🔘 {copy?.locality || "Área:"}
          <select value={locationId} onChange={e => setLocationId?.(e.target.value)}>
            <option value="" disabled>{copy?.selectArea || "Selecione uma localidade"}</option>
            <option value="Todas">{copy?.categories?.Todas || "Todas"}</option>
            {locationsList.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
          </select>
        </label>

        <label className="filter-label"> ✏️{copy?.keyWords || " Palavra‑chave"}
          <input
            value={want}
            onChange={e => setWant?.(e.target.value)}
            placeholder={copy?.offerWishPlaceholder || "Ex.: sofá, câmara, outro serviço..."}
          />
        </label>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn-12ch large gold-btn light-btn nav-btn"
            onClick={() => { handleSearch?.(); setSearchOpen?.(true); }}
          >
            <SearchIcon width={20} height={20} /> {'\u00A0\u00A0'}{copy?.searchButton || "Pesquisar"}
          </button>
        </div>

        {searchOpen && (
          <div style={{ gridColumn: "1 / -1", marginTop: 5, marginBottom: 5, padding: 14, borderRadius: 14, background: "#fff8e9", color: "#765824" }}>
            {searchSummary}
          </div>
        )}
      </div>
    </section>
  );
}
  {/* <label className="filter-label narrow">
              {copy?.distance || "Distância:"}
              <select value={locationId} style={{ width: 120 }} onChange={e => setLocationId?.(e.target.value)}>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="Algarve">Algarve</option>
              </select>
            </label> */}