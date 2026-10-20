export function LogoMark2() {
  return (
    <span
      aria-hidden="true"
      className="logo-mark"
      style={{
        display: "inline-block",
      }}
    >
      <img
        src="/assets/logo2.webp"
        alt=""
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </span>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`wordmark ${compact ? "wordmark--compact" : ""}`}>
      <span className="wordmark__light">tro</span>
      <span className="wordmark__gold">CASH</span>
    </span>
  );
}
