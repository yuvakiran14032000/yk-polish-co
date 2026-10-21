import { z } from "zod";
export const itemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  shape: z.string().min(1).max(60),
  length: z.string().min(1).max(60),
  size: z.string().min(1).max(100),
  notes: z.string().max(1000).default(""),
  addonIds: z.array(z.string().max(80)).max(10).default([]),
});
export const enquirySchema = z.object({
  items: z.array(itemSchema).min(1).max(30),
  notes: z.string().max(2000).default(""),
});
export const customSchema = z.object({
  occasion: z.string().min(1, "Choose an occasion").max(80),
  colors: z.string().min(1, "Tell us a colour you love").max(200),
  shape: z.string().min(1).max(60),
  length: z.string().min(1).max(60),
  design: z
    .string()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000),
  embellishments: z.array(z.string().max(80)).max(10),
  notes: z.string().max(1000),
});
export type CustomBrief = z.infer<typeof customSchema>;
