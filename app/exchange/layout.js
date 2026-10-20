import "../globals.css";
import "../home-footer.css";
import "../site-teal-theme.css";
import SetLang from "../components/SetLang.client";

export const metadata = {
  title: "Troca de coisas e serviços no Algarve – Faro, Lagos, Portimão",
  description:
    "Descubra oportunidades de troca de objetos e serviços em Faro, Lagos, Portimão e outras cidades do Algarve. Conecte-se com a comunidade local e troque sem dinheiro.",
  alternates: {
    canonical: "https://trocash.pt/",
    languages: {
      pt: "https://trocash.pt/",
      en: "https://trocash.pt/en",
      uk: "https://trocash.pt/uk",
    },
  },
};

export default function ExchangeLayout({ children }) {
  return (
    <>
      <SetLang />
      {children}
    </>
  );
}
