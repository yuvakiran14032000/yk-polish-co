import { z } from "zod";
export const savedItemSchema = z.object({
  key: z.string().uuid(),
  productId: z.string().uuid(),
  name: z.string().min(1).max(150),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  image: z
    .string()
    .max(2000)
    .refine(
      (v) =>
        (v.startsWith("/") && !v.startsWith("//")) || v.startsWith("https://"),
    ),
  price: z.number().int().min(1).max(1000000),
  startingPrice: z.boolean(),
  quantity: z.number().int().min(1).max(20),
  shape: z.string().max(60),
  length: z.string().max(60),
  size: z.string().max(100),
  notes: z.string().max(1000),
  addonIds: z.array(z.string().max(80)).max(10),
  addons: z
    .array(
      z.object({
        id: z.string().max(80),
        name: z.string().max(100),
        price: z.number().int().min(0).max(100000),
      }),
    )
    .max(10),
});
export function restoreItems(persisted: unknown) {
  const parsed = z
    .object({ items: z.array(savedItemSchema).max(30) })
    .safeParse(persisted);
  return parsed.success ? parsed.data.items : [];
}
