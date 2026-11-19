import { CategoryCatalog } from "@/components/CategoryCatalog";
import { GlobeIcon, HeartIcon, LeafIcon, ShieldIcon, UsersIcon } from "@/components/Icons";
import { Hero } from "@/components/Hero";
import { HomePageSections } from "@/components/HomePageSections";
import { SiteHeader } from "@/components/SiteHeader";
import { SupportProject } from "@/components/SupportProject";
import SiteFooter from "@/app/components/home/SiteFooter";
import { ValueStrip } from "@/components/ValueStrip";
import { copy as uiCopy, HOME_PAGE_CONTENT, type HomePageContent, type LangCode } from "@/lib/uiResources";

const heroPointIcons = [ShieldIcon, LeafIcon, UsersIcon, GlobeIcon];
const valueIcons = [LeafIcon, GlobeIcon, HeartIcon];

type HomeLandingProps = {
  initialLang?: LangCode;
};

export function HomeLanding({ initialLang = "pt" }: HomeLandingProps) {
  const content: HomePageContent = HOME_PAGE_CONTENT[initialLang] ?? HOME_PAGE_CONTENT.pt;
  const localizedCopy = uiCopy[initialLang] ?? uiCopy.pt;

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
      <Hero
        eyebrow={content.hero.eyebrow}
        titlePrefix={content.hero.titlePrefix}
        titleAccent={content.hero.titleAccent}
        lead={content.hero.lead}
        centerTaglineTop={content.hero.centerTaglineTop}
        centerTaglineBottom={content.hero.centerTaglineBottom}
        pointsAriaLabel={content.hero.pointsAriaLabel}
        points={content.hero.points.map((point, index) => ({
          ...point,
          Icon: heroPointIcons[index] ?? ShieldIcon,
        }))}
        ctaHref={`/exchange/${initialLang}`}
        ctaLabel={content.hero.ctaLabel}
      />
      <SupportProject copy={localizedCopy} />
      <section className="catalog container">          
        <CategoryCatalog content={content} lang={initialLang} />
      </section>

      <HomePageSections lang={initialLang} />

      <ValueStrip
        items={content.values.map((item, index) => ({
          ...item,
          Icon: valueIcons[index] ?? LeafIcon,
        }))}
      />
      <SiteFooter copy={localizedCopy} lang={initialLang} />
      <section className="sr-only" id="how-it-works">
        {content.srOnly}
      </section>
    </main>
  );
}

export default HomeLanding;
