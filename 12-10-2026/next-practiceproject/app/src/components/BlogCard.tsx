// components/blog-card.tsx
import Link from "next/link";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: { name: string; avatar: string };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="@container h-full">
      <Link
        href={`/blog/${post.id}`}
        className="grid h-full grid-cols-1 overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-border-strong @md:grid-cols-[70%_30%]"
      >
        <div className="flex min-w-0 flex-col gap-2 p-3 @md:p-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-7 w-7 shrink-0 rounded-full bg-background-muted object-cover @md:h-8 @md:w-8"
            />
            <span className="truncate text-sm font-medium text-foreground-secondary">
              {post.author.name}
            </span>
          </div>

          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-primary">
            {post.category}
          </span>

          {/* Title */}
          <h2 className="line-clamp-2 text-base font-bold text-foreground @md:text-lg">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="line-clamp-2 text-sm text-foreground-secondary">
            {post.excerpt}
          </p>

          {/* Content: long, so it is cut off with "..." */}
          <p className="line-clamp-2 text-sm text-foreground-muted">
            {post.content}
          </p>
        </div>

        {/* Image: top (16:9) when stacked, right 30% filling the height when wide */}
        <div className="relative order-first aspect-video bg-background-muted @md:order-none @md:aspect-auto @md:min-h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;