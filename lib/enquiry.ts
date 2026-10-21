import { money } from "./brand";
import type { CartItem, Product } from "./types";
import type { CustomBrief } from "./validation";
export function validateCart(
  items: {
    productId: string;
    quantity: number;
    shape: string;
    length: string;
    size: string;
    notes: string;
    addonIds: string[];
  }[],
  products: Product[],
): CartItem[] {
  return items.map((item, i) => {
    const p = products.find(
      (p) =>
        p.id === item.productId &&
        p.status === "published" &&
        p.availability !== "unavailable",
    );
    if (!p)
      throw new Error(
        "A selected design is no longer available. Please update your bag.",
      );
    const variant = p.variants.find(
      (v) =>
        v.shape === item.shape &&
        v.length === item.length &&
        v.sizes.includes(item.size),
    );
    if (!variant)
      throw new Error(`Please update the preferences for ${p.name}.`);
    const ids = [...new Set(item.addonIds)],
      addons = p.addons.filter((a) => ids.includes(a.id));
    if (addons.length !== ids.length)
      throw new Error(
        `An add-on for ${p.name} has changed. Please update your bag.`,
      );
    return {
      ...item,
      key: String(i),
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.url ?? "/logo-original.png",
      price: p.price,
      startingPrice: p.starting_price,
      addons,
      addonIds: ids,
    };
  });
}
export const linePrice = (item: CartItem) =>
  item.price + item.addons.reduce((n, a) => n + a.price, 0);
export const subtotal = (items: CartItem[]) =>
  items.reduce((n, i) => n + linePrice(i) * i.quantity, 0);
export function enquiryMessage(
  items: CartItem[],
  notes = "",
  reference?: string | null,
) {
  return `Hi YK Polish Co.! 💅\n\nI'd love to enquire about these press-on nail sets:${reference ? `\nEnquiry reference: ${reference}` : ""}\n\n${items.map((i, n) => `${n + 1}. ${i.name}\nQuantity: ${i.quantity}\nShape: ${i.shape}\nLength: ${i.length}\nSize: ${i.size}\nPrice: ${i.startingPrice ? "from " : ""}${money(i.price)} each${i.addons.length ? "\nAdd-ons: " + i.addons.map((a) => `${a.name} (${money(a.price)})`).join(", ") : ""}${i.notes ? "\nNotes: " + i.notes : ""}`).join("\n\n")}\n\nEstimated subtotal: ${money(subtotal(items))}${items.some((i) => i.startingPrice) ? " (starting prices)" : ""}\nShipping charged separately.${notes ? "\n\nSpecial instructions:\n" + notes : ""}\n\nCould you please confirm availability, final pricing, sizing and shipping charges?\n\nThank you!`;
}
export function customMessage(b: CustomBrief, reference?: string | null) {
  return `Hi YK Polish Co.! I'd love a custom set. 💅${reference ? "\nEnquiry reference: " + reference : ""}\n\nOccasion: ${b.occasion}\nColours: ${b.colors}\nShape preference: ${b.shape}\nLength preference: ${b.length}\nDesign: ${b.design}\nEmbellishments: ${b.embellishments.join(", ") || "None requested"}\nNotes: ${b.notes || "None"}\n\nI understand custom sets start at ₹699+. Please confirm design feasibility, sizing, final pricing and separate shipping. I can share reference images here.`;
}
export const whatsappUrl = (number: string, message: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
