import Link from "next/link";
import { Flower2 } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container empty-state">
      <Flower2 size={45} strokeWidth={1} />
      <p className="eyebrow">A LITTLE DETOUR</p>
      <h1>
        This moment
        <br />
        has <em>moved.</em>
      </h1>
      <p>
        We couldn’t find that page or published design. Your next favourite is
        still out there.
      </p>
      <Link className="button" href="/collections">
        Explore the collections
      </Link>
    </div>
  );
}
