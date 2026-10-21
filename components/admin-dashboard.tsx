"use client";
import { responseJson } from "@/lib/api-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Upload, LogOut, Trash2 } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import { money } from "@/lib/brand";
import type { Collection, Product, Settings, EnquiryStatus } from "@/lib/types";
import type { AdminEnquiry } from "@/lib/admin-types";
type EditorProduct = Omit<
  Product,
  "id" | "created_at" | "collections" | "demo"
> & { id?: string; collection_ids: string[] };
const split = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const blank = (): EditorProduct => ({
  name: "",
  slug: "",
  description: "",
  price: 399,
  starting_price: true,
  status: "draft",
  availability: "made_to_order",
  featured: false,
  display_order: 0,
  colors: [],
  occasions: [],
  collection_ids: [],
  images: [],
  variants: [],
  addons: [],
});
const toEditor = (p: Product): EditorProduct => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: p.price,
  starting_price: p.starting_price,
  status: p.status,
  availability: p.availability,
  featured: p.featured,
  display_order: p.display_order,
  colors: p.colors,
  occasions: p.occasions,
  collection_ids: p.collections.map((c) => c.id),
  images: p.images,
  variants: p.variants,
  addons: p.addons,
});
async function post(resource: string, value: unknown) {
  const res = await fetch(`/api/admin/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  const data = await responseJson<{ url: string; ok: boolean }>(res);
  if (!res.ok) throw new Error(data.error ?? "Unable to save.");
  return data;
}
async function upload(file: File) {
  const form = new FormData();
  form.set("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await responseJson<{ url: string; ok: boolean }>(res);
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");
  return data.url as string;
}
export function AdminDashboard({
  products,
  collections,
  enquiries,
  settings,
  email,
}: {
  products: Product[];
  collections: Collection[];
  enquiries: AdminEnquiry[];
  settings: Settings;
  email: string;
}) {
  const router = useRouter(),
    [tab, setTab] = useState("Overview"),
    [product, setProduct] = useState<EditorProduct | null>(null),
    [collection, setCollection] = useState<Partial<Collection> | null>(null),
    [enquiry, setEnquiry] = useState<AdminEnquiry | null>(null),
    [site, setSite] = useState(settings),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  useEffect(() => {
    const client = browserClient();
    client?.auth.startAutoRefresh();
    return () => {
      void client?.auth.stopAutoRefresh();
    };
  }, []);
  async function save(resource: string, value: unknown) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await post(resource, value);
      setSuccess("Saved.");
      setProduct(null);
      setCollection(null);
      setEnquiry(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }
  function switchTab(t: string) {
    setTab(t);
    setProduct(null);
    setCollection(null);
    setEnquiry(null);
    setError("");
    setSuccess("");
  }
  return (
    <div className="container admin-shell">
      <div className="admin-top">
        <div>
          <p className="eyebrow">YK POLISH CO. / ADMIN</p>
          <h1>
            Your brand, <em>beautifully managed.</em>
          </h1>
          <p className="fine-print">{email}</p>
        </div>
        <button
          className="button button-outline"
          disabled={busy}
          onClick={async () => {
            try {
              await post("logout", {});
              router.refresh();
            } catch {
              setError("Unable to sign out. Please try again.");
            }
          }}
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
      <nav className="admin-tabs" aria-label="Admin sections">
        {["Overview", "Products", "Collections", "Enquiries", "Settings"].map(
          (t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={tab === t ? "active" : ""}
              aria-current={tab === t ? "page" : undefined}
            >
              {t}
            </button>
          ),
        )}
      </nav>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="success" role="status">
          {success}
        </p>
      )}
      {tab === "Overview" && (
        <>
          <div className="stats-grid">
            {[
              ["Products", products.length],
              [
                "Published",
                products.filter((p) => p.status === "published").length,
              ],
              ["Drafts", products.filter((p) => p.status === "draft").length],
              ["Collections", collections.length],
              [
                "Featured designs",
                products.filter((p) => p.featured && p.status === "published")
                  .length,
              ],
              ["Recent enquiries", enquiries.length],
            ].map(([label, n]) => (
              <div className="stat" key={label}>
                <strong>{n}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 20 }}>Recent enquiries</h2>
          <EnquiryTable
            enquiries={enquiries.slice(0, 8)}
            select={(e) => {
              setTab("Enquiries");
              setEnquiry(e);
            }}
          />
        </>
      )}
      {tab === "Products" &&
        (product ? (
          <ProductEditor
            value={product}
            change={setProduct}
            collections={collections}
            busy={busy}
            setBusy={setBusy}
            setError={setError}
            save={() => save("products", product)}
            cancel={() => setProduct(null)}
          />
        ) : (
          <>
            <div className="section-heading">
              <h2 style={{ fontSize: 34 }}>Your designs</h2>
              <button className="button" onClick={() => setProduct(blank())}>
                <Plus size={15} /> Add design
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Design</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Featured</th>
                    <th>Order</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.status}</td>
                      <td>
                        {p.starting_price ? "From " : ""}
                        {money(p.price)}
                      </td>
                      <td>{p.featured ? "Yes" : "—"}</td>
                      <td>{p.display_order}</td>
                      <td>
                        <button
                          className="text-link"
                          onClick={() => setProduct(toEditor(p))}
                        >
                          Edit design
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!products.length && (
                <p className="notice">
                  No products yet. Upload your own photographs, configure the
                  available options and publish your first design.
                </p>
              )}
            </div>
          </>
        ))}
      {tab === "Collections" &&
        (collection ? (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              void save("collections", collection);
            }}
          >
            <button
              type="button"
              className="text-link"
              onClick={() => setCollection(null)}
            >
              <ArrowLeft size={14} /> All collections
            </button>
            <h2>{collection.id ? "Edit collection" : "New collection"}</h2>
            <div className="form-row">
              <label>
                Name
                <input
                  required
                  value={collection.name ?? ""}
                  onChange={(e) =>
                    setCollection({ ...collection, name: e.target.value })
                  }
                />
              </label>
              <label>
                Slug
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={collection.slug ?? ""}
                  onChange={(e) =>
                    setCollection({ ...collection, slug: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Description
              <textarea
                required
                minLength={10}
                rows={3}
                value={collection.description ?? ""}
                onChange={(e) =>
                  setCollection({ ...collection, description: e.target.value })
                }
              />
            </label>
            <div className="form-row">
              <label>
                Starting price (₹)
                <input
                  type="number"
                  min={1}
                  required
                  value={collection.starting_price ?? 399}
                  onChange={(e) =>
                    setCollection({
                      ...collection,
                      starting_price: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Display order
                <input
                  type="number"
                  min={0}
                  required
                  value={collection.display_order ?? 0}
                  onChange={(e) =>
                    setCollection({
                      ...collection,
                      display_order: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={collection.featured ?? false}
                onChange={(e) =>
                  setCollection({ ...collection, featured: e.target.checked })
                }
              />
              Feature on homepage
            </label>
            <label>
              Collection photograph
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setBusy(true);
                  setError("");
                  try {
                    const url = await upload(f);
                    setCollection((c) => ({ ...c, image_url: url }));
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Upload failed.");
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
            {collection.image_url && (
              <>
                <Image
                  src={collection.image_url}
                  alt={collection.name ?? "Collection cover"}
                  width={180}
                  height={220}
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    setCollection({ ...collection, image_url: null })
                  }
                >
                  Remove cover
                </button>
              </>
            )}
            <button className="button" disabled={busy}>
              {busy ? "Saving…" : "Save collection"}
            </button>
          </form>
        ) : (
          <>
            <div className="section-heading">
              <h2 style={{ fontSize: 34 }}>The collections</h2>
              <button
                className="button"
                onClick={() =>
                  setCollection({
                    name: "",
                    slug: "",
                    description: "",
                    starting_price: 399,
                    featured: false,
                    display_order: collections.length,
                  })
                }
              >
                <Plus size={15} /> Add collection
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>From</th>
                    <th>Featured</th>
                    <th>Order</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{money(c.starting_price)}</td>
                      <td>{c.featured ? "Yes" : "—"}</td>
                      <td>{c.display_order}</td>
                      <td>
                        <button
                          className="text-link"
                          onClick={() => setCollection(c)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}
      {tab === "Enquiries" &&
        (enquiry ? (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              void save("enquiries", {
                id: enquiry.id,
                status: enquiry.status,
                admin_notes: enquiry.admin_notes,
              });
            }}
          >
            <button
              className="text-link"
              type="button"
              onClick={() => setEnquiry(null)}
            >
              <ArrowLeft size={14} /> All enquiries
            </button>
            <h2>{enquiry.reference}</h2>
            <p className="fine-print">
              Created{" "}
              {new Date(enquiry.created_at)
                .toISOString()
                .replace("T", " ")
                .slice(0, 16)}{" "}
              UTC · Estimated {money(enquiry.estimated_subtotal)}
            </p>
            {enquiry.items.map((i) => (
              <div className="notice" key={i.id}>
                <h3>
                  {i.name} × {i.quantity}
                </h3>
                <p>
                  {i.shape} · {i.length} · {i.size}
                </p>
                <p>
                  {i.starting_price ? "From " : ""}
                  {money(i.unit_price)} each
                  {i.addons.length
                    ? " · " +
                      i.addons
                        .map((a) => `${a.name} (${money(a.price)})`)
                        .join(", ")
                    : ""}
                </p>
                {i.notes && <p>{i.notes}</p>}
              </div>
            ))}
            {enquiry.brief && (
              <dl className="review-list">
                {Object.entries(enquiry.brief).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{Array.isArray(v) ? v.join(", ") : String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="small">{enquiry.notes}</p>
            <label>
              Internal status
              <select
                value={enquiry.status}
                onChange={(e) =>
                  setEnquiry({
                    ...enquiry,
                    status: e.target.value as EnquiryStatus,
                  })
                }
              >
                {[
                  "draft",
                  "whatsapp_opened",
                  "customer_confirmed_sent",
                  "manually_confirmed",
                  "cancelled",
                ].map((s) => (
                  <option value={s} key={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <p className="fine-print">
              “Customer confirmed sent” is self-reported. WhatsApp opened does
              not imply delivery or an order. Manually confirm only after
              speaking with the customer.
            </p>
            <label>
              Admin notes (private)
              <textarea
                rows={4}
                maxLength={5000}
                value={enquiry.admin_notes}
                onChange={(e) =>
                  setEnquiry({ ...enquiry, admin_notes: e.target.value })
                }
              />
            </label>
            <button className="button" disabled={busy}>
              {busy ? "Saving…" : "Save enquiry"}
            </button>
          </form>
        ) : (
          <>
            <p className="fine-print" style={{ marginBottom: 20 }}>
              Latest 100 enquiries. These are requests, not automatically
              confirmed orders.
            </p>
            <EnquiryTable enquiries={enquiries} select={setEnquiry} />
          </>
        ))}
      {tab === "Settings" && (
        <form
          className="admin-form"
          onSubmit={(e) => {
            e.preventDefault();
            void save("settings", site);
          }}
        >
          <h2>Website settings</h2>
          {(
            [
              ["whatsapp", "WhatsApp number (country code, digits only)"],
              ["instagram", "Instagram URL"],
              ["announcement", "Announcement bar"],
              ["hero_title", "Homepage headline"],
              ["hero_description", "Homepage description"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                required
                value={site[key]}
                onChange={(e) => setSite({ ...site, [key]: e.target.value })}
              />
            </label>
          ))}
          <label>
            Homepage hero photograph
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setBusy(true);
                try {
                  const url = await upload(f);
                  setSite((s) => ({ ...s, hero_image: url }));
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Upload failed.");
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          <Image
            src={site.hero_image}
            width={240}
            height={300}
            alt="Current homepage image"
            style={{ objectFit: "cover" }}
          />
          <p className="fine-print">
            Upload your brand-owned image to replace the labelled editorial
            concept. Homepage featured collections are controlled in
            Collections.
          </p>
          <button className="button" disabled={busy}>
            {busy ? "Saving…" : "Save settings"}
          </button>
        </form>
      )}
    </div>
  );
}
function EnquiryTable({
  enquiries,
  select,
}: {
  enquiries: AdminEnquiry[];
  select: (e: AdminEnquiry) => void;
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Created (UTC)</th>
            <th>Status</th>
            <th>Estimated subtotal</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((e) => (
            <tr key={e.id}>
              <td>{e.reference}</td>
              <td>
                {new Date(e.created_at)
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " ")}
              </td>
              <td>{e.status.replaceAll("_", " ")}</td>
              <td>{e.brief ? "Custom quote" : money(e.estimated_subtotal)}</td>
              <td>
                <button className="text-link" onClick={() => select(e)}>
                  View enquiry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!enquiries.length && <p className="notice">No saved enquiries yet.</p>}
    </div>
  );
}
function ProductEditor({
  value: p,
  change,
  collections,
  busy,
  setBusy,
  setError,
  save,
  cancel,
}: {
  value: EditorProduct;
  change: (p: EditorProduct) => void;
  collections: Collection[];
  busy: boolean;
  setBusy: (b: boolean) => void;
  setError: (s: string) => void;
  save: () => void;
  cancel: () => void;
}) {
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <button type="button" className="text-link" onClick={cancel}>
        <ArrowLeft size={14} /> All designs
      </button>
      <h2>{p.id ? "Edit your design" : "A new little canvas"}</h2>
      <div className="form-row">
        <label>
          Design name
          <input
            required
            maxLength={150}
            value={p.name}
            onChange={(e) => change({ ...p, name: e.target.value })}
          />
        </label>
        <label>
          URL slug
          <input
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={100}
            value={p.slug}
            onChange={(e) => change({ ...p, slug: e.target.value })}
          />
        </label>
      </div>
      <label>
        Description
        <textarea
          required
          rows={4}
          minLength={10}
          maxLength={5000}
          value={p.description}
          onChange={(e) => change({ ...p, description: e.target.value })}
        />
      </label>
      <div className="form-row">
        <label>
          Price (₹)
          <input
            type="number"
            min={1}
            max={1000000}
            required
            value={p.price}
            onChange={(e) => change({ ...p, price: Number(e.target.value) })}
          />
        </label>
        <label>
          Display order
          <input
            required
            type="number"
            min={0}
            value={p.display_order}
            onChange={(e) =>
              change({ ...p, display_order: Number(e.target.value) })
            }
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Status
          <select
            value={p.status}
            onChange={(e) =>
              change({ ...p, status: e.target.value as Product["status"] })
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          Availability
          <select
            value={p.availability}
            onChange={(e) =>
              change({
                ...p,
                availability: e.target.value as Product["availability"],
              })
            }
          >
            <option value="made_to_order">Made to order</option>
            <option value="available">Available to enquire</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={p.starting_price}
          onChange={(e) => change({ ...p, starting_price: e.target.checked })}
        />
        Show as a starting price
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={p.featured}
          onChange={(e) => change({ ...p, featured: e.target.checked })}
        />
        Feature in The YK Edit
      </label>
      <fieldset>
        <legend>Collections (select at least one)</legend>
        <div className="choice-row">
          {collections.map((c) => (
            <label className="checkbox-row" key={c.id}>
              <input
                type="checkbox"
                checked={p.collection_ids.includes(c.id)}
                onChange={(e) =>
                  change({
                    ...p,
                    collection_ids: e.target.checked
                      ? [...p.collection_ids, c.id]
                      : p.collection_ids.filter((id) => id !== c.id),
                  })
                }
              />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-row">
        <label>
          Colours (comma separated)
          <input
            defaultValue={p.colors.join(", ")}
            onBlur={(e) => change({ ...p, colors: split(e.target.value) })}
          />
        </label>
        <label>
          Occasions (comma separated)
          <input
            defaultValue={p.occasions.join(", ")}
            onBlur={(e) => change({ ...p, occasions: split(e.target.value) })}
          />
        </label>
      </div>
      <h2>Product photographs</h2>
      <p className="fine-print">
        Upload your own JPEG, PNG or WebP images, up to 5 MB each. Edit the alt
        text. Image order follows the list.
      </p>
      <label className="button button-outline">
        <Upload size={16} /> Upload images
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          className="sr-only"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (p.images.length + files.length > 20) {
              setError("A design can have up to 20 images.");
              return;
            }
            setBusy(true);
            setError("");
            try {
              const images = [...p.images];
              for (const f of files) {
                const url = await upload(f);
                images.push({
                  url,
                  alt: `${p.name || "Handmade press-on nail design"} — view ${images.length + 1}`,
                  display_order: images.length,
                });
              }
              change({ ...p, images });
            } catch (e) {
              setError(e instanceof Error ? e.message : "Upload failed.");
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {p.images.map((im, i) => (
        <div className="admin-list-row image-row" key={im.url}>
          <Image src={im.url} alt={im.alt} width={100} height={125} />
          <label>
            Alt text
            <input
              value={im.alt}
              required
              onChange={(e) =>
                change({
                  ...p,
                  images: p.images.map((x, n) =>
                    n === i ? { ...x, alt: e.target.value } : x,
                  ),
                })
              }
            />
          </label>
          <div>
            <button
              type="button"
              className="text-link"
              disabled={i === 0}
              onClick={() => {
                const images = [...p.images];
                [images[i - 1], images[i]] = [images[i], images[i - 1]];
                change({
                  ...p,
                  images: images.map((x, n) => ({ ...x, display_order: n })),
                });
              }}
            >
              Move up
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label={`Remove image ${i + 1}`}
              onClick={() =>
                change({
                  ...p,
                  images: p.images
                    .filter((_, n) => n !== i)
                    .map((x, n) => ({ ...x, display_order: n })),
                })
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <h2>Available variants</h2>
      <p className="fine-print">
        Each row is an available shape and length combination. Enter valid sizes
        separated by commas. Include “Need sizing assistance” where you offer
        that option.
      </p>
      {p.variants.map((v, i) => (
        <div className="admin-list-row" key={i}>
          <label>
            Shape
            <input
              required
              value={v.shape}
              onChange={(e) =>
                change({
                  ...p,
                  variants: p.variants.map((x, n) =>
                    n === i ? { ...x, shape: e.target.value } : x,
                  ),
                })
              }
            />
          </label>
          <label>
            Length
            <input
              required
              value={v.length}
              onChange={(e) =>
                change({
                  ...p,
                  variants: p.variants.map((x, n) =>
                    n === i ? { ...x, length: e.target.value } : x,
                  ),
                })
              }
            />
          </label>
          <label>
            Sizes
            <input
              required
              defaultValue={v.sizes.join(", ")}
              onBlur={(e) =>
                change({
                  ...p,
                  variants: p.variants.map((x, n) =>
                    n === i ? { ...x, sizes: split(e.target.value) } : x,
                  ),
                })
              }
            />
          </label>
          <button
            type="button"
            className="icon-button"
            aria-label={`Remove variant ${i + 1}`}
            onClick={() =>
              change({ ...p, variants: p.variants.filter((_, n) => n !== i) })
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-link"
        onClick={() =>
          change({
            ...p,
            variants: [
              ...p.variants,
              { shape: "", length: "", sizes: ["Need sizing assistance"] },
            ],
          })
        }
      >
        <Plus size={15} /> Add variant
      </button>
      <h2>Optional add-ons</h2>
      {p.addons.map((a, i) => (
        <div className="admin-list-row" key={a.id}>
          <label>
            Name
            <input
              required
              value={a.name}
              onChange={(e) =>
                change({
                  ...p,
                  addons: p.addons.map((x, n) =>
                    n === i ? { ...x, name: e.target.value } : x,
                  ),
                })
              }
            />
          </label>
          <label>
            Extra price (₹)
            <input
              required
              type="number"
              min={0}
              value={a.price}
              onChange={(e) =>
                change({
                  ...p,
                  addons: p.addons.map((x, n) =>
                    n === i ? { ...x, price: Number(e.target.value) } : x,
                  ),
                })
              }
            />
          </label>
          <span />
          <button
            type="button"
            className="icon-button"
            aria-label={`Remove add-on ${i + 1}`}
            onClick={() =>
              change({ ...p, addons: p.addons.filter((_, n) => n !== i) })
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-link"
        onClick={() =>
          change({
            ...p,
            addons: [
              ...p.addons,
              { id: crypto.randomUUID(), name: "", price: 50 },
            ],
          })
        }
      >
        <Plus size={15} /> Add add-on
      </button>
      <p className="notice">
        Publish only confirmed brand designs with your own photographs and
        supported options. Archive a design by changing its status above; past
        enquiry snapshots remain available.
      </p>
      <button className="button" disabled={busy}>
        {busy ? "Saving…" : "Save design"}
      </button>
    </form>
  );
}
