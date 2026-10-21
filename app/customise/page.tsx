import { CustomStudio } from "@/components/custom-studio";
import { getCatalogue } from "@/lib/catalogue";
export const metadata = {
  title: "Custom Nail Studio",
  description:
    "Dream it. We’ll design it. Create a personalised press-on nail brief with YK Polish Co. Customised sets from ₹699+.",
  alternates: { canonical: "/customise" },
};
export default async function Customise() {
  const { settings } = await getCatalogue();
  return (
    <div className="container studio-layout">
      <div className="studio-aside">
        <p className="eyebrow">THE CUSTOM NAIL STUDIO</p>
        <h1>
          Dream it.
          <br />
          <em>We’ll design it.</em>
        </h1>
        <p>
          Your favourite colour. A special outfit. A feeling you want to carry
          with you. Tell us what you’re imagining, and let’s make it personal.
        </p>
        <span className="small">PERSONALISED SETS FROM ₹699+</span>
        <div className="custom-art" aria-hidden="true">
          <div className="studio-orbit" />
          <div className="studio-nail n1" />
          <span className="script">
            a little
            <br />
            more you.
          </span>
        </div>
      </div>
      <CustomStudio settings={settings} />
    </div>
  );
}
