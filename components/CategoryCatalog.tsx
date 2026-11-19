"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { CategoryNav } from "@/components/CategoryNav";
import { useCategories } from "@/lib/hooks/useCategories";
import type { HomePageContent, HomePageCategory, LangCode } from "@/lib/uiResources";

type CategoryCatalogProps = {
  content: HomePageContent;
  lang: LangCode;
};

export function CategoryCatalog({ content, lang }: CategoryCatalogProps) {
  const { categoriesList } = useCategories();

  const categoryIds: Partial<Record<HomePageCategory["kind"], string>> = {};
  content.categories.forEach((category) => {
    const databaseCategory = categoriesList.find((item) => item.slug === category.kind);
    if (databaseCategory) categoryIds[category.kind] = String(databaseCategory.id);
  });

  const categoriesWithIds = content.categories.flatMap((category) => {
    const categoryId = categoryIds[category.kind];
    return categoryId ? [{ category, categoryId }] : [];
  });

  return (
    <>
      <CategoryNav labels={content.categoriesNav} categoryIds={categoryIds} lang={lang} />
      <div className="category-grid">
        {categoriesWithIds.map(({ category, categoryId }) => (
          <CategoryCard
            key={category.kind}
            category={category}
            categoryId={categoryId}
            buttonLabel={content.categoryButtonLabel}
            lang={lang}
          />
        ))}
      </div>
    </>
  );
}
