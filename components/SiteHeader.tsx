"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark, Wordmark } from "./LogoMark";
import { MenuIcon } from "./Icons";
import { useAuth } from "@/lib/hooks/useAuth";

type NavItem = {
  label: string;
  href: string;
};

type LanguageItem = {
  code: "pt" | "en" | "uk";
  label: string;
  href: string;
};

type SiteHeaderProps = {
  brandHref: string;
  navItems: NavItem[];
  languages: LanguageItem[];
  activeLanguage: "pt" | "en" | "uk";
  menuOpenLabel: string;
  menuCloseLabel: string;
};

export function SiteHeader({
  brandHref,
  navItems,
  languages,
  activeLanguage,
  menuOpenLabel,
  menuCloseLabel,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link href={brandHref} className="brand" aria-label="troCASH">
          <span style={{ display: "inline-flex", transform: "translateY(1px)" }}>
            <LogoMark size={92} />
          </span>
          <Wordmark compact />
        </Link>

        <nav className={`main-nav ${open ? "main-nav--open" : ""}`}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language-list" aria-label="Мова">
            {languages.map((lang) => (
              <Link
                href={lang.href}
                className={`lang ${lang.code === activeLanguage ? "lang--active" : ""}`}
                key={lang.code}
                aria-current={lang.code === activeLanguage ? "page" : undefined}
              >
                {lang.label}
              </Link>
            ))}
          </div>
          {user ? (
            <Link href={`/exchange/${activeLanguage}`} className="header-avatar" aria-label={user.email ?? "Profile"}>
              {(user.email || "U")[0].toUpperCase()}
            </Link>
          ) : (
            <Link href="/auth" className="header-login">
              Login
            </Link>
          )}
          <button
            className="menu-button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            aria-expanded={open}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
