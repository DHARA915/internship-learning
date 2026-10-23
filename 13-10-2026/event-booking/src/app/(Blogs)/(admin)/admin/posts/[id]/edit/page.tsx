"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogForm from "../../../../../components/BlogForm";
import type { RootState } from "@/Redux/store";
import { postUpdated, selectPostById } from "@/Redux/Slices/blog/blogslice";

export default function EditPostPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const post = useSelector((state: RootState) => selectPostById(state, id));

  if (!post) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <FileX className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">This post doesn't exist, or it was removed.</p>
        <Button  variant="outline">
          <Link href="admin/posts">Back to blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl">
      <Link
        href={`/admin/posts/${post.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to post
      </Link>

      <h1 className="mb-6 border-l-4 border-brand p-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Edit post
      </h1>

      <BlogForm
        key={post.id}
        post={post}
        submitLabel="Save changes"
        onCancel={() => router.push(`/admin/posts/${post.id}`)}
        onSubmit={(changes) => {
          dispatch(postUpdated({ id: post.id, changes }));
          router.push(`/admin/posts/${post.id}`);
        }}
      />
    </div>
  );
}