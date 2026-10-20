type TrustStripProps = {
  copy: Record<string, string>;
  offers?: unknown[];
};

export default function TrustStrip({ copy, offers = [] }: TrustStripProps) {
  return (
    <section className="trust-strip" id="trust">
      <div className="trust-lead">
        <div className="trust-icon">◎</div>
        <div>         
          <h3>{copy?.trust}</h3>
          <p>{copy?.trustLong}</p>
          <small className="slogan-note">{copy?.slogan2}</small>
        </div>
      </div>
      
      <div className="metric"><b>{offers.length || "—"}</b><span>{copy?.trustMetricOffers || "ofertas reais"}</span></div>
      <div className="metric"><b>100%</b><span>{copy?.trustMetricLocal || "foco local"}</span></div>
      <div className="metric"><b>4,9/5</b><span>{copy?.trustMetricCommunity || "meta de comunidade"}</span></div>
    </section>
  );
}
