"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight, Eye } from "lucide-react";
import { money } from "@/lib/brand";
import type { Product } from "@/lib/types";
import { Modal } from "./modal";
import { ProductOptions } from "./product-options";
export function ProductCard({
  product: p,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [quick, setQuick] = useState(false);
  return (
    <article className={`product-card art-${index % 4}`}>
      <div className="product-image">
        <Link href={`/products/${p.slug}`}>
          <Image
            src={p.images[0]?.url ?? "/logo-original.png"}
            alt={p.images[0]?.alt ?? p.name}
            fill
            sizes="(max-width: 600px) 70vw, (max-width: 1000px) 45vw, 24vw"
          />
        </Link>
        {p.demo && <span className="product-badge">DEMO CONCEPT</span>}
        <button
          className="quick-view"
          aria-label={`Quick view ${p.name}`}
          onClick={() => setQuick(true)}
        >
          <Eye size={16} /> Quick view
        </button>
        <button
          className="product-add"
          aria-label={`Choose preferences for ${p.name}`}
          onClick={() => setQuick(true)}
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="product-meta">
        <span className="eyebrow">
          {p.collections[0]?.name ?? "The YK Edit"}
        </span>
        <Link href={`/products/${p.slug}`}>
          <h3>{p.name}</h3>
          <ArrowUpRight size={17} />
        </Link>
        <p>
          {p.starting_price ? "From " : ""}
          {money(p.price)}
        </p>
      </div>
      <Modal open={quick} onOpenChange={setQuick} title={p.name}>
        <p className="small muted">
          {p.demo
            ? "Development sample · not actual inventory"
            : "Choose the details that feel like you."}
        </p>
        <ProductOptions product={p} onAdded={() => setQuick(false)} />
        <Link className="text-link" href={`/products/${p.slug}`}>
          View all details <ArrowUpRight size={15} />
        </Link>
      </Modal>
    </article>
  );
}
