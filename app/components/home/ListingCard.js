"use client";

export default function ListingCard({ offer, index, copy, proposeExchange }) {
  return (
    <article className="listing-card card">
      <div className="listing-image" style={{ backgroundImage: `url(${offer.image})` }}>
        <span>{offer.kind === "Serviço" ? "Serviço" : "Troca"}</span>
        <button aria-label={copy?.wishlistAria || "Lista de Desejos"}>♡</button>
      </div>
      <div className="listing-body card-body">
        <small>{offer.area || "Algarve"} · {index + 2} km</small>
        <h3>{offer.title}</h3>
        <div className="swap-line meta">
          <span>Oferece</span> <b>{offer.wish || "algo que procuras"}</b>
        </div>
        <button
          className="mini-btn gold-btn"
          onClick={() => {
            const url = `/offers/${offer.id}`;
            try {
              window.open(url, "_blank", "noopener,noreferrer");
            } catch (e) {
              // fallback for environments without window
              console.warn("Could not open new window", e);
            }
            if (proposeExchange) proposeExchange(offer.id);
          }}
        >
          {copy?.viewOffer || "Ver troca"}
        </button>
      </div>
    </article>
  );
}
