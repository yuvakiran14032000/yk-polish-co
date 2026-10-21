export type Collection = {
  id: string;
  name: string;
  slug: string;
  starting_price: number;
  description: string;
  featured: boolean;
  display_order: number;
  image_url?: string | null;
};
export type ProductImage = {
  id?: string;
  url: string;
  alt: string;
  display_order: number;
};
export type Variant = {
  id?: string;
  shape: string;
  length: string;
  sizes: string[];
};
export type Addon = { id: string; name: string; price: number };
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  starting_price: boolean;
  status: "draft" | "published" | "archived";
  availability: "made_to_order" | "available" | "unavailable";
  featured: boolean;
  display_order: number;
  created_at: string;
  colors: string[];
  occasions: string[];
  images: ProductImage[];
  variants: Variant[];
  addons: Addon[];
  collections: Collection[];
  demo?: boolean;
};
export type CartItem = {
  key: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  startingPrice: boolean;
  quantity: number;
  shape: string;
  length: string;
  size: string;
  notes: string;
  addonIds: string[];
  addons: Addon[];
};
export type Settings = {
  whatsapp: string;
  instagram: string;
  announcement: string;
  hero_title: string;
  hero_description: string;
  hero_image: string;
};
export type EnquiryStatus =
  | "draft"
  | "whatsapp_opened"
  | "customer_confirmed_sent"
  | "manually_confirmed"
  | "cancelled";
