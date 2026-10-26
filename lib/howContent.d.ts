export type HowStep = {
  title: string;
  text: string;
};

export type HowContent = {
  title: string;
  lead: string;
  intro: string;
  steps: HowStep[];
};

export declare const HOW_CONTENT: Record<"pt" | "en" | "uk", HowContent>;
