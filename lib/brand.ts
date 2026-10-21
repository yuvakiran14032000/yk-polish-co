import type { Collection, Product, Settings } from "./types";
export const brand = {
  name: "YK Polish Co.",
  whatsapp: "919611435929",
  instagram: "https://www.instagram.com/ykpolishco/",
  tagline: "Your Nails. Your Mood. Your Moment.",
};
export const defaults: Settings = {
  whatsapp: brand.whatsapp,
  instagram: brand.instagram,
  announcement: "Handmade for your moments. An application kit with every set.",
  hero_title: "Your Nails. Your Mood. Your Moment.",
  hero_description:
    "Handcrafted press-on nails for every version of you. A little art. A little self-expression. Entirely yours.",
  hero_image: "/images/editorial-concept.webp",
};
const rows: [string, string, number, string][] = [
  [
    "Everyday",
    "everyday",
    399,
    "The little details that make an ordinary day feel like you. Simple, clean, everyday designs.",
  ],
  [
    "Minimalist",
    "minimalist",
    399,
    "A quieter kind of statement. Clean designs and considered details.",
  ],
  [
    "Corporate Girlies",
    "corporate-girlies",
    499,
    "Easy-to-wear designs for your workday moments.",
  ],
  [
    "Moms-to-Be",
    "moms-to-be",
    499,
    "A personal little detail for a special chapter.",
  ],
  [
    "College & Events",
    "college-events",
    499,
    "For campus days, celebrations, and everything in between.",
  ],
  [
    "Vacation",
    "vacation",
    499,
    "A little nail art to take along on your next escape.",
  ],
  [
    "Party Ready",
    "party-ready",
    599,
    "Detailed, occasion-ready designs with a playful spirit.",
  ],
  [
    "Festive Vibes",
    "festive-vibes",
    599,
    "Nail art made to meet your celebratory mood.",
  ],
  [
    "Occasion Ready",
    "occasion-ready",
    599,
    "Considered details for the moments you dress up for.",
  ],
  [
    "Gifting",
    "gifting",
    599,
    "A thoughtful expression of their personal style.",
  ],
  ["Statement", "statement", 699, "Bold designs with elevated detailing."],
  [
    "Bridal",
    "bridal",
    799,
    "Intricate, elegant nail art for your bridal moments.",
  ],
  [
    "Customised",
    "customised",
    699,
    "Your inspiration, translated into a set that feels personal.",
  ],
];
export const collections: Collection[] = rows.map(
  ([name, slug, starting_price, description], i) => ({
    id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`,
    name,
    slug,
    starting_price,
    description,
    featured: [0, 1, 2, 6, 10, 11].includes(i),
    display_order: i,
  }),
);
export const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
export const demoEnabled = () =>
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_ENABLE_DEMO === "true";
export const demoProducts: Product[] = [
  "Blush Study",
  "Lilac Reverie",
  "The French Muse",
  "Rose After Hours",
  "Pearl Poetry",
  "A Little Drama",
].map((name, i) => ({
  id: `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  description:
    "Development sample only. This illustrative design is here to demonstrate the shopping experience and is not confirmed YK inventory.",
  price: [399, 499, 399, 599, 799, 699][i],
  starting_price: true,
  status: "published",
  availability: "made_to_order",
  featured: i < 4,
  display_order: i,
  created_at: "2026-10-01T00:00:00Z",
  colors: [["Blush"], ["Lilac"], ["Ivory"], ["Burgundy"], ["Ivory"], ["Plum"]][
    i
  ],
  occasions: [
    ["Everyday"],
    ["Vacation"],
    ["Office"],
    ["Party"],
    ["Bridal"],
    ["Festive"],
  ][i],
  images: [
    {
      url: "/images/editorial-concept.webp",
      alt: "AI-generated nail art concept; development sample",
      display_order: 0,
    },
  ],
  variants: [
    {
      shape: "Almond",
      length: "Short",
      sizes: ["Need sizing assistance", "Custom measurements"],
    },
    {
      shape: "Almond",
      length: "Medium",
      sizes: ["Need sizing assistance", "Custom measurements"],
    },
    { shape: "Square", length: "Short", sizes: ["Need sizing assistance"] },
  ],
  addons: [{ id: "charms", name: "Extra charms (demo)", price: 50 }],
  collections: [collections[[0, 5, 1, 6, 11, 10][i]]],
  demo: true,
}));
export const faqs = [
  [
    "How do I order?",
    "Explore a collection or choose a design, tell us your preferences, and send your enquiry through WhatsApp. We will confirm sizing, availability, final pricing and shipping with you. Opening WhatsApp does not confirm an order.",
  ],
  [
    "Can I reuse my press-ons?",
    "Yes, with proper removal and care. Adhesive tabs are best for temporary wear and easy reuse. Glue-applied nails may be reusable if removed gently. Keep them in their original box.",
  ],
  [
    "How do I choose my size?",
    "Choose a press-on that fits each natural nail. If you are unsure, select “Need sizing assistance” or message us before ordering. We will help you confirm the fit.",
  ],
  [
    "Is an application kit included?",
    "Yes. An application kit is included with every set, as listed in our pricing catalogue.",
  ],
  [
    "Can I customise a design?",
    "Of course. Share your occasion, colours and inspiration in our Custom Nail Studio. Customised sets start at ₹699+. Final pricing depends on the design and details.",
  ],
  [
    "Are shipping charges included?",
    "Shipping is charged separately and confirmed with your enquiry. It is not included in your estimated bag subtotal.",
  ],
  [
    "How do I remove my nails?",
    "Soak fingertips in warm, soapy water for 10–15 minutes. Gently loosen the sides with the cuticle stick. Soak longer if needed. Never force, pull or peel the nails off.",
  ],
];
