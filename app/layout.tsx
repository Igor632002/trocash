import type { Metadata } from "next";
import "./globals1.css";
import "./home-footer.css";

export const metadata: Metadata = {
  title: "troCASH — Обмінюйтесь тим, що вам цінно",
  description: "Платформа для обміну речами, нерухомістю, автомобілями та колекційними предметами.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
