"use client";

import { useState } from "react";
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
};

export function CategoryNav({ labels }: CategoryNavProps) {
  const [active, setActive] = useState("all");
  const items = [
    { label: labels.all, key: "all", Icon: GridIcon },
    { label: labels.personal, key: "personal", Icon: ShirtIcon },
    { label: labels.realestate, key: "realestate", Icon: HomeIcon },
    { label: labels.car, key: "car", Icon: CarIcon },
    { label: labels.collectibles, key: "collectibles", Icon: DiamondIcon },
  ];

  return (
    <div className="catalog-toolbar" id="categories">
      <div className="catalog-tabs">
        {items.map(({ label, key, Icon }) => (
          <button
            key={key}
            className={`catalog-tab ${active === key ? "catalog-tab--active" : ""}`}
            onClick={() => setActive(key)}
            aria-pressed={active === key}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <label className="search-box">
        <SearchIcon size={19} />
        <input aria-label={labels.searchAriaLabel} placeholder={labels.searchPlaceholder} />
      </label>
    </div>
  );
}
