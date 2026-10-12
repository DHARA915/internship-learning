"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { blogs } from "../data/Blogdata";
import BlogCard from "../src/components/BlogCard";

const PAGE_SIZE = 5; 

// all categories found in the data
const categories = [...new Set(blogs.map((post) => post.category))];

function BlogList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const text = q.trim().toLowerCase();

  const filtered = blogs.filter((post) => {
    const matchesCategory = category === "all" || post.category === category;
    const matchesText =
      post.title.toLowerCase().includes(text) ||
      post.category.toLowerCase().includes(text);
    return matchesCategory && matchesText;
  });

  // pagination: show the first page * PAGE_SIZE results
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  function updateParams(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  // changing search or category starts again from the first page
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    updateParams({ q: e.target.value, page: null });
  }

  function handleCategory(value: string) {
    updateParams({ category: value === "all" ? null : value, page: null });
  }

  function handleLoadMore() {
    updateParams({ page: String(page + 1) });
  }

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
      active
        ? "border-transparent bg-background-primary text-foreground-on-primary"
        : "border-border bg-background text-foreground-secondary hover:bg-background-muted"
    }`;

  return (
    <div>
      <input
        type="search"
        defaultValue={q}
        onChange={handleSearch}
        placeholder="Search by title or category"
        aria-label="Search posts"
        className="mb-4 w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategory("all")}
          className={chipClass(category === "all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleCategory(c)}
            className={chipClass(category === c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm text-foreground-muted">
        Showing {visible.length} of {filtered.length} posts
      </p>

      {filtered.length === 0 ? (
        <p className="text-foreground-muted">No posts found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {visible.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="rounded-lg bg-background-primary px-5 py-2 text-sm font-medium text-foreground-on-primary transition-colors hover:bg-background-primary-hover"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

const Blogs = () => {
  return (
    <div>
      <h1 className="mb-6 font-semibold text-foreground-primary ">Explore Blogs</h1>

      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-xl bg-background-muted" />
        }
      >
        <BlogList />
      </Suspense>
    </div>
  );
};

export default Blogs;