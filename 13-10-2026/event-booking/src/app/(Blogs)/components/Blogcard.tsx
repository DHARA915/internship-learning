"use client";

import Image from "next/image";
import type { Post } from "@/data/Blog/blogdata";
import { sanitizeHtml } from "@/lib/html";
import { Button } from "@/components/ui/button";
import Link from 'next/link'

type BlogCardProps = {
  post: Post;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-tertiary">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No cover image
          </div>
        )}

        {/* Date */}
        <div
          className="
            absolute
            left-4
            top-4
            rounded-full
            bg-background/90
            px-3
            py-1.5
            text-xs
            font-medium
            text-foreground
            shadow-sm
            backdrop-blur
          "
        >
          {new Date(post.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h2
          className="
            line-clamp-2
            text-xl
            font-bold
            leading-tight
            tracking-tight
            text-foreground
            transition-colors
            group-hover:text-brand
          "
        >
          {post.title}
        </h2>

        {/* Blog HTML Preview */}
        <div className="relative mt-4">
          <div
            className="
              rich-content
              max-h-15
              overflow-hidden
              text-sm
              text-muted-foreground
            "
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(post.content),
            }}
          />

          {/* Fade / ... effect */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-12
              w-full
              bg-gradient-to-t
              from-card
              via-card/80
              to-transparent
            "
          />

          <span
            className="
              pointer-events-none
              absolute
              bottom-0
              right-0
              bg-card
              pl-2
              text-sm
              font-semibold
              text-muted-foreground
            "
          >
            ...
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-muted-foreground">
              Blog post
            </span>

            <Button
              type="button"
              className="
                text-sm
                font-semibold
                bg-brand-soft
                text-brand
                hover:bg-brand-soft
              "
            >
              <Link href={`/admin/posts/${post.id}`}>
              Read more →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}