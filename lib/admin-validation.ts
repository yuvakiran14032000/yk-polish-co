import { z } from "zod";
const text = z.string().trim();
const slug = text
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase words separated by hyphens.",
  );
export const imageUrl = text.max(2000).refine((v) => {
  if (v.startsWith("/images/") || v === "/logo-original.png") return true;
  try {
    const url = new URL(v);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.startsWith("/storage/v1/object/public/product-images/")
    );
  } catch {
    return false;
  }
}, "Use an uploaded Supabase product image.");
export const productSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: text.min(2).max(150),
    slug,
    description: text.min(10).max(5000),
    price: z.number().int().min(1).max(1000000),
    starting_price: z.boolean(),
    status: z.enum(["draft", "published", "archived"]),
    availability: z.enum(["made_to_order", "available", "unavailable"]),
    featured: z.boolean(),
    display_order: z.number().int().min(0).max(10000),
    colors: z.array(text.min(1).max(40)).max(20),
    occasions: z.array(text.min(1).max(80)).max(20),
    collection_ids: z.array(z.string().uuid()).min(1).max(13),
    images: z
      .array(
        z.object({
          url: imageUrl,
          alt: text.min(3).max(250),
          display_order: z.number().int().min(0).max(30),
        }),
      )
      .max(20),
    variants: z
      .array(
        z.object({
          shape: text.min(1).max(60),
          length: text.min(1).max(60),
          sizes: z.array(text.min(1).max(100)).min(1).max(30),
        }),
      )
      .max(60),
    addons: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: text.min(1).max(100),
          price: z.number().int().min(0).max(100000),
        }),
      )
      .max(10),
  })
  .superRefine((p, ctx) => {
    if (p.status === "published" && (!p.images.length || !p.variants.length))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "A published design needs at least one image and one configured variant.",
      });
    const keys = p.variants.map((v) => `${v.shape}\0${v.length}`);
    if (new Set(keys).size !== keys.length)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Shape and length combinations must be unique.",
      });
  });
export const collectionSchema = z.object({
  id: z.string().uuid().optional(),
  name: text.min(2).max(100),
  slug,
  starting_price: z.number().int().min(1).max(1000000),
  description: text.min(10).max(2000),
  featured: z.boolean(),
  display_order: z.number().int().min(0).max(10000),
  image_url: z.union([imageUrl, z.literal(""), z.null()]).optional(),
});
export const settingsSchema = z.object({
  whatsapp: text.regex(/^\d{10,15}$/),
  instagram: text
    .url()
    .refine((v) =>
      /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(v),
    ),
  announcement: text.min(1).max(160),
  hero_title: text.min(1).max(160),
  hero_description: text.min(1).max(500),
  hero_image: imageUrl,
});
export const enquiryUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "draft",
    "whatsapp_opened",
    "customer_confirmed_sent",
    "manually_confirmed",
    "cancelled",
  ]),
  admin_notes: text.max(5000),
});
