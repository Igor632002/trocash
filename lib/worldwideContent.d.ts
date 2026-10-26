export type WorldwideContent = {
  title: string;
  paragraphs: string[];
  closing: string;
  tagline: string;
};

export declare const WORLDWIDE_CONTENT: Record<"pt" | "en" | "uk", WorldwideContent>;
