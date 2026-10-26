import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import SiteFooter from "@/app/components/home/SiteFooter";
import { SUSTAINABLE_CONTENT } from "@/lib/sustainableContent";
import { copy as uiCopy, HOME_PAGE_CONTENT } from "@/lib/uiResources";

const supportedLanguages = ["pt", "en", "uk"];

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function SustainablePage({ params }) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  const content = HOME_PAGE_CONTENT[lang];
  const page = SUSTAINABLE_CONTENT[lang];

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
        <h1>{page.title}</h1>
        <p className="rules-page__lead">{page.lead}</p>

        <section className="rules-section">
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="rules-section">
          {page.highlights.map((line) => (
            <p key={line}>
              <strong>{line}</strong>
            </p>
          ))}
          <p>{page.closing}</p>
        </section>

        <p className="rules-page__lead">{page.tagline}</p>
      </section>

      <SiteFooter copy={uiCopy[lang] ?? uiCopy.pt} lang={lang} />
    </main>
  );
}
