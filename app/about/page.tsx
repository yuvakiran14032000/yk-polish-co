import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata = {
  title: "Our story",
  description:
    "Meet YK Polish Co. Handmade press-on nails and personalised nail art, made to match every moment. Nails by Yogita.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <div className="container">
      <section className="story-layout">
        <div className="story-logo">
          <Image
            src="/logo-original.png"
            width={502}
            height={502}
            alt="The official YK Polish Co. logo, extracted from the original brand sticker"
          />
        </div>
        <div className="story-copy">
          <p className="eyebrow">NAILS BY YOGITA</p>
          <h1>
            A little art.
            <br />
            <em>Entirely you.</em>
          </h1>
          <p>
            YK Polish Co. is a handmade press-on nails brand with a love for
            personalised nail art. From clean everyday designs to intricate
            bridal details, each collection is a different way to express
            yourself.
          </p>
          <p>
            We believe the little details can hold a whole mood. Your favourite
            colour. A special occasion. The feeling of wearing something that’s
            simply yours.
          </p>
          <p>
            Share what you’re imagining, and we’ll talk through the design, fit
            and finishing touches with you personally.
          </p>
          <Link className="button" href="/customise">
            Let’s create your moment <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <div className="last-note" style={{ marginBottom: 60 }}>
        Made to be admired. <em>Passion in every detail.</em>
      </div>
    </div>
  );
}
