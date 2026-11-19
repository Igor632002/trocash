export type DatabaseCategory = {
  id: string | number;
  name: string;
  slug: string | null;
  description: string | null;
  status: string;
};

export function useCategories(): { categoriesList: DatabaseCategory[] };
