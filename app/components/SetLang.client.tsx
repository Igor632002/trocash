"use client";

import { useEffect } from "react";

export default function SetLang() {
  useEffect(() => {
    try {
      const segments = (window.location.pathname || "/").split("/");
      const first = segments[1] === "exchange" ? segments[2] : segments[1];
      document.documentElement.lang = first === "en" || first === "uk" ? first : "pt";
    } catch {
      // ignore
    }
  }, []);

  return null;
}
