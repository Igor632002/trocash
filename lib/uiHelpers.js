import demoListings from "./data/demoListings";

export function getVisibleListings({ offers = [], category = 'Todas', have = '', want = '', locationId = '' } = {}) {
  const real = offers.map(o => ({
    ...o,
    image: o.image_url || (o.photo_urls && o.photo_urls[0]) || demoListings[(o.id || "").toString().length % demoListings.length].image,
  }));
  const all = [...real, ...demoListings];

  const query = String(want || have || "").trim().toLowerCase();
  const cat = String(category ?? "").trim();
  const loc = String(locationId ?? "").trim();

  return all.filter(item => {
    const title = String(item.title || "").toLowerCase();
    const description = String(item.description || "").toLowerCase();
    const area = String(item.area || "");

    const matchesCategory =
      (!cat || cat === "Todas") ||
      (item?.category && String(item.category.id) === String(cat)) ||
      (item.category_id && String(item.category_id) === String(cat)) ||
      String(item.kind || "") === cat ||
      area === cat ||
      title.includes(cat.toLowerCase());

    // Search matches only title or description, per spec
    const matchesQuery = !query || title.includes(query) || description.includes(query);

    // Locality filter only applies to real DB offers (location_id), demo listings have none
    const matchesLocation = !loc || String(item.location_id ?? "") === loc;

    return matchesCategory && matchesQuery && matchesLocation;
  }).slice(0, 8);
}

export default { getVisibleListings };
