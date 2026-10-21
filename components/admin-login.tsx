"use client";
import { responseJson } from "@/lib/api-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="admin-login">
      <LockKeyhole size={27} strokeWidth={1} />
      <p className="eyebrow" style={{ marginTop: 22 }}>
        THE LITTLE DETAILS, BEHIND THE SCENES
      </p>
      <h1>
        Welcome <em>back.</em>
      </h1>
      <p>
        {configured
          ? "Sign in with your authorised YK admin account."
          : "Admin access is locked until Supabase authentication and an authorised admin account are configured. Setup instructions are included with the source."}
      </p>
      {configured && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const form = new FormData(e.currentTarget);
            try {
              const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: form.get("email"),
                  password: form.get("password"),
                }),
              });
              const data = await responseJson<{ url: string; ok: boolean }>(
                res,
              );
              if (!res.ok) throw new Error(data.error);
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              maxLength={254}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              maxLength={128}
            />
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Signing in…" : "Sign in securely"}
          </button>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
