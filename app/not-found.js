import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link href="/">Voltar ao início</Link>
    </div>
  );
}
