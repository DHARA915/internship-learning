"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import BlogForm from "../../../../components/BlogForm";
import { postAdded } from "@/Redux/Slices/blog/blogslice";

export default function NewPostPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl">
      <div className="mb-6">
        <h1 className="border-l-4 border-brand p-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Create post
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write your post with the editor. Format text, add colors, highlights, tables and images.
        </p>
      </div>

      <BlogForm
        submitLabel="Create post"
        onCancel={() => router.push("/admin/posts")}
        onSubmit={(input) => {
          dispatch(postAdded(input));
          router.push("/admin/posts");
        }}
      />
    </div>
  );
}