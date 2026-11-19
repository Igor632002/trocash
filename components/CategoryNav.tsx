"use client";

import Link from "next/link";
import { useState } from "react";
import type { LangCode } from "@/lib/uiResources";
import { CarIcon, DiamondIcon, GridIcon, HomeIcon, SearchIcon, ShirtIcon } from "./Icons";

type CategoryNavLabels = {
  all: string;
  personal: string;
  realestate: string;
  car: string;
  collectibles: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
};

type CategoryNavProps = {
  labels: CategoryNavLabels;
  categoryIds: Partial<Record<"personal" | "realestate" | "car" | "collectibles", string>>;
  lang?: LangCode;
};

type CategoryKey = "all" | "personal" | "realestate" | "car" | "collectibles";

export function CategoryNav({ labels, categoryIds, lang = "pt" }: CategoryNavProps) {
  const [active, setActive] = useState("all");
  const items: Array<{ label: string; key: CategoryKey; Icon: typeof GridIcon }> = [
    { label: labels.all, key: "all", Icon: GridIcon },
    { label: labels.personal, key: "personal", Icon: ShirtIcon },
    { label: labels.realestate, key: "realestate", Icon: HomeIcon },
    { label: labels.car, key: "car", Icon: CarIcon },
    { label: labels.collectibles, key: "collectibles", Icon: DiamondIcon },
  ];
  const visibleItems = items.flatMap((item) => {
    if (item.key !== "all" && !categoryIds[item.key]) return [];
    return [item];
  });

  return (
    <div className="catalog-toolbar" id="categories">
      <div className="catalog-tabs">
        {visibleItems.map(({ label, key, Icon }) => (
          <Link
            key={key}
            href={key === "all"
              ? `/exchange/${lang}?view=all`
              : `/exchange/${lang}?categoryId=${encodeURIComponent(categoryIds[key] ?? "")}`}
            className={`catalog-tab ${active === key ? "catalog-tab--active" : ""}`}
            onClick={() => setActive(key)}
            aria-pressed={active === key}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <label className="search-box">
        <SearchIcon size={19} />
        <input aria-label={labels.searchAriaLabel} placeholder={labels.searchPlaceholder} />
      </label>
    </div>
  );
}
