"use client";
import Link from "next/link";
import type { CartItem, Product } from "@/lib/types";
import { money } from "@/lib/brand";
export function BagPreferences({
  item,
  product,
  update,
}: {
  item: CartItem;
  product?: Product;
  update: (patch: Partial<CartItem>) => void;
}) {
  if (!product)
    return (
      <p className="fine-print">
        Reopen this design to check the current options, or remove it if it is
        no longer published.{" "}
        <Link className="underlined" href={`/products/${item.slug}`}>
          View design
        </Link>
      </p>
    );
  const shapes = [...new Set(product.variants.map((v) => v.shape))],
    lengths = [
      ...new Set(
        product.variants
          .filter((v) => v.shape === item.shape)
          .map((v) => v.length),
      ),
    ],
    sizes =
      product.variants.find(
        (v) => v.shape === item.shape && v.length === item.length,
      )?.sizes ?? [];
  return (
    <>
      <label>
        Shape
        <select
          value={shapes.includes(item.shape) ? item.shape : ""}
          onChange={(e) => {
            const v = product.variants.find((v) => v.shape === e.target.value);
            update({
              shape: e.target.value,
              length: v?.length ?? "",
              size: "",
            });
          }}
        >
          <option value="">Choose shape</option>
          {shapes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        Length
        <select
          value={lengths.includes(item.length) ? item.length : ""}
          onChange={(e) => update({ length: e.target.value, size: "" })}
        >
          <option value="">Choose length</option>
          {lengths.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>
      <label>
        Size
        <select
          value={sizes.includes(item.size) ? item.size : ""}
          onChange={(e) => update({ size: e.target.value })}
        >
          <option value="">Choose size</option>
          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      {product.addons.map((a) => (
        <label key={a.id} className="checkbox-row">
          <input
            type="checkbox"
            checked={item.addonIds.includes(a.id)}
            onChange={(e) => {
              const ids = e.target.checked
                ? [...item.addonIds, a.id]
                : item.addonIds.filter((id) => id !== a.id);
              update({
                addonIds: ids,
                addons: product.addons.filter((a) => ids.includes(a.id)),
              });
            }}
          />
          {a.name} +{money(a.price)}
        </label>
      ))}
      <label>
        Notes
        <textarea
          value={item.notes}
          maxLength={1000}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </label>
      <p className="fine-print">
        Your selections and prices are checked again before preparing an
        enquiry.
      </p>
    </>
  );
}
