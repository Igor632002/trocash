export type LangCode = "pt" | "en" | "uk";

export type HomePagePoint = {
  title: string;
  text: string;
};

export type HomePageCategory = {
  kind: "personal" | "realestate" | "car" | "collectibles";
  title: string;
  description: string;
  image: string;
};

export type HomePageContent = {
  navItems: Array<{ label: string; href: string }>;
  languages: Array<{ code: LangCode; label: string; href: string }>;
  hero: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    lead: string;
    centerTaglineTop: string;
    centerTaglineBottom: string;
    pointsAriaLabel: string;
    points: HomePagePoint[];
    ctaLabel: string;
  };
  categories: HomePageCategory[];
  categoriesNav: {
    all: string;
    personal: string;
    realestate: string;
    car: string;
    collectibles: string;
    searchPlaceholder: string;
    searchAriaLabel: string;
  };
  menuOpenLabel: string;
  menuCloseLabel: string;
  values: Array<{ title: string; text: string }>;
  categoryButtonLabel: string;
  srOnly: string;
  brandHref: string;
  activeLanguage: LangCode;
};

export const copy: any;
export const LANGUAGES: Array<{
  code: LangCode;
  flag: string;
  label: string;
}>;
export const HOME_PAGE_CONTENT: Record<LangCode, HomePageContent>;

declare const _default: {
  copy: any;
};

export default _default;
