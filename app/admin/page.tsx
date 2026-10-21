import { requireAdmin, isConfigured } from "@/lib/supabase/server";
import { defaults } from "@/lib/brand";
import { AdminLogin } from "@/components/admin-login";
import { AdminDashboard } from "@/components/admin-dashboard";
import type { Collection, Product } from "@/lib/types";
import type { AdminEnquiry } from "@/lib/admin-types";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Brand administration",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  const admin = await requireAdmin();
  if (!admin) return <AdminLogin configured={isConfigured()} />;
  const [p, c, e, s] = await Promise.all([
    admin.client
      .from("products")
      .select(
        "*,images:product_images(*),variants:product_variants(*),addons:product_addons(*),product_collections(collections(*))",
      )
      .order("display_order"),
    admin.client.from("collections").select("*").order("display_order"),
    admin.client
      .from("enquiries")
      .select(
        "id,reference,status,notes,brief,admin_notes,estimated_subtotal,created_at,items:enquiry_items(*)",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    admin.client
      .from("site_settings")
      .select("value")
      .eq("id", "main")
      .maybeSingle(),
  ]);
  if (p.error || c.error || e.error || s.error)
    return (
      <div className="container empty-state">
        <h1>
          Setup needs <em>attention.</em>
        </h1>
        <p>
          Signed in successfully, but the database could not be read. Apply the
          Supabase migration and seed, then reload.
        </p>
      </div>
    );
  const products = (p.data ?? []).map(({ product_collections, ...row }) => ({
    ...row,
    collections: (product_collections ?? []).map(
      (x: { collections: Collection }) => x.collections,
    ),
    images: [...(row.images ?? [])].sort(
      (a, b) => a.display_order - b.display_order,
    ),
  })) as Product[];
  return (
    <AdminDashboard
      products={products}
      collections={c.data as Collection[]}
      enquiries={e.data as AdminEnquiry[]}
      settings={{ ...defaults, ...s.data?.value }}
      email={admin.user.email ?? "Authorised admin"}
    />
  );
}
