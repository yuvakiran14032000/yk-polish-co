import "server-only";
import { cache } from "react";
import {
  collections as seedCollections,
  defaults,
  demoEnabled,
  demoProducts,
} from "./brand";
import { serverClient } from "./supabase/server";
import type { Collection, Product, Settings } from "./types";
export const getCatalogue = cache(async function getCatalogue(): Promise<{
  products: Product[];
  collections: Collection[];
  settings: Settings;
  demo: boolean;
  error: boolean;
}> {
  const client = await serverClient();
  if (!client)
    return {
      products: demoEnabled() ? demoProducts : [],
      collections: seedCollections,
      settings: defaults,
      demo: demoEnabled(),
      error: false,
    };
  const [p, c, s] = await Promise.all([
    client
      .from("products")
      .select(
        "*,images:product_images(*),variants:product_variants(*),addons:product_addons(*),product_collections(collections(*))",
      )
      .eq("status", "published")
      .order("display_order"),
    client.from("collections").select("*").order("display_order"),
    client.from("site_settings").select("value").eq("id", "main").maybeSingle(),
  ]);
  const products = (p.data ?? []).map(({ product_collections, ...row }) => ({
    ...row,
    collections: (product_collections ?? []).map(
      (x: { collections: Collection }) => x.collections,
    ),
    images: [...(row.images ?? [])].sort(
      (a, b) => a.display_order - b.display_order,
    ),
  })) as Product[];
  return {
    products,
    collections: (c.data ?? seedCollections) as Collection[],
    settings: { ...defaults, ...s.data?.value },
    demo: false,
    error: Boolean(p.error || c.error || s.error),
  };
});
