import Link from "next/link";
import Logo from "../Logo";

export default function SiteFooter({ copy, lang = "pt" }) {
  return (
    <>
      <footer className="footer home-footer site-footer--teal">
        <div>
          <Logo compact />
          <p>{copy?.footerLine1}</p>
          <small>{copy?.footerLine2}</small>
          <small>{copy?.footerLine3}</small>
        </div>
        <div><b>{copy?.footerTroCASH}</b><Link className="footer-link" href={`/project/${lang}`}>{copy?.footerAbout}</Link><Link className="footer-link" href={`/how/${lang}`}>{copy?.footerHow}</Link><Link className="footer-link" href={`/rules/${lang}`}>{copy?.footerRules}</Link></div>
        <div><b>{copy?.footerSupportTitle}</b><button>{copy?.footerSupportHelp}</button><button>{copy?.footerSupportSecurity}</button><button>{copy?.footerSupportPrivacy}</button></div>
        <div><b>{copy?.footerCommunityTitle}</b>{(copy?.footerCommunityItems || "").split("|").map((x, i) => (<button key={i}>{x}</button>))}</div>
        <div className="footer-news">
          <b>{copy?.footerNewsTitle}</b>
          <p>{copy?.footerNewsSub}</p>
          <div><input placeholder={copy?.footerNewsTitle || "Your email"} /><button className="gold-btn">→</button></div>
        </div>
      </footer>
      <div className="copyright home-copyright site-footer--teal">© 2026 {copy?.footerTroCASH} · Algarve, Portugal <span>Comunidade · Confiança · Liberdade</span></div>
    </>
  );
}
