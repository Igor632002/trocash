import './globals.css';
import SetLang from './components/SetLang.client'

export const metadata = {
  title: 'troCASH - Algarve Exchange',
  description: 'Troca coisas, serviços e horas no Algarve',
  alternates: {
    canonical: 'https://trocash.pt/',
    languages: {
      'pt': 'https://trocash.pt/',
      'en': 'https://trocash.com/',
      'uk': 'https://trocash.ua/',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" data-scroll-behavior="smooth">
      <head />
      <body>
        <SetLang />
        {children}
      </body>
    </html>
  );
}
