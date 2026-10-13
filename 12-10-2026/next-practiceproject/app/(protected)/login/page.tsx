// app/(protected)/login/page.tsx
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../src/components/ui/button";
import { useAuth } from "@/app/src/context/auth-context";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Where to go after login: /login?next=/blog -> "/blog" (same-site paths only)
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/";

  // Already logged in (or just logged in)? Leave the login page.
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const result = login(
      String(form.get("email") ?? ""),
      String(form.get("password") ?? "")
    );

    if (!result.ok) setError(result.error);

  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-background-card p-6">
      <h1 className="mb-1 text-2xl font-bold text-foreground">Log in</h1>
      <p className="mb-6 text-sm text-foreground-muted">
        Sign in to see the protected pages.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            required
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full">
          Log in
        </Button>
      </form>

    

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto h-72 max-w-sm animate-pulse rounded-xl bg-background-muted" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}

