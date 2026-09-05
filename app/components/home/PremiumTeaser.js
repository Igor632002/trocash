export default function PremiumTeaser({ copy, setPremiumOpen }) {
  return (
    <section className="premium" id="premium">
      <div>
        <span className="premium-badge">{copy?.premium || copy?.footerTroCASH}</span>
        <h2>{copy?.premiumHeading}</h2>
        <p>{copy?.premiumSub}</p>
      </div>
      <div className="premium-price">
        <b>{copy?.premiumPriceLabel?.split(" ")[0] || copy?.premiumPriceLabel}</b><span>{copy?.premiumPriceLabel?.replace(/^[^\s]+\s*/, "") || ""}</span>
        <button className="gold-btn" onClick={() => setPremiumOpen && setPremiumOpen(true)}>{copy?.premiumButton}</button>
      </div>
    </section>
  );
}
