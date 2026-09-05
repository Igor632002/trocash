import { SearchIcon } from "@/lib/icons";

export default function SearchPanel({
  copy,
  searchTab,
  setSearchTab,
  heroActive,
  setHeroActive,
  user,
  router,
  setNewOfferOpen,
  category,
  setCategory,
  categoriesList = [],
  locationsList = [],
  have,
  want,
  setWant,
  radius,
  setRadius,
  searchOpen,
  setSearchOpen,
}) {
  return (
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
          {copy?.category || "Categoria"}
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
              {copy?.locality  || "Área:"}
              <select value={radius} onChange={e => setRadius?.(e.target.value)}>
                <option value="">{copy?.selectArea || "Selecione uma localidade"}</option>
                {locationsList.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
              </select>
            </label>
            {/* <label className="filter-label narrow">
              {copy?.distance || "Distância:"}
              <select value={radius} style={{ width: 120 }} onChange={e => setRadius?.(e.target.value)}>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="Algarve">Algarve</option>
              </select>
            </label> */}
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
  );
}
