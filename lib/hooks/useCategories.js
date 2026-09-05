"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/dal";

// Loads the category list once, used by search filters and the new-offer form
export function useCategories() {
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await fetchCategories();
        if (mounted) setCategoriesList(cats);
      } catch (err) {
        console.error('fetchCategories failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { categoriesList };
}
