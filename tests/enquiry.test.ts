import { test } from "node:test";
import assert from "node:assert/strict";
import { collections, demoProducts } from "../lib/brand";
import { enquirySchema, customSchema } from "../lib/validation";
import {
  validateCart,
  subtotal,
  enquiryMessage,
  whatsappUrl,
  customMessage,
} from "../lib/enquiry";
import { filterProducts, queryLink } from "../lib/filter";
const request = {
  productId: demoProducts[0].id,
  quantity: 2,
  shape: "Almond",
  length: "Short",
  size: "Need sizing assistance",
  notes: "A tiny gold detail & rose",
  addonIds: ["charms"],
};
test("documented collection tiers are exact and have stable unique slugs", () => {
  assert.deepEqual(
    collections.map((c) => c.starting_price),
    [399, 399, 499, 499, 499, 499, 599, 599, 599, 599, 699, 799, 699],
  );
  assert.equal(new Set(collections.map((c) => c.slug)).size, 13);
});
test("server snapshot ignores forged names, prices and image URLs", () => {
  const items = validateCart(
    [
      {
        ...request,
        price: 1,
        name: "Forged",
        addons: [{ price: -500 }],
      } as typeof request,
    ],
    demoProducts,
  );
  assert.equal(items[0].price, 399);
  assert.equal(items[0].name, "Blush Study");
  assert.equal(subtotal(items), 898);
});
test("unknown, archived or unavailable products cannot be enquired about", () => {
  assert.throws(() =>
    validateCart([{ ...request, productId: "missing" }], demoProducts),
  );
  assert.throws(() =>
    validateCart(
      [request],
      demoProducts.map((p) => ({ ...p, status: "draft" })),
    ),
  );
  assert.throws(() =>
    validateCart(
      [request],
      demoProducts.map((p) => ({ ...p, availability: "unavailable" })),
    ),
  );
});
test("only configured shape / length / size combinations and add-ons are valid", () => {
  for (const patch of [
    { shape: "Stiletto" },
    { length: "Long" },
    { size: "Unsupported" },
    { addonIds: ["unknown"] },
  ])
    assert.throws(() => validateCart([{ ...request, ...patch }], demoProducts));
});
test("quantity, notes and bag length are bounded", () => {
  for (const quantity of [0, -1, 1.5, 21, NaN])
    assert.equal(
      enquirySchema.safeParse({ items: [{ ...request, quantity }] }).success,
      false,
    );
  assert.equal(enquirySchema.safeParse({ items: [] }).success, false);
  assert.equal(
    enquirySchema.safeParse({ items: Array(31).fill(request) }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({
      items: [{ ...request, notes: "x".repeat(1001) }],
    }).success,
    false,
  );
  assert.equal(enquirySchema.safeParse({ items: [request] }).success, true);
});
test("multi-product message includes options, quantities, addons, notes and actual totals", () => {
  const items = validateCart(
    [
      request,
      { ...request, productId: demoProducts[1].id, quantity: 1, addonIds: [] },
    ],
    demoProducts,
  );
  const message = enquiryMessage(items, "Help me size both sets.", "YK-TEST");
  for (const part of [
    "1. Blush Study",
    "2. Lilac Reverie",
    "Quantity: 2",
    "Shape: Almond",
    "Size: Need sizing assistance",
    "Extra charms (demo)",
    "A tiny gold detail & rose",
    "₹1,397",
    "YK-TEST",
    "Shipping charged separately",
    "final pricing",
  ])
    assert.ok(message.includes(part), part);
  const url = new URL(whatsappUrl("+91 9611435929", message));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/919611435929");
  assert.equal(url.searchParams.get("text"), message);
});
test("custom brief validates and never implies confirmed design feasibility", () => {
  const b = {
    occasion: "Bridal",
    colors: "Ivory & rose",
    shape: "Please help me choose",
    length: "Short",
    design: "Fine flowers with gold details",
    embellishments: ["Pearls"],
    notes: "",
  };
  assert.equal(customSchema.safeParse(b).success, true);
  assert.equal(customSchema.safeParse({ ...b, design: "tiny" }).success, false);
  assert.match(customMessage(b), /₹699\+/);
  assert.match(customMessage(b), /confirm design feasibility/);
});
test("URL-driven filters combine and sort without mutating source data", () => {
  const source = [...demoProducts];
  assert.equal(
    filterProducts(source, {
      collection: "everyday",
      color: "Blush",
      shape: "Almond",
      max: "400",
    }).length,
    1,
  );
  assert.equal(filterProducts(source, { q: "NO SUCH DESIGN" }).length, 0);
  assert.deepEqual(
    filterProducts(source, { sort: "price-asc" }).map((p) => p.price),
    [399, 399, 499, 599, 699, 799],
  );
  assert.equal(source[0].name, "Blush Study");
  assert.equal(
    queryLink("/shop", { color: "Ivory", q: "rose & gold" }, { page: "2" }),
    "/shop?color=Ivory&q=rose+%26+gold&page=2",
  );
});
