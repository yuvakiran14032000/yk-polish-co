import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCatalogue } from "@/lib/catalogue";
import { CollectionCard } from "@/components/collection-card";
export const metadata = {
  title: "The collections",
  description:
    "Discover all 13 YK Polish Co. press-on nail collections. Everyday sets from ₹399, bridal from ₹799+ and custom nail art from ₹699+.",
  alternates: { canonical: "/collections" },
};
export default async function Collections() {
  const { collections } = await getCatalogue();
  return (
    <div className="container">
      <div className="page-heading">
        <p className="eyebrow">MADE TO MATCH EVERY MOMENT</p>
        <h1>
          Every side of <em>you.</em>
        </h1>
        <p>
          Quiet mornings. Big plans. Your kind of occasion. Find the collection
          that feels like your moment.
        </p>
      </div>
      <div className="collection-grid">
        {collections.map((c, i) => (
          <CollectionCard key={c.id} collection={c} index={i} />
        ))}
      </div>
      <p className="fine-print collection-disclosure">
        Illustrative collection artwork. All prices are starting prices; final
        designs, details and availability are confirmed personally.
      </p>
      <div className="section">
        <div className="collection-intro">
          <div>
            <p className="eyebrow">THE LITTLE EXTRAS</p>
            <h2>
              A little more <em>personal.</em>
            </h2>
            <p>
              Extra charms / 3D elements: +₹50–₹150
              <br />
              Heavy embellishments: +₹100–₹250
              <br />
              Highly detailed custom art: +₹100 onwards
            </p>
            <p>
              An application kit is included with every set. Shipping is charged
              separately. Add-on pricing is confirmed for your chosen design.
            </p>
            <a
              href="/references/pricing-brochure.pdf"
              target="_blank"
              className="text-link"
              rel="noreferrer"
            >
              View the official pricing catalogue <ArrowUpRight size={16} />
            </a>
          </div>
          <div>
            <h3>Have something in mind?</h3>
            <p>
              Share the colours, the outfit, the occasion. We’ll work on the
              little details together.
            </p>
            <Link href="/customise" className="button">
              Visit the Custom Nail Studio <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
