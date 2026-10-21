import { getCatalogue } from "@/lib/catalogue";
import { enquirySchema } from "@/lib/validation";
import { validateCart, enquiryMessage, whatsappUrl } from "@/lib/enquiry";
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
    const parsed = enquirySchema.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(
        "Please check your quantities and product preferences.",
      );
    const { products, settings, error } = await getCatalogue();
    if (error)
      throw new HttpError(
        "We couldn’t verify the latest catalogue. Please try again shortly.",
        503,
      );
    let items;
    try {
      items = validateCart(parsed.data.items, products);
    } catch (e) {
      throw new HttpError(
        e instanceof Error ? e.message : "Please update your bag.",
        409,
      );
    }
    if (
      encodeURIComponent(enquiryMessage(items, parsed.data.notes)).length >
      14000
    )
      throw new HttpError(
        "Your enquiry is too long for WhatsApp. Please shorten your notes or split the bag.",
      );
    const saved = items.some(
      (i) => products.find((p) => p.id === i.productId)?.demo,
    )
      ? { saved: false, reference: null, token: undefined }
      : await saveEnquiry(items, parsed.data.notes);
    const message = enquiryMessage(items, parsed.data.notes, saved.reference);
    return json({
      ...saved,
      message,
      url: whatsappUrl(settings.whatsapp, message),
    });
  } catch (e) {
    return safeError(e);
  }
}
