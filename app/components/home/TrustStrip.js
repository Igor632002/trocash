export default function TrustStrip({ copy, offers = [] }) {
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
      <div className="metric"><b>{offers.length || "—"}</b><span>ofertas reais</span></div>
      <div className="metric"><b>100%</b><span>foco local</span></div>
      <div className="metric"><b>4,9/5</b><span>meta de comunidade</span></div>
    </section>
  );
}
