"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, CalendarDays, Clock, FileX, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { sanitizeHtml } from "@/lib/html";
import type { RootState } from "@/Redux/store";
import { postDeleted, selectPostById } from "@/Redux/Slices/blog/blogslice";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** About 200 words per minute, never less than 1. */
const readingMinutes = (html: string) => {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export default function BlogDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const post = useSelector((state: RootState) => selectPostById(state, id));
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // sanitize once, not on every render
  const safeContent = useMemo(() => (post ? sanitizeHtml(post.content) : ""), [post]);

  if (!post) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <FileX className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-bold">Post not found</h1>
        <p className="text-sm text-muted-foreground">
          This post doesn't exist, or it was removed.
        </p>
        <Button  variant="outline">
          <Link href="/admin/posts" className="text-brand">Back to blog</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch(postDeleted(post.id));
    router.push("/blog");
  };

  return (
    <article className="mx-auto w-full min-w-0 max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>

        {/* show these only to admins once you have auth */}
        <div className="flex gap-2">
          <Button  variant="outline" size="sm" className="border-brand">
            <Link href={`/admin/posts/${post.id}/edit`} className="flex items-center gap-2 text-brand " >
              <PencilLine />
              Edit
            </Link>
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <header>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight break-words sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formatDate(post.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            {readingMinutes(post.content)} min read
          </span>
        </div>
      </header>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-tertiary">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {/* stored HTML, sanitized, styled by the global .rich-content CSS */}
      <div
        className="rich-content mt-8 text-base sm:text-lg"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      <footer className="mt-12 border-t border-line pt-6">
        <Button  variant="outline" >
          <Link href="/admin/posts" className="flex items-center gap-2">
            <ArrowLeft />
            More posts
          </Link>
        </Button>
      </footer>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        icon={Trash2}
        variant="danger"
        title="Delete this post?"
        description={
          <>
            <span className="font-medium text-foreground">{post.title}</span> will be removed.
            This can't be undone.
          </>
        }
        confirmLabel="Delete post"
        onConfirm={handleDelete}
      />
    </article>
  );
}