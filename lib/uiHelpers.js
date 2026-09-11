import demoListings from "./data/demoListings";

export function getTopVisibleListings({ offers = [], limit = 16 } = {}) {
const real = offers.map(o => (
{
...o,
image: o.image_url || (o.photo_urls && o.photo_urls[0]) || demoListings[(o.id || "").toString().length % demoListings.length].image,
}
));

const source = real.length > 0 ? real : demoListings;
return source.slice(0, limit);
}

export function getVisibleListings({ offers = [], category = 'Todas', have = '', want = '', locationId = '' } = {}) {
  const real = offers.map(o => ({
    ...o,
    image: o.image_url || (o.photo_urls && o.photo_urls[0]) || demoListings[(o.id || "").toString().length % demoListings.length].image,
  }));
  const all = real.length > 0 ? real : demoListings;

  const query = String(`${want || ""} ${have || ""}`).trim().toLowerCase();
  const cat = String(category ?? "").trim();
  const loc = String(locationId ?? "").trim();

  const filtered = all.filter(o => {
    if (cat && cat !== "Todas") {
      const cid = String(o.category?.id ?? o.category_id ?? "");
      if (cid !== cat) return false;
    }

    if (loc && loc !== "Todas") {
      const lid = String(o.location?.id || o.location_id || "");
      if (lid !== loc) return false;
    }

    if (query) {
      const hay = `${o.title || o.name || ""} ${o.description || o.body || ""} ${(o.category?.name) || ""} ${o.area || ""}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }

    return true;
  });

  return filtered;
}
export default { getVisibleListings, getTopVisibleListings };
