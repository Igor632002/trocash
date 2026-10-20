import Link from "next/link";
import { ArrowRight, CarIcon, DiamondIcon, HomeIcon, ShirtIcon } from "./Icons";

type Category = {
  title: string;
  description: string;
  image: string;
  kind: "personal" | "realestate" | "car" | "collectibles";
};

type CategoryCardProps = {
  category: Category;
  buttonLabel: string;
};

const iconMap = {
  personal: ShirtIcon,
  realestate: HomeIcon,
  car: CarIcon,
  collectibles: DiamondIcon,
};

export function CategoryCard({ category, buttonLabel }: CategoryCardProps) {
  const Icon = iconMap[category.kind];

  return (
    <article className="category-card" style={{ backgroundImage: `url(${category.image})` }}>
      <div className="category-card__shade" />
      <div className="category-card__content">
        <div className="category-icon">
          <Icon size={25} />
        </div>
        <div>
          <h3>{category.title}</h3>
          <p>{category.description}</p>
        </div>
        <Link href="#categories" className="outline-pill category-card__button">
          {buttonLabel} <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
