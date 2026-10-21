import { serverClient } from "@/lib/supabase/server";
import { json, safeError, sameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const c = await serverClient();
    await c?.auth.signOut();
    return json({ ok: true });
  } catch (e) {
    return safeError(e);
  }
}
