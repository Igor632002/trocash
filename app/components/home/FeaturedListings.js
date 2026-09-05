import ListingCard from "./ListingCard";
export default function FeaturedListings({ copy, visibleListings = [], setCategory, setRadius, proposeExchange }) 
{
  return (
    <section className="content-section section" id="SelectedListings">
      <div className="section-head section-title">
        <h2>{copy?.matches}</h2>
        <button className="text-btn"
          onClick={() => { setCategory && setCategory("Todas"); setRadius && setRadius("Todas"); }}>
          {copy?.viewAll || "Ver todas →"}
        </button>
      </div>

      <div className="listing-grid cards">
        {visibleListings.map((o, i) => (
          <ListingCard key={o.id || i} offer={o} index={i} copy={copy} proposeExchange={proposeExchange} />
        ))}
      </div>
    </section>
  );
}
