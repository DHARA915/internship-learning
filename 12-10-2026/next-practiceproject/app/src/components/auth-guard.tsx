"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/src/context/auth-context";

// Reports the current path to the guard on every navigation.
function PathWatcher({ onPath }: { onPath: (path: string) => void }) {
  const pathname = usePathname();

  useEffect(() => {
    onPath(pathname);
  }, [pathname, onPath]);

  return null;
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  // null = not known yet (server render and first client render)
  const [path, setPath] = useState<string | null>(null);

  const isLoginPage = path === "/login";

  // Logged out on a protected page: go to /login
  useEffect(() => {
    if (!ready || path === null || user || isLoginPage) return;

    const search = window.location.search;
    const full = path + search;
    router.replace(
      full !== "/" ? `/login?next=${encodeURIComponent(full)}` : "/login"
    );
  }, [ready, user, path, isLoginPage, router]);

  // Show the page only after the check is done and access is allowed
  const allowed = ready && path !== null && (!!user || isLoginPage);

  return (
    <>
      <Suspense fallback={null}>
        <PathWatcher onPath={setPath} />
      </Suspense>
      {
        allowed ? children: null
      }
    </>
  );
}