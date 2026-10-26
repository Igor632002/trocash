export type SustainableContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  highlights: string[];
  closing: string;
  tagline: string;
};

export declare const SUSTAINABLE_CONTENT: Record<"pt" | "en" | "uk", SustainableContent>;
