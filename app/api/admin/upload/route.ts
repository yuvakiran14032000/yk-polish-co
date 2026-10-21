import { requireAdmin } from "@/lib/supabase/server";
import { HttpError, json, safeError, sameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const admin = await requireAdmin();
    if (!admin)
      throw new HttpError("An authorised admin session is required.", 401);
    if (Number(request.headers.get("content-length")) > 6000000)
      throw new HttpError("Images must be under 5 MB.", 413);
    const form = await request.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 5 * 1024 * 1024 ||
      file.size === 0
    )
      throw new HttpError("Choose an image under 5 MB.");
    const buf = new Uint8Array(await file.arrayBuffer());
    let ext = "";
    if (
      buf[0] === 0xff &&
      buf[1] === 0xd8 &&
      buf[2] === 0xff &&
      file.type === "image/jpeg"
    )
      ext = "jpg";
    if (
      buf[0] === 137 &&
      buf[1] === 80 &&
      buf[2] === 78 &&
      buf[3] === 71 &&
      file.type === "image/png"
    )
      ext = "png";
    if (
      new TextDecoder().decode(buf.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(buf.slice(8, 12)) === "WEBP" &&
      file.type === "image/webp"
    )
      ext = "webp";
    if (!ext) throw new HttpError("Choose a JPEG, PNG or WebP image.");
    const path = `${admin.user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.client.storage
      .from("product-images")
      .upload(path, buf, { contentType: file.type, upsert: false });
    if (error)
      throw new HttpError(
        "The image could not be uploaded. Check your storage policies.",
      );
    const { data } = admin.client.storage
      .from("product-images")
      .getPublicUrl(path);
    return json({ url: data.publicUrl });
  } catch (e) {
    return safeError(e);
  }
}
