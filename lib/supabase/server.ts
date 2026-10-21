import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export const isConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
export async function serverClient() {
  if (!isConfigured()) return null;
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {
            /* Server components cannot write cookies; auth route handles refresh. */
          }
        },
      },
    },
  );
}
export function serviceClient() {
  if (!isConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function requireAdmin() {
  const client = await serverClient();
  if (!client) return null;
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return data ? { client, user } : null;
}
