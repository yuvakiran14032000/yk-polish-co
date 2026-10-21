import { z } from "zod";
import { serverClient } from "@/lib/supabase/server";
import {
  body,
  HttpError,
  json,
  rateLimit,
  safeError,
  sameOrigin,
} from "@/lib/http";
const schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit(request, "admin-login");
    const parsed = schema.safeParse(await body(request, 4000));
    if (!parsed.success)
      throw new HttpError("Please enter your email and password.");
    const client = await serverClient();
    if (!client)
      throw new HttpError(
        "Supabase authentication has not been configured.",
        503,
      );
    const { data, error } = await client.auth.signInWithPassword(parsed.data);
    if (error || !data.user)
      throw new HttpError("Unable to sign in with those details.", 401);
    const { data: admin } = await client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (!admin) {
      await client.auth.signOut();
      throw new HttpError(
        "This account is not authorised to manage YK Polish Co.",
        403,
      );
    }
    return json({ ok: true });
  } catch (e) {
    return safeError(e);
  }
}
