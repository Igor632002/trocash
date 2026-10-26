import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import SiteFooter from "@/app/components/home/SiteFooter";
import { RULES_CONTENT } from "@/lib/rulesContent";
import { copy as uiCopy, HOME_PAGE_CONTENT } from "@/lib/uiResources";

const supportedLanguages = ["pt", "en", "uk"];

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function RulesPage({ params }) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  const content = HOME_PAGE_CONTENT[lang];
  const rules = RULES_CONTENT[lang];

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
        <h1>{rules.title}</h1>
        <p className="rules-page__lead">{rules.lead}</p>
        {rules.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {rules.sections.map((section, index) => (
          <section key={section.title} className="rules-section">
            <h2>{`${index + 1}. ${section.title}`}</h2>
            <p>{section.intro}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {section.outro && <p>{section.outro}</p>}
          </section>
        ))}

        <section className="rules-section">
          <h2>{rules.extra.simpleRulesTitle}</h2>
          <ul>
            {rules.extra.simpleRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="rules-section">
          <h2>{rules.extra.whyTitle}</h2>
          <p>
            <strong>{rules.extra.whyLead}</strong>
          </p>
          <p>{rules.extra.whyText}</p>
        </section>

        <p className="rules-page__lead">{rules.extra.tagline}</p>
        <p>{rules.extra.closing}</p>
      </section>

      <SiteFooter copy={uiCopy[lang] ?? uiCopy.pt} lang={lang} />
    </main>
  );
}
