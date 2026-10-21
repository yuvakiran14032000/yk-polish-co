import type { MetadataRoute } from "next";
import { getCatalogue } from "@/lib/catalogue";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const { products, collections } = await getCatalogue();
  return [
    "",
    "/shop",
    "/collections",
    "/customise",
    "/nail-guide",
    "/about",
    "/privacy",
    "/terms",
    ...collections.map((c) => `/collections/${c.slug}`),
    ...products.filter((p) => !p.demo).map((p) => `/products/${p.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : path.startsWith("/products/") ? 0.7 : 0.6,
  }));
}
