export type SafetyContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  highlights: string[];
  closing: string;
  tagline: string;
};

export declare const SAFETY_CONTENT: Record<"pt" | "en" | "uk", SafetyContent>;
