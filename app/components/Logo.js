import React from "react";

export default function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`} aria-label="troCASH">
      <svg className="brand-mark" viewBox="0 0 100 72" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="goldLogo" x1="0" x2="1">
            <stop offset="0" stopColor="#C58A20" />
            <stop offset="0.5" stopColor="#F2D08A" />
            <stop offset="1" stopColor="#B87810" />
          </linearGradient>
        </defs>
        <circle cx="25" cy="12" r="5.5" fill="url(#goldLogo)" />
        <circle cx="75" cy="12" r="5.5" fill="url(#goldLogo)" />
        <path
          d="M47 35 C36 18, 10 18, 10 36 C10 54, 36 54, 50 36 C64 18, 90 18, 90 36 C90 54, 64 54, 50 36 C36 18, 10 18, 10 36"
          fill="none"
          stroke="url(#goldLogo)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <div className="brand-wordmark">
        <span>tro</span>
        <b>CASH</b>
        <small>JUNTOS CRIAMOS VALOR.</small>
      </div>
    </div>
  );
}
