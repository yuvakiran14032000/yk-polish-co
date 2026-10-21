"use client";
import Image from "next/image";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import type { ProductImage } from "@/lib/types";
import { Modal } from "./modal";
export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [selected, setSelected] = useState(0),
    [zoom, setZoom] = useState(false);
  const list = images.length
    ? images
    : [{ url: "/logo-original.png", alt: name, display_order: 0 }];
  const current = list[selected];
  return (
    <div>
      <button
        className="gallery-main"
        onClick={() => setZoom(true)}
        aria-label={`Enlarge ${current.alt}`}
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width:760px) 100vw, 50vw"
        />
        <span className="gallery-zoom-label">
          <ZoomIn size={16} /> A closer look
        </span>
      </button>
      {list.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Product images">
          {list.map((im, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={i === selected ? "selected" : ""}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === selected}
            >
              <Image src={im.url} alt={im.alt} width={64} height={80} />
            </button>
          ))}
        </div>
      )}
      <Modal open={zoom} onOpenChange={setZoom} title={name}>
        <Image
          className="zoom-image"
          src={current.url}
          alt={current.alt}
          width={1200}
          height={1500}
        />
      </Modal>
    </div>
  );
}
