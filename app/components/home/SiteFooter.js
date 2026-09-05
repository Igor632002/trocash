import Logo from "../Logo";

export default function SiteFooter({ copy }) {
  return (
    <>
      <footer className="footer">
        <div>
          <Logo compact />
          <p>{copy?.footerLine1}</p>
          <small>{copy?.footerLine2}</small>
          <small>{copy?.footerLine3}</small>
        </div>
        <div><b>{copy?.footerTroCASH}</b><button>{copy?.footerAbout}</button><button>{copy?.footerHow}</button><button>{copy?.footerRules}</button></div>
        <div><b>{copy?.footerSupportTitle}</b><button>{copy?.footerSupportHelp}</button><button>{copy?.footerSupportSecurity}</button><button>{copy?.footerSupportPrivacy}</button></div>
        <div><b>{copy?.footerCommunityTitle}</b>{(copy?.footerCommunityItems || "").split("|").map((x, i) => (<button key={i}>{x}</button>))}</div>
        <div className="footer-news">
          <b>{copy?.footerNewsTitle}</b>
          <p>{copy?.footerNewsSub}</p>
          <div><input placeholder={copy?.footerNewsTitle || "Your email"} /><button className="gold-btn">→</button></div>
        </div>
      </footer>
      <div className="copyright">© 2026 {copy?.footerTroCASH} · Algarve, Portugal <span>Comunidade · Confiança · Liberdade</span></div>
    </>
  );
}
