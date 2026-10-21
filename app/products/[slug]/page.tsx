import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogue } from "@/lib/catalogue";
import { ProductGallery } from "@/components/product-gallery";
import { ProductOptions } from "@/components/product-options";
import { ProductCard } from "@/components/product-card";
import { BreadcrumbData } from "@/components/breadcrumb-data";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products } = await getCatalogue();
  const p = products.find((p) => p.slug === slug);
  return {
    title: p?.name ?? "Design not found",
    description: p?.description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      images: p?.images.map((im) => ({ url: im.url, alt: im.alt })),
    },
    robots: p?.demo ? { index: false, follow: false } : undefined,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products } = await getCatalogue();
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const related = products
    .filter(
      (x) =>
        x.id !== p.id &&
        x.collections.some((c) => p.collections.some((pc) => pc.id === c.id)),
    )
    .slice(0, 4);
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((im) => im.url),
    brand: { "@type": "Brand", name: "YK Polish Co." },
    ...(base ? { url: `${base}/products/${p.slug}` } : {}),
  };
  return (
    <div className="container">
      <BreadcrumbData
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: p.name, path: `/products/${p.slug}` },
        ]}
      />
      <div style={{ paddingTop: 30 }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span>{p.name}</span>
        </nav>
      </div>
      {!p.demo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
          }}
        />
      )}
      {p.demo && (
        <p className="notice">
          Development sample · illustrative artwork, not confirmed YK inventory.
        </p>
      )}
      <div className="product-detail">
        <ProductGallery images={p.images} name={p.name} />
        <div className="product-detail-copy">
          <p className="eyebrow">
            {p.collections.map((c) => c.name).join(" · ")}
          </p>
          <h1>{p.name}</h1>
          <p className="product-description">{p.description}</p>
          <ProductOptions product={p} direct />
          <div className="product-info">
            {[
              [
                "A little kit, a lovely beginning",
                "An application kit is included with every set. Follow the application instructions for clean, dry nails.",
              ],
              [
                "Shipping & your enquiry",
                "Shipping is charged separately. We’ll confirm availability, the final price and shipping with you personally. Enquiring does not confirm an order.",
              ],
              [
                "Keep. Reuse. Relove.",
                "Apply with patience and remove gently. Never pull or peel the nails off. Store your cleaned and dried press-ons in their original box.",
              ],
            ].map(([title, body]) => (
              <details key={title}>
                <summary>{title} +</summary>
                <p>{body}</p>
              </details>
            ))}
            <Link href="/nail-guide" className="text-link">
              Read the complete nail guide
            </Link>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <h2>
              A little more <em>your style.</em>
            </h2>
          </div>
          <div className="product-grid home-products">
            {related.map((r, i) => (
              <ProductCard key={r.id} product={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
