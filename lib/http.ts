import "server-only";
import { NextResponse } from "next/server";
import { serviceClient } from "./supabase/server";
export class HttpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export function safeError(error: unknown) {
  return json(
    {
      error:
        error instanceof HttpError
          ? error.message
          : "We couldn’t complete that request. Please try again.",
    },
    error instanceof HttpError ? error.status : 500,
  );
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const allowed = new Set(
    [new URL(request.url).origin, process.env.NEXT_PUBLIC_SITE_URL].filter(
      Boolean,
    ),
  );
  let matchesHost = false;
  try {
    matchesHost = new URL(origin).host === request.headers.get("host");
  } catch {
    /* Invalid origins are rejected. */
  }
  if (!allowed.has(origin) && !matchesHost)
    throw new HttpError("Please submit your request from this website.", 403);
}
export async function body(request: Request, max = 32000) {
  if (Number(request.headers.get("content-length")) > max)
    throw new HttpError(
      "Your request is too long. Please shorten the notes.",
      413,
    );
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError("Please provide your enquiry.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > max) {
      await reader.cancel();
      throw new HttpError(
        "Your request is too long. Please shorten the notes.",
        413,
      );
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(buffer)) as unknown;
  } catch {
    throw new HttpError("Please check your form and try again.");
  }
}
export async function hash(value: string) {
  const b = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(b))
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
const windows = new Map<string, { count: number; until: number }>();
export async function rateLimit(request: Request, scope: string) {
  const header = process.env.RATE_LIMIT_IP_HEADER;
  const ip = header
    ? request.headers.get(header)?.split(",")[0].trim()
    : (request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ??
      "shared");
  const key = await hash(
      `${scope}:${ip}:${process.env.SUPABASE_SERVICE_ROLE_KEY ?? "local"}`,
    ),
    client = serviceClient();
  if (client) {
    const { data, error } = await client.rpc("consume_rate_limit", {
      p_key: key,
      p_limit: 12,
    });
    if (error)
      throw new HttpError(
        "Enquiries are temporarily unavailable. Please message us directly on WhatsApp.",
        503,
      );
    if (!data)
      throw new HttpError(
        "A few too many requests. Please try again in ten minutes.",
        429,
      );
    return;
  }
  const now = Date.now();
  for (const [k, v] of windows) if (v.until <= now) windows.delete(k);
  if (windows.size > 2000)
    throw new HttpError("Please try again shortly.", 429);
  const entry = windows.get(key);
  if (entry && entry.count >= 12)
    throw new HttpError("Please try again in ten minutes.", 429);
  windows.set(key, {
    count: (entry?.until && entry.until > now ? entry.count : 0) + 1,
    until: entry?.until && entry.until > now ? entry.until : now + 600000,
  });
}
