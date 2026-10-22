import Link from 'next/link'
import type { ReactNode } from 'react'

const pageWidth = "mx-auto w-full max-w-6xl px-4 sm:px-6";

import React from 'react'

const BlogLayout = ({children}:{children:ReactNode}) => {
   return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-card">
        <div className={`${pageWidth} flex h-16 items-center justify-between`}>
          <Link href="/blogs" className="text-lg font-bold text-brand">MyBlog</Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/blogs" className="hover:text-brand">Blog</Link>
            <Link href="/blogs/authors" className="hover:text-brand">Authors</Link>
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-line px-3 py-1.5 hover:bg-tertiary"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className={`${pageWidth} flex-1 py-8`}>{children}</main>

      <footer className="border-t border-line py-6 text-center text-xs text-muted-foreground">
        Data from JSONPlaceholder
      </footer>
    </div>
  );
}

export default BlogLayout