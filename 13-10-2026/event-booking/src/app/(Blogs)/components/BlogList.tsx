"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  reactions: { likes: number; dislikes: number };
  href?:string;
};

type BlogListProps = {
  posts: Post[];
  authorNames: Record<number, string>;
  /** how many blogs are shown first and added on each "Load more" */
  pageSize?: number;
  emptyMessage?: string;
};

export function BlogList({ posts, authorNames, pageSize = 6, emptyMessage = "No posts yet." }: BlogListProps) {
  const [visible, setVisible] = useState(pageSize);

  if (posts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const shown = Math.min(visible, posts.length);

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {posts.slice(0, visible).map((post) => (
          <li key={post.id}>
            <Link
              href={`/blogs/${post.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm transition hover:border-brand sm:p-5"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-sm font-bold text-brand sm:size-14">
                #{post.id}
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-brand">
                  {authorNames[post.userId] ?? "Unknown author"}
                </span>
                <h2 className="line-clamp-1 font-bold capitalize">{post.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{post.body.slice(0, 100)}…</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-tertiary px-2 py-0.5">#{tag}</span>
                  ))}
                  <span className="flex items-center gap-1"><Eye className="size-3.5" />{post.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="size-3.5" />{post.reactions.likes}</span>
                </div>
              </div>

              <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-brand sm:block" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Showing {shown} of {posts.length}</p>
        {visible < posts.length && (
          <Button type="button" variant="outline" onClick={() => setVisible((v) => v + pageSize)}>
            Load more
          </Button>
        )}
      </div>
    </div>
  );
}