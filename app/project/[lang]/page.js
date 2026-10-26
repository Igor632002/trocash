import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import SiteFooter from "@/app/components/home/SiteFooter";
import { ABOUT_CONTENT } from "@/lib/aboutContent";
import { copy as uiCopy, HOME_PAGE_CONTENT } from "@/lib/uiResources";

const supportedLanguages = ["pt", "en", "uk"];

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function ProjectPage({ params }) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  const content = HOME_PAGE_CONTENT[lang];
  const about = ABOUT_CONTENT[lang];

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
        <h1>{about.title}</h1>
        <p className="rules-page__lead">{about.lead}</p>

        {about.sections.map((section, index) => (
          <section key={index} className="rules-section">
            {section.heading && <h2>{section.heading}</h2>}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="rules-page__lead">{about.tagline}</p>
      </section>

      <SiteFooter copy={uiCopy[lang] ?? uiCopy.pt} lang={lang} />
    </main>
  );
}
