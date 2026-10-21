import { z } from "zod";
import { serviceClient } from "@/lib/supabase/server";
import {
  body,
  hash,
  HttpError,
  json,
  rateLimit,
  safeError,
  sameOrigin,
} from "@/lib/http";
const schema = z.object({
  token: z.string().length(72),
  status: z.enum(["whatsapp_opened", "customer_confirmed_sent"]),
});
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit(request, "status");
    const parsed = schema.safeParse(await body(request, 2000));
    if (!parsed.success) throw new HttpError("Invalid enquiry status request.");
    const client = serviceClient();
    if (!client) throw new HttpError("Enquiry storage is unavailable.", 503);
    const permitted =
      parsed.data.status === "whatsapp_opened"
        ? ["draft"]
        : ["draft", "whatsapp_opened"];
    const { error } = await client
      .from("enquiries")
      .update({ status: parsed.data.status })
      .eq("token_hash", await hash(parsed.data.token))
      .gt("token_expires_at", new Date().toISOString())
      .in("status", permitted);
    if (error)
      throw new HttpError("Unable to update your enquiry status.", 503);
    return json({ ok: true });
  } catch (e) {
    return safeError(e);
  }
}
