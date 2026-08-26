import './globals.css';
import SetLang from './components/SetLang.client';

export const metadata = {
  title: 'Troca de coisas e serviços no Algarve – Faro, Lagos, Portimão',
  description: 'Descubra oportunidades de troca de objetos e serviços em Faro, Lagos, Portimão e outras cidades do Algarve. Conecte-se com a comunidade local e troque sem dinheiro.',
  alternates: {
    canonical: 'https://trocash.pt/',
    languages: {
      'pt': 'https://trocash.pt/',
      'en': 'https://trocash.pt/en',
      'uk': 'https://trocash.pt/uk',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" data-scroll-behavior="smooth">
      <head>
        <link rel="alternate" hrefLang="pt" href="https://trocash.pt/" />
        <link rel="alternate" hrefLang="en" href="https://trocash.pt/en" />
        <link rel="alternate" hrefLang="uk" href="https://trocash.pt/uk" />
        <link rel="alternate" hrefLang="x-default" href="https://trocash.pt/" />
        <link rel="canonical" href="https://trocash.pt/" />
      </head>
      <body>
        <SetLang />
        {children}
      </body>
    </html>
  );
}