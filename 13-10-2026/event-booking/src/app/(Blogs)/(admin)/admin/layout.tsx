"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { usePathname,useRouter } from "next/navigation";

const pageWidth = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const LOGIN_PATH = "/admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "admin-auth=; path=/; max-age=0";
    router.replace(LOGIN_PATH);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-card">
        <div className={`${pageWidth} flex h-16 items-center justify-between`}>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand">MyBlog</span>

          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium sm:gap-4">
            <Link href="/admin/posts" className="font-semibold text-brand sm:inline">
             Blogs
            </Link>
            <Link
              href="/admin/posts/newpost"
              className="rounded-lg border border-brand text-brand px-3 py-1.5 hover:bg-tertiary"
            >
              New blog
            </Link>
            
           {pathname !== "/admin" && (
  <Button
    type="button"
    onClick={handleLogout}
    className="cursor-pointer bg-brand hover:bg-brand"
  >
    Log out
  </Button>
)}
          </nav>
        </div>
      </header>

      <main className={`${pageWidth} flex-1 py-8`}>{children}</main>

    </div>
  );
}
