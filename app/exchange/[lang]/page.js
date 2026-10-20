import { notFound } from "next/navigation";
import ExchangePage from "../page";

const supportedLanguages = ["pt", "en", "uk"];

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function LocalizedExchangePage({ params }) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  return <ExchangePage initialLang={lang} />;
}
