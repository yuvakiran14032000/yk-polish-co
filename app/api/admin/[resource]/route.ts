import { requireAdmin } from "@/lib/supabase/server";
import { body, HttpError, json, safeError, sameOrigin } from "@/lib/http";
import {
  productSchema,
  collectionSchema,
  settingsSchema,
  enquiryUpdateSchema,
} from "@/lib/admin-validation";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    sameOrigin(request);
    const admin = await requireAdmin();
    if (!admin)
      throw new HttpError("An authorised admin session is required.", 401);
    const { resource } = await params;
    const value = await body(request, 100000);
    if (resource === "products") {
      const p = productSchema.safeParse(value);
      if (!p.success) throw new HttpError(p.error.issues[0].message);
      const { data, error } = await admin.client.rpc("save_product", {
        p_payload: p.data,
      });
      if (error)
        throw new HttpError(
          "Unable to save the design. Check the slug, collection and variant details.",
          400,
        );
      return json({ ok: true, id: data });
    }
    if (resource === "collections") {
      const c = collectionSchema.safeParse(value);
      if (!c.success) throw new HttpError(c.error.issues[0].message);
      const { error } = await admin.client
        .from("collections")
        .upsert({
          ...c.data,
          image_url: c.data.image_url || null,
          id: c.data.id ?? crypto.randomUUID(),
        });
      if (error)
        throw new HttpError(
          "Unable to save the collection. Check for a duplicate slug.",
        );
      return json({ ok: true });
    }
    if (resource === "settings") {
      const s = settingsSchema.safeParse(value);
      if (!s.success) throw new HttpError(s.error.issues[0].message);
      const { error } = await admin.client
        .from("site_settings")
        .upsert({ id: "main", value: s.data });
      if (error) throw new HttpError("Unable to update website settings.");
      return json({ ok: true });
    }
    if (resource === "enquiries") {
      const p = enquiryUpdateSchema.safeParse(value);
      if (!p.success)
        throw new HttpError("Please check the enquiry status and notes.");
      const { id, ...patch } = p.data;
      const { error } = await admin.client
        .from("enquiries")
        .update(patch)
        .eq("id", id);
      if (error) throw new HttpError("Unable to update this enquiry.");
      return json({ ok: true });
    }
    throw new HttpError("Unknown management action.", 404);
  } catch (e) {
    return safeError(e);
  }
}
