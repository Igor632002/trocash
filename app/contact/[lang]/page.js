import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import SiteFooter from "@/app/components/home/SiteFooter";
import { copy as uiCopy, HOME_PAGE_CONTENT } from "@/lib/uiResources";

const supportedLanguages = ["pt", "en", "uk"];
const contactEmail = "trocash.pt@gmail.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function ContactPage({ params }) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  const content = HOME_PAGE_CONTENT[lang];
  const copy = uiCopy[lang] ?? uiCopy.pt;

  return (
    <main className="site-shell">
      <SiteHeader
        brandHref={content.brandHref}
        navItems={content.navItems}
        languages={content.languages}
        activeLanguage={content.activeLanguage}
        menuOpenLabel={content.menuOpenLabel}
        menuCloseLabel={content.menuCloseLabel}
      />

      <section className="rules-page container">
        <h1>{copy.contactPageTitle}</h1>
        <p className="rules-page__lead">{copy.contactPageLead}</p>
        <p>{copy.contactPageEmailLabel}</p>
        <a className="contact-page__email" href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>
      </section>

      <SiteFooter copy={copy} lang={lang} />
    </main>
  );
}
