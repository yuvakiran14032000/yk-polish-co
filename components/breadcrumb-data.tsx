export function BreadcrumbData({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, n) => ({
      "@type": "ListItem",
      position: n + 1,
      name: i.name,
      item: new URL(i.path, base).href,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
