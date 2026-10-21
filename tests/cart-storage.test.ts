import { test } from "node:test";
import assert from "node:assert/strict";
import { restoreItems } from "../lib/cart-storage";
const item = {
  key: "10000000-0000-4000-8000-000000000001",
  productId: "10000000-0000-4000-8000-000000000002",
  name: "Development sample",
  slug: "development-sample",
  image: "/images/editorial-concept.webp",
  price: 399,
  startingPrice: true,
  quantity: 2,
  shape: "Almond",
  length: "Short",
  size: "Need sizing assistance",
  notes: "",
  addonIds: [],
  addons: [],
};
test("persistent cart survives a JSON round trip with preferences intact", () => {
  assert.deepEqual(
    restoreItems(JSON.parse(JSON.stringify({ items: [item] }))),
    [item],
  );
});
test("corrupt or unsafe saved cart values reset safely", () => {
  for (const value of [
    null,
    {},
    { items: "broken" },
    { items: [{ ...item, quantity: -1 }] },
    { items: [{ ...item, image: "javascript:alert(1)" }] },
    { items: Array(31).fill(item) },
  ])
    assert.deepEqual(restoreItems(value), []);
});
