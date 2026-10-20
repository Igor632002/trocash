"use client";

export default function ListingCard({ offer, index, copy, proposeExchange }) {
  return (
    <article className="listing-card card offer-card">
      <div className="listing-image offer-image-container" style={{ backgroundImage: `url(${offer.image})` }}>
        <span className="offer-badge">{offer.kind === "Serviço" ? "Serviço" : "Troca"}</span>
        <button aria-label={copy?.wishlistAria || "Lista de Desejos"}>♡</button>
      </div>
      <div className="listing-body card-body">
        <small className="offer-location">{offer.area || "Algarve"} · {index + 2} km</small>
        <h3 className="offer-name">{offer.title}</h3>
        <div className="swap-line meta offer-description-box">
          <span className="offer-description-label">{copy?.descriptionLabel || "Descrição"}</span>
          <b className="offer-description">{
            (() => {
              const desc = offer.description || offer.details || "";
              const preview = String(desc).split("\n")[0].trim();
              return preview ? (preview.length > 100 ? preview.slice(0, 100).trim() + "…" : preview) : (copy?.offerDescriptionPlaceholder || offer.wish || "—");
            })()
          }</b>
        </div>

        <div className="swap-line meta offer-description-box">
          <span className="offer-description-label">{copy?.wishLabelShort || copy?.offerWishLabel || "Procura"}</span>
          <b className="offer-description">{offer.wish || copy?.offerWishPlaceholder || "—"}</b>
        </div>
        <button
          className="mini-btn gold-btn offer-button"
          onClick={() => {
            const url = `/offers/${offer.id}`;
            try {
              window.open(url, "_blank", "noopener,noreferrer");
            } catch (e) {
              // fallback for environments without window
              console.warn("Could not open new window", e);
            }
            if (proposeExchange) proposeExchange(offer.id);
          }}>
          {copy?.viewOffer || "Ver troca"}
        </button>
      </div>
    </article>
  );
}
