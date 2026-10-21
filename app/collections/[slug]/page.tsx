import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogue } from "@/lib/catalogue";
import { money } from "@/lib/brand";
import { Catalogue } from "@/components/catalogue";
import { CollectionCard } from "@/components/collection-card";
import { BreadcrumbData } from "@/components/breadcrumb-data";
import type { Filters } from "@/lib/filter";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { collections } = await getCatalogue();
  const c = collections.find((c) => c.slug === slug);
  return {
    title: c?.name ?? "Collection not found",
    description: c?.description,
    alternates: { canonical: `/collections/${slug}` },
  };
}
export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const { products, collections, error } = await getCatalogue();
  const c = collections.find((c) => c.slug === slug);
  if (!c) notFound();
  const query = await searchParams;
  const filters: Filters = Object.fromEntries(
    Object.entries(query).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  delete filters.collection;
  return (
    <div className="container">
      <BreadcrumbData
        items={[
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: c.name, path: `/collections/${slug}` },
        ]}
      />
      <div className="page-heading">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/collections">Collections</Link>
          <span>/</span>
          <span>{c.name}</span>
        </nav>
        <div className="collection-intro">
          <div>
            <p className="eyebrow">THE YK COLLECTIONS</p>
            <h1>{c.name}</h1>
            <p>{c.description}</p>
            <span className="small">
              Sets from {money(c.starting_price)}
              {["bridal", "customised"].includes(slug) ? "+" : ""} · application
              kit included
            </span>
          </div>
          <CollectionCard collection={c} index={c.display_order} />
        </div>
      </div>
      <Catalogue
        products={products}
        collections={collections}
        filters={filters}
        path={`/collections/${slug}`}
        locked={slug}
        error={error}
      />
    </div>
  );
}
