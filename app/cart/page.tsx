import { BagContent } from "@/components/bag";
import { getCatalogue } from "@/lib/catalogue";
export const metadata = {
  title: "Your enquiry bag",
  robots: { index: false, follow: true },
};
export default async function Cart() {
  const { settings, products } = await getCatalogue();
  return (
    <div className="container cart-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR FAVOURITES, ONE CONVERSATION</p>
        <h1>
          Your enquiry <em>bag.</em>
        </h1>
        <p>
          A little closer to your next set. We’ll confirm every detail with you
          personally.
        </p>
      </div>
      <BagContent settings={settings} products={products} />
    </div>
  );
}
