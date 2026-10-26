import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import SiteFooter from "@/app/components/home/SiteFooter";
import { HOW_CONTENT } from "@/lib/howContent";
import { copy as uiCopy, HOME_PAGE_CONTENT } from "@/lib/uiResources";

const supportedLanguages = ["pt", "en", "uk"];

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function HowPage({ params }) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  const content = HOME_PAGE_CONTENT[lang];
  const page = HOW_CONTENT[lang];

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
        <p>{page.intro}</p>

        <section className="rules-section">
          {page.steps.map((step) => (
            <div key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          ))}
        </section>
      </section>

      <SiteFooter copy={uiCopy[lang] ?? uiCopy.pt} lang={lang} />
    </main>
  );
}
