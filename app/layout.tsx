import type { Metadata } from "next";
import "./globals1.css";
import "./home-footer.css";
import SetLang from "./components/SetLang.client";

export const metadata: Metadata = {
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
  openGraph: {
    url: "https://trocash.pt/",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" data-scroll-behavior="smooth">
      <body>
        <SetLang />
        {children}
      </body>
    </html>
  );
}