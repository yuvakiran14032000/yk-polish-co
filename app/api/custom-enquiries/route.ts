import { getCatalogue } from "@/lib/catalogue";
import { customSchema } from "@/lib/validation";
import { customMessage, whatsappUrl } from "@/lib/enquiry";
import {
  body,
  HttpError,
  json,
  rateLimit,
  safeError,
  sameOrigin,
} from "@/lib/http";
import { saveEnquiry } from "@/lib/save-enquiry";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit(request, "enquiry");
    const parsed = customSchema.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(
        "Please complete the occasion, colours and design description.",
      );
    if (encodeURIComponent(customMessage(parsed.data)).length > 14000)
      throw new HttpError("Please shorten your brief a little for WhatsApp.");
    const { settings } = await getCatalogue();
    const saved = await saveEnquiry([], "Custom Nail Studio", parsed.data);
    const message = customMessage(parsed.data, saved.reference);
    return json({
      ...saved,
      message,
      url: whatsappUrl(settings.whatsapp, message),
    });
  } catch (e) {
    return safeError(e);
  }
}
