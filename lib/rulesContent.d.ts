export type RulesSection = {
  title: string;
  intro: string;
  items: string[];
  outro?: string;
};

export type RulesExtra = {
  simpleRulesTitle: string;
  simpleRules: string[];
  whyTitle: string;
  whyLead: string;
  whyText: string;
  tagline: string;
  closing: string;
};

export type RulesContent = {
  buttonLabel: string;
  title: string;
  lead: string;
  intro: string[];
  sections: RulesSection[];
  extra: RulesExtra;
};

export declare const RULES_CONTENT: Record<"pt" | "en" | "uk", RulesContent>;
