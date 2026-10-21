import { getCatalogue } from "@/lib/catalogue";
import { Catalogue } from "@/components/catalogue";
import type { Filters } from "@/lib/filter";
export const metadata = {
  title: "Shop handmade press-on nails",
  description:
    "Explore YK Polish Co. designs by collection, colour and occasion. Choose your preferences and enquire personally.",
  alternates: { canonical: "/shop" },
};
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: Filters = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  const { products, collections, error } = await getCatalogue();
  return (
    <div className="container">
      <div className="page-heading">
        <p className="eyebrow">A LITTLE ART. A WHOLE LOT OF YOU.</p>
        <h1>
          Find your next <em>mood.</em>
        </h1>
        <p>
          Handmade press-ons for the everyday, the unforgettable, and every
          version of you in between.
        </p>
      </div>
      <Catalogue
        products={products}
        collections={collections}
        filters={filters}
        error={error}
      />
    </div>
  );
}
