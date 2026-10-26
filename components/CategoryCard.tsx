import Link from "next/link";
import { ArrowRight, CarIcon, DiamondIcon, HomeIcon, ShirtIcon } from "./Icons";

type Category = {
  title: string;
  description: string;
  image: string;
  kind:
    | "personal"
    | "realestate"
    | "car"
    | "collectibles"
    | "electronics"
    | "furniture"
    | "baby"
    | "bicycles"
    | "watches"
    | "tools"
    | "agriculture"
    | "transport"
    | "land";
};

type CategoryCardProps = {
  category: Category;
  buttonLabel: string;
  lang?: string;
};

const iconMap = {
  personal: ShirtIcon,
  realestate: HomeIcon,
  car: CarIcon,
  collectibles: DiamondIcon,
  electronics: DiamondIcon,
  furniture: HomeIcon,
  baby: ShirtIcon,
  bicycles: CarIcon,
  watches: DiamondIcon,
  tools: DiamondIcon,
  agriculture: HomeIcon,
  transport: CarIcon,
  land: HomeIcon,
};

export function CategoryCard({ category, buttonLabel, lang = "pt" }: CategoryCardProps) {
  const Icon = iconMap[category.kind];

  return (
    <Link
      href={`/exchange/${lang}?category=${category.kind}`}
      className="category-card"
      style={{ backgroundImage: `url(${category.image})` }}
    >
      <div className="category-card__shade" />
      <div className="category-card__content">
        <div className="category-icon">
          <Icon size={25} />
        </div>
        <div>          
          <h3>{category.title}</h3>
          <p>{category.description}</p>
        </div>
        <span className="outline-pill category-card__button">
          {buttonLabel} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
