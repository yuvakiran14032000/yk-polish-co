import Link from "next/link";
import { ArrowUpRight, Flower2 } from "lucide-react";
import type { Collection, Product } from "@/lib/types";
import { filterProducts, queryLink, type Filters } from "@/lib/filter";
import { ProductCard } from "./product-card";
import { MobileFilters } from "./mobile-filters";
function FilterForm({
  products,
  collections,
  filters: f,
  path,
  locked,
}: {
  products: Product[];
  collections: Collection[];
  filters: Filters;
  path: string;
  locked?: string;
}) {
  const values = (items: string[]) => [...new Set(items)].sort();
  const selects = [
    ["color", "Colour", values(products.flatMap((p) => p.colors))],
    [
      "shape",
      "Nail shape",
      values(products.flatMap((p) => p.variants.map((v) => v.shape))),
    ],
    [
      "length",
      "Nail length",
      values(products.flatMap((p) => p.variants.map((v) => v.length))),
    ],
    ["occasion", "Occasion", values(products.flatMap((p) => p.occasions))],
  ];
  return (
    <form action={path} className="filter-form">
      <label>
        Search designs
        <input
          type="search"
          name="q"
          defaultValue={f.q}
          placeholder="A design, a colour…"
          maxLength={100}
        />
      </label>
      {!locked && (
        <label>
          Collection
          <select name="collection" defaultValue={f.collection ?? ""}>
            <option value="">All collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {products.length > 0 && (
        <>
          <div className="price-range">
            <label>
              Min. price (₹)
              <input
                name="min"
                type="number"
                min="0"
                defaultValue={f.min}
                placeholder="0"
              />
            </label>
            <label>
              Max. price (₹)
              <input
                name="max"
                type="number"
                min="0"
                defaultValue={f.max}
                placeholder="Any"
              />
            </label>
          </div>
          {selects
            .filter(([, , opts]) => opts.length > 0)
            .map(([name, label, options]) => (
              <label key={String(name)}>
                {label}
                <select
                  name={String(name)}
                  defaultValue={f[String(name)] ?? ""}
                >
                  <option value="">All</option>
                  {(options as string[]).map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            ))}
          <label>
            Availability
            <select name="availability" defaultValue={f.availability ?? ""}>
              <option value="">All</option>
              {values(products.map((p) => p.availability)).map((v) => (
                <option key={v} value={v}>
                  {v.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        Sort by
        <select name="sort" defaultValue={f.sort ?? "newest"}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="featured">Featured</option>
        </select>
      </label>
      <button className="button" type="submit">
        Apply filters <ArrowUpRight size={16} />
      </button>
      <Link href={path} className="text-link">
        Reset filters
      </Link>
    </form>
  );
}
export function Catalogue({
  products,
  collections,
  filters,
  path = "/shop",
  locked,
  error = false,
}: {
  products: Product[];
  collections: Collection[];
  filters: Filters;
  path?: string;
  locked?: string;
  error?: boolean;
}) {
  const base = locked
    ? products.filter((p) => p.collections.some((c) => c.slug === locked))
    : products;
  const found = filterProducts(base, filters),
    limit = Math.max(1, Math.min(100, Number(filters.page) || 1)) * 12;
  const form = (
    <FilterForm
      products={base}
      collections={collections}
      filters={filters}
      path={path}
      locked={locked}
    />
  );
  return (
    <div className="shop-layout">
      <aside className="desktop-filters">
        <div className="filter-heading">
          <h2>Find your feeling</h2>
        </div>
        {form}
      </aside>
      <div>
        <div className="catalogue-toolbar">
          <p>
            {found.length} {found.length === 1 ? "design" : "designs"}
            {Object.values(filters).some(Boolean) ? " · your selection" : ""}
          </p>
          <MobileFilters>{form}</MobileFilters>
          <Link href="/customise" className="text-link">
            Something uniquely yours <ArrowUpRight size={15} />
          </Link>
        </div>
        {found.length > 0 ? (
          <>
            <div className="product-grid">
              {found.slice(0, limit).map((p, i) => (
                <ProductCard product={p} key={p.id} index={i} />
              ))}
            </div>
            {found.length > limit && (
              <div className="load-more">
                <Link
                  className="button button-outline"
                  href={queryLink(path, filters, {
                    page: String(limit / 12 + 1),
                  })}
                >
                  Discover more designs
                </Link>
                <p className="fine-print">
                  Showing {limit} of {found.length}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Flower2 size={40} strokeWidth={1} />
            <h2>
              {error
                ? "A little pause in the gallery."
                : base.length
                  ? "No matches, just yet."
                  : "Your next set starts\nwith a conversation."}
            </h2>
            <p>
              {error
                ? "We couldn’t load the latest designs. Please try again, or message us personally."
                : base.length
                  ? "Try another colour or collection, or let us create something just for you."
                  : "Individual designs are being added to our gallery. Browse the documented collections or share your inspiration in our Custom Nail Studio."}
            </p>
            <Link href={base.length ? path : "/customise"} className="button">
              {base.length ? "Clear your filters" : "Create your custom set"}{" "}
              <ArrowUpRight size={16} />
            </Link>
            <Link className="text-link" href="/collections">
              Explore the collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
