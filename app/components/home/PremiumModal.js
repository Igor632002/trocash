export default function PremiumModal({ copy, premiumOpen, setPremiumOpen }) {
  if (!premiumOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setPremiumOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setPremiumOpen(false)}>×</button>
        <span className="premium-badge">{copy?.premium || copy?.footerTroCASH}</span>
        <h2>{copy?.premiumModalHeading}</h2>
        <p>{copy?.premiumModalBody}</p>
        <ul>
          {(copy?.premiumModalList || "").split("|").map((it, i) => (<li key={i}>{it}</li>))}
        </ul>
        <button className="gold-btn large" onClick={() => setPremiumOpen(false)}>{copy?.premiumButton || "Continuar →"}</button>
      </div>
    </div>
  );
}
