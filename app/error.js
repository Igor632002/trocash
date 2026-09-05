"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <h1>Ocorreu um erro</h1>
      <p>{error?.message || "Algo correu mal."}</p>
      <button className="gold-btn" onClick={() => reset()}>Tentar novamente</button>
    </div>
  );
}
