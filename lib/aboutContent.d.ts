export type AboutSection = {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
};

export type AboutContent = {
  title: string;
  lead: string;
  sections: AboutSection[];
  tagline: string;
};

export declare const ABOUT_CONTENT: Record<"pt" | "en" | "uk", AboutContent>;
