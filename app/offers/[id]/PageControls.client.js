"use client";

import { useRouter } from "next/navigation";

export default function PageControls() {
  const router = useRouter();

  const container = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  };

  const circle = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(17,25,54,0.10)",
    background: "#ffdd66",
    color: "#8b8e98", // modal-close color
    cursor: "pointer",
    padding: 0,
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 1,
  };

  return (
    <div style={container}>
      <button style={circle} onClick={() => router.back()} aria-label="Back">←</button>
      <button style={circle} onClick={() => router.push("/")} aria-label="Close">×</button>
    </div>
  );
}