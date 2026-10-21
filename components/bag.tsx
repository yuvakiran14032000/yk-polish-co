"use client";
import { responseJson, type PreparedEnquiry } from "@/lib/api-client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/brand";
import { enquiryMessage, linePrice, subtotal } from "@/lib/enquiry";
import type { Settings, Product } from "@/lib/types";
import { Modal } from "./modal";
import { BagPreferences } from "./bag-preferences";
const subscribe = () => () => {};
export function BagContent({
  settings,
  compact = false,
  products = [],
}: {
  settings: Settings;
  compact?: boolean;
  products?: Product[];
}) {
  const { items, update, remove, clear, setOpen } = useCart(),
    mounted = useSyncExternalStore(
      subscribe,
      () => true,
      () => false,
    );
  const [notes, setNotes] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false),
    [prepared, setPrepared] = useState<{
      url: string;
      reference: string | null;
      saved: boolean;
      token?: string;
    } | null>(null),
    [confirmed, setConfirmed] = useState(false);
  if (!mounted) return <p className="muted">Opening your bag…</p>;
  if (!items.length)
    return (
      <div className="empty-state">
        <ShoppingBag size={42} strokeWidth={1} />
        <h2>
          A little room for
          <br />
          <em>your next mood.</em>
        </h2>
        <p>Your enquiry bag is waiting for something you love.</p>
        <Link href="/shop" className="button" onClick={() => setOpen(false)}>
          Explore the designs <ArrowRight size={17} />
        </Link>
        <Link
          href="/collections"
          className="text-link"
          onClick={() => setOpen(false)}
        >
          Browse collections
        </Link>
      </div>
    );
  async function prepare() {
    setBusy(true);
    setError("");
    setPrepared(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, notes }),
      });
      const data = await responseJson<PreparedEnquiry>(res);
      if (!res.ok)
        throw new Error(data.error ?? "Unable to prepare your enquiry.");
      setPrepared(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function track(status: string) {
    if (!prepared?.token) return;
    try {
      const res = await fetch("/api/enquiries/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: prepared.token, status }),
      });
      if (!res.ok) throw new Error();
      if (status === "customer_confirmed_sent") setConfirmed(true);
    } catch {
      setError(
        "Your enquiry is ready, but its status could not be updated. You can still contact us.",
      );
    }
  }
  return (
    <div className={compact ? "bag-content compact" : "bag-content"}>
      <div className="bag-items">
        {items.map((i) => (
          <article key={i.key} className="bag-item">
            <Image src={i.image} alt={i.name} width={90} height={112} />
            <div>
              <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)}>
                <h3>{i.name}</h3>
              </Link>
              <p>
                {i.shape} · {i.length} · {i.size}
              </p>
              {i.addons.length > 0 && (
                <p>{i.addons.map((a) => a.name).join(", ")}</p>
              )}
              <p>
                {i.startingPrice ? "From " : ""}
                {money(linePrice(i))} each
              </p>
              <details>
                <summary>Edit preferences</summary>
                <BagPreferences
                  item={i}
                  product={products.find((p) => p.id === i.productId)}
                  update={(patch) => {
                    update(i.key, patch);
                    setPrepared(null);
                  }}
                />
              </details>
              <div className="quantity-control">
                <button
                  aria-label={`Decrease quantity of ${i.name}`}
                  disabled={i.quantity <= 1}
                  onClick={() => {
                    update(i.key, { quantity: i.quantity - 1 });
                    setPrepared(null);
                  }}
                >
                  <Minus size={14} />
                </button>
                <span>{i.quantity}</span>
                <button
                  aria-label={`Increase quantity of ${i.name}`}
                  disabled={i.quantity >= 20}
                  onClick={() => {
                    update(i.key, { quantity: i.quantity + 1 });
                    setPrepared(null);
                  }}
                >
                  <Plus size={14} />
                </button>
                <button
                  aria-label={`Remove ${i.name}`}
                  onClick={() => {
                    remove(i.key);
                    setPrepared(null);
                  }}
                  className="remove-item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="bag-summary">
        <div className="subtotal">
          <span>Estimated subtotal</span>
          <strong>{money(subtotal(items))}</strong>
        </div>
        <p className="small muted">
          {items.some((i) => i.startingPrice)
            ? "Includes starting prices. "
            : ""}
          Shipping charged separately. Final pricing confirmed personally.
        </p>
        <label>
          Anything else on your mind?
          <textarea
            rows={2}
            value={notes}
            maxLength={2000}
            onChange={(e) => {
              setNotes(e.target.value);
              setPrepared(null);
            }}
            placeholder="Sizing questions, a special occasion…"
          />
        </label>
        <button className="button full-width" onClick={prepare} disabled={busy}>
          {busy ? "Checking your selections…" : "Prepare WhatsApp enquiry"}
          <MessageCircle size={17} />
        </button>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {prepared && (
          <div className="enquiry-ready" role="status">
            <h3>Your enquiry is ready.</h3>
            <p>
              {prepared.saved
                ? `Reference ${prepared.reference}`
                : "This enquiry is not saved to a database."}
            </p>
            <a
              className="button full-width"
              href={prepared.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_opened")}
            >
              Open WhatsApp <ArrowRight size={17} />
            </a>
            <p className="fine-print">
              Send the message in WhatsApp to reach us. Opening the app does not
              send it or confirm an order.
            </p>
            {prepared.saved && (
              <button
                className="text-link"
                onClick={() => track("customer_confirmed_sent")}
              >
                {confirmed ? "Marked as sent by you" : "I have sent my message"}
              </button>
            )}
          </div>
        )}
        <button
          className="button button-outline full-width"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(enquiryMessage(items, notes));
              setCopied(true);
            } catch {
              setError(
                "Clipboard unavailable. Please use the WhatsApp enquiry link.",
              );
            }
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
          {copied ? "Summary copied" : "Copy summary for Instagram"}
        </button>
        <a
          className="text-link"
          href={settings.instagram}
          target="_blank"
          rel="noreferrer"
        >
          Prefer Instagram? Send us a DM <ArrowRight size={14} />
        </a>
        <p className="fine-print">Paste your copied summary in your message.</p>
        <div className="bag-bottom-links">
          <Link href="/shop" onClick={() => setOpen(false)}>
            Continue exploring
          </Link>
          <button
            onClick={() => {
              clear();
              setPrepared(null);
            }}
          >
            Clear bag
          </button>
        </div>
      </div>
    </div>
  );
}
export function BagDrawer({
  settings,
  products,
}: {
  settings: Settings;
  products: Product[];
}) {
  const open = useCart((s) => s.open),
    setOpen = useCart((s) => s.setOpen);
  return (
    <Modal open={open} onOpenChange={setOpen} title="Your enquiry bag" drawer>
      <p className="muted">A few favourites, one personal conversation.</p>
      <BagContent settings={settings} products={products} compact />
      <Link href="/cart" className="text-link" onClick={() => setOpen(false)}>
        View full enquiry bag <ArrowRight size={15} />
      </Link>
    </Modal>
  );
}
