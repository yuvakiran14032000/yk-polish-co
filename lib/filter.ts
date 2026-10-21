import type { Product } from "./types";
export type Filters = Record<string, string | undefined>;
export function filterProducts(products: Product[], f: Filters) {
  const q = (f.q ?? "").trim().toLowerCase();
  const result = products.filter(
    (p) =>
      (!q ||
        [
          p.name,
          p.description,
          ...p.colors,
          ...p.collections.map((c) => c.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)) &&
      (!f.collection || p.collections.some((c) => c.slug === f.collection)) &&
      (!f.min || p.price >= Number(f.min)) &&
      (!f.max || p.price <= Number(f.max)) &&
      (!f.color || p.colors.includes(f.color)) &&
      (!f.shape || p.variants.some((v) => v.shape === f.shape)) &&
      (!f.length || p.variants.some((v) => v.length === f.length)) &&
      (!f.occasion || p.occasions.includes(f.occasion)) &&
      (!f.availability || p.availability === f.availability),
  );
  return result.sort((a, b) =>
    f.sort === "price-asc"
      ? a.price - b.price
      : f.sort === "price-desc"
        ? b.price - a.price
        : f.sort === "featured"
          ? Number(b.featured) - Number(a.featured) ||
            a.display_order - b.display_order
          : Date.parse(b.created_at) - Date.parse(a.created_at) ||
            a.display_order - b.display_order,
  );
}
export function queryLink(path: string, f: Filters, patch: Filters) {
  const params = new URLSearchParams();
  Object.entries({ ...f, ...patch }).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  return `${path}?${params}`;
}
