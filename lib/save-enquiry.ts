import "server-only";
import { serviceClient, isConfigured } from "./supabase/server";
import { hash, HttpError } from "./http";
import type { CartItem } from "./types";
import { subtotal } from "./enquiry";
export async function saveEnquiry(
  items: CartItem[],
  notes: string,
  brief: unknown = null,
) {
  const client = serviceClient();
  if (!client) {
    if (isConfigured())
      throw new HttpError(
        "Enquiry storage needs attention. Please message us directly on WhatsApp.",
        503,
      );
    return { saved: false, reference: null, token: undefined };
  }
  const token = crypto.randomUUID() + crypto.randomUUID(),
    reference = `YK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const payload = {
    reference,
    token_hash: await hash(token),
    notes,
    brief,
    estimated_subtotal: subtotal(items),
    items: items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      unit_price: i.price,
      name: i.name,
      slug: i.slug,
      shape: i.shape,
      length: i.length,
      size: i.size,
      notes: i.notes,
      addons: i.addons,
      starting_price: i.startingPrice,
    })),
  };
  const { error } = await client.rpc("create_enquiry", { p_payload: payload });
  if (error)
    throw new HttpError(
      "A design or price may have changed. Please refresh your bag and try again, or message us directly.",
      409,
    );
  return { saved: true, reference, token };
}
