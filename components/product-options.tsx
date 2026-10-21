"use client";
import { responseJson, type PreparedEnquiry } from "@/lib/api-client";
import { useState } from "react";
import { ShoppingBag, Check, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/brand";
import type { Product } from "@/lib/types";
export function ProductOptions({
  product: p,
  onAdded,
  direct = false,
}: {
  product: Product;
  onAdded?: () => void;
  direct?: boolean;
}) {
  const [shape, setShape] = useState(p.variants[0]?.shape ?? ""),
    [length, setLength] = useState(p.variants[0]?.length ?? ""),
    [size, setSize] = useState(""),
    [quantity, setQuantity] = useState(1),
    [notes, setNotes] = useState(""),
    [addons, setAddons] = useState<string[]>([]),
    [added, setAdded] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [prepared, setPrepared] = useState<
      (PreparedEnquiry & { selection: string }) | null
    >(null);
  const add = useCart((s) => s.add),
    variant = p.variants.find((v) => v.shape === shape && v.length === length),
    shapes = [...new Set(p.variants.map((v) => v.shape))],
    lengths = [
      ...new Set(
        p.variants.filter((v) => v.shape === shape).map((v) => v.length),
      ),
    ];
  const item = () => ({
    productId: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0]?.url ?? "/logo-original.png",
    price: p.price,
    startingPrice: p.starting_price,
    quantity,
    shape,
    length,
    size,
    notes,
    addonIds: addons,
    addons: p.addons.filter((a) => addons.includes(a.id)),
  });
  const unavailable = p.availability === "unavailable" || !p.variants.length;
  async function enquire() {
    setError("");
    setBusy(true);
    setPrepared(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [item()], notes: "" }),
      });
      const data = await responseJson<PreparedEnquiry>(res);
      if (!res.ok) throw new Error(data.error);
      setPrepared({ ...data, selection: JSON.stringify(item()) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      className="product-options"
      onSubmit={(e) => {
        e.preventDefault();
        if (!variant?.sizes.includes(size)) return;
        if (!add(item())) {
          setError(
            "Your bag can hold up to 30 sets. Please review it before adding more.",
          );
          return;
        }
        setAdded(true);
        onAdded?.();
      }}
    >
      <p className="product-price">
        {p.starting_price ? "From " : ""}
        {money(p.price)} <span>per set</span>
      </p>
      <p className="availability">
        <span />
        {unavailable
          ? "Currently unavailable"
          : p.availability === "made_to_order"
            ? "Made to order · availability confirmed on enquiry"
            : "Available to enquire"}
      </p>
      <fieldset>
        <legend>Nail shape</legend>
        <div className="choice-row">
          {shapes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={shape === s}
              className={shape === s ? "choice selected" : "choice"}
              onClick={() => {
                setShape(s);
                setLength(p.variants.find((v) => v.shape === s)!.length);
                setSize("");
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Length</legend>
        <div className="choice-row">
          {lengths.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={length === l}
              className={length === l ? "choice selected" : "choice"}
              onClick={() => {
                setLength(l);
                setSize("");
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        Size{" "}
        <select value={size} onChange={(e) => setSize(e.target.value)} required>
          <option value="">Choose your size</option>
          {variant?.sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <a href="/nail-guide#sizing" className="small underlined">
        A little help finding your fit
      </a>
      {p.addons.length > 0 && (
        <fieldset>
          <legend>
            Make it yours <span className="muted">(optional)</span>
          </legend>
          {p.addons.map((a) => (
            <label className="checkbox-row" key={a.id}>
              <input
                type="checkbox"
                checked={addons.includes(a.id)}
                onChange={(e) =>
                  setAddons(
                    e.target.checked
                      ? [...addons, a.id]
                      : addons.filter((x) => x !== a.id),
                  )
                }
              />
              {a.name} <span>+{money(a.price)}</span>
            </label>
          ))}
        </fieldset>
      )}
      <label>
        A note for your artist <span className="muted">(optional)</span>
        <textarea
          rows={2}
          maxLength={1000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any details you’d love us to know…"
        />
      </label>
      <div className="add-row">
        <label className="quantity-label">
          <span className="sr-only">Quantity</span>
          <input
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(20, Number(e.target.value) || 1)),
              )
            }
          />
        </label>
        <button className="button" type="submit" disabled={unavailable}>
          {added ? <Check size={17} /> : <ShoppingBag size={17} />}{" "}
          {added ? "Added to your bag" : "Add to enquiry bag"}
        </button>
      </div>
      {direct && (
        <button
          type="button"
          className="button button-outline full-width"
          disabled={busy || unavailable || !variant?.sizes.includes(size)}
          onClick={enquire}
        >
          <MessageCircle size={17} />{" "}
          {busy ? "Checking your preferences…" : "Enquire about this set"}
        </button>
      )}
      {prepared && prepared.selection === JSON.stringify(item()) && (
        <div className="enquiry-ready" role="status">
          <a
            href={prepared.url}
            target="_blank"
            rel="noreferrer"
            className="button full-width"
            onClick={() => {
              if (prepared.token)
                void fetch("/api/enquiries/status", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token: prepared.token,
                    status: "whatsapp_opened",
                  }),
                });
            }}
          >
            Open WhatsApp <MessageCircle size={16} />
          </a>
          <p className="fine-print">
            {prepared.saved
              ? "Reference: " + prepared.reference
              : "This enquiry has not been saved to a database."}{" "}
            Send your message in WhatsApp. Opening it does not send a message or
            confirm an order.
          </p>
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p className="fine-print">
        Final price, sizing and shipping are confirmed personally.
      </p>
    </form>
  );
}
