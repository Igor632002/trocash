import ListingCard from "./ListingCard";

// Smart Matches shows only the top 20 candidates to keep the grid focused
const MAX_MATCHES = 20;

export default function MatchesSection({ copy, visibleListings = [], setCategory, proposeExchange, loading, notice }) {
  const topMatches = visibleListings.slice(0, MAX_MATCHES);

  return (
    <section className="content-section section" id="matches">
      <div className="section-head section-title">
        <div>
          <span className="eyebrow gold-label">SMART MATCHES</span>
          <h2>{copy?.matches} ✦</h2>
          <p>O sistema aproxima pessoas com desejos compatíveis.</p>
        </div>
        <button className="text-btn" onClick={() => setCategory && setCategory("")}>{copy?.viewAll || "Ver todas →"}</button>
      </div>

      <div className="listing-grid cards">
        {topMatches.map((o, i) => (
          <ListingCard key={o.id || i} offer={o} index={i} copy={copy} proposeExchange={proposeExchange} />
        ))}
      </div>

      {loading && <div className="soft-notice">A actualizar ofertas…</div>}
      {notice && <div className="soft-notice">{notice}</div>}
    </section>
  );
}
