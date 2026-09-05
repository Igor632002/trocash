"use client";

import { useEffect, useState } from "react";
import { fetchLocations } from "@/lib/dal";

// Loads the location list once, used by search filters and the new-offer form
export function useLocations() {
  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const locs = await fetchLocations();
        if (mounted) setLocationsList(locs);
      } catch (err) {
        console.error('fetchLocations failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { locationsList };
}
