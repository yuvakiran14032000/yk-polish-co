import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { money } from "@/lib/brand";
import type { Collection } from "@/lib/types";
export function CollectionCard({
  collection: c,
  index = 0,
}: {
  collection: Collection;
  index?: number;
}) {
  return (
    <Link
      href={`/collections/${c.slug}`}
      className={`collection-card collection-art-${index % 6}`}
    >
      <div className="nail-composition">
        {c.image_url ? (
          <Image
            src={c.image_url}
            alt={`${c.name} collection`}
            fill
            sizes="(max-width:760px) 45vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="nail-art-inner" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>YK</span>
          </div>
        )}
      </div>
      <div className="collection-caption">
        <div>
          <span className="eyebrow">THE YK COLLECTIONS</span>
          <h3>{c.name}</h3>
          <p>
            From {money(c.starting_price)}
            {["bridal", "customised"].includes(c.slug) ? "+" : ""}
          </p>
        </div>
        <span className="round-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
    </Link>
  );
}
