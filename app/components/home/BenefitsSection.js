export default function BenefitsSection({ copy }) {
  return (
    <section className="benefits" id="how">
      <div><span>✓</span><b>{copy?.verificationTitle}</b><small>{copy?.verificationSub}</small></div>
      <div><span>↔</span><b>{copy?.noMoneyTitle}</b><small>{copy?.noMoneySub}</small></div>
      <div><span>◎</span><b>{copy?.supportTitle}</b><small>{copy?.supportSub}</small></div>
      <div><span>⌁</span><b>{copy?.privacyTitle}</b><small>{copy?.privacySub}</small></div>
    </section>
  );
}
