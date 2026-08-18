import './globals.css';

export const metadata = {
  title: 'troCASH - Algarve Exchange',
  description: 'Troca coisas, serviços e horas no Algarve',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
