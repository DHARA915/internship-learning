import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { blogs } from "../../data/Blogdata";
import BlogCard from "@/app/src/components/BlogCard";

type Props = {
  params: Promise<{ id: string }>;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

async function BlogDetails({ params }: Props) {
  const { id } = await params;
  const post = blogs.find((post) => post.id === id);
  if (!post) notFound();

  // content has one sentence per line -> one paragraph per line
  const paragraphs = post.content.split("\n").filter(Boolean);

  // up to 2 other posts from the same category
  const related = blogs
    .filter((blog) => blog.category === post.category && blog.id !== post.id)
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-foreground-primary!"
      >
        <ArrowLeft size={18} />
        Back to blog
      </Link>

      <article>
        {/* Header */}
        <header>
          <span className="inline-block rounded-full bg-background-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground-primary">
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-3 text-lg text-foreground-secondary">
            {post.excerpt}
          </p>

          {/* Author + dates */}
          <div className="mt-6 flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-11 w-11 shrink-0 rounded-full bg-background-muted object-cover"
            />
            <div className="min-w-0">
              <div className="truncate font-semibold text-foreground">
                {post.author.name}
              </div>
              <div className="text-sm text-foreground-muted">
                {formatDate(post.publishedAt)} 
              </div>
            </div>
          </div>
        </header>

        {/* Cover image */}
        <div className="mt-6 overflow-hidden rounded-xl bg-background-muted">
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-video w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="mt-8 flex flex-col gap-4">
          {paragraphs.map((line, i) => (
            <p key={i} className="text-base leading-7 text-foreground-secondary">
              {line}
            </p>
          ))}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background-primary-soft px-3 py-1 text-xs font-medium text-foreground-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Dates */}
        <dl className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-border bg-background-secondary p-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Published
            </dt>
            <dd className="mt-1 font-semibold text-foreground">
              {formatDate(post.publishedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Last updated
            </dt>
            <dd className="mt-1 font-semibold text-foreground">
              {formatDate(post.updatedAt)}
            </dd>
          </div>
        </dl>
      </article>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            More in {post.category}
          </h2>
          <div className="grid gap-4">
            {related.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const BlogDetailPage = ({ params }: Props) => {
  return (
    <Suspense
      fallback={
        <div className="mx-auto h-80 max-w-3xl animate-pulse rounded-xl bg-background-muted" />
      }
    >
      <BlogDetails params={params} />
    </Suspense>
  );
};

export default BlogDetailPage;