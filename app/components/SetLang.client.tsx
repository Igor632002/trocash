"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LANGUAGES } from "@/lib/uiResources";

export default function SetLang() {
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const localizedSections = new Set([
      "contact",
      "how",
      "project",
      "rules",
      "safety",
      "sustainable",
      "worldwide",
    ]);
    const pathLanguage =
      segments[0] === "exchange"
        ? segments[1]
        : localizedSections.has(segments[0])
          ? segments[1]
          : segments[0];
    const supportedLanguage = LANGUAGES.some(({ code }) => code === pathLanguage)
      ? pathLanguage
      : null;
    const storedLanguage = window.localStorage.getItem("trocash-language");
    const language = supportedLanguage
      ?? LANGUAGES.find(({ code }) => code === storedLanguage)?.code
      ?? "pt";

    if (supportedLanguage) {
      window.localStorage.setItem("trocash-language", supportedLanguage);
    }
    document.documentElement.lang = language;
  }, [pathname]);

  return null;
}
