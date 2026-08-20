import demoListings from "./data/demoListings";

export function getVisibleListings({ offers = [], category = 'Todas', have = '', want = '' } = {}) {
  const real = offers.map(o => ({
    ...o,
    image: o.image_url || (o.photo_urls && o.photo_urls[0]) || demoListings[(o.id || "").toString().length % demoListings.length].image,
  }));
  const all = [...real, ...demoListings];

  const qHave = String(have || "").toLowerCase();
  const qWant = String(want || "").toLowerCase();
  const queryFilter = (qHave || qWant);
  const cat = String(category || "Todas");

  return all.filter(item => {
    const title = String(item.title || "").toLowerCase();
    const kind = String(item.kind || "");
    const area = String(item.area || "");
    const matchesCategory = cat === "Todas" || kind === cat || area === cat || title.includes(cat.toLowerCase());
    const hay = `${title} ${String(item.description || "").toLowerCase()} ${String(item.wish || "").toLowerCase()} ${area.toLowerCase()}`;
    return matchesCategory && hay.includes(queryFilter);
  }).slice(0, 8);
}

export default { getVisibleListings };
