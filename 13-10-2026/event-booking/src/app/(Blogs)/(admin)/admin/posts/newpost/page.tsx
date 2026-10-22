"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { RichTextEditor, fileToDataUrl } from "../../../../components/RichTextEditor";
import { MAX_CONTENT_CHARS, isContentEmpty } from "@/data/Blog/blogdata";
import { postAdded } from "@/Redux/Slices/blog/blogslice";

type Errors = { title?: string; content?: string };

const validate = (title: string, content: string): Errors => {
  const errors: Errors = {};

  const trimmed = title.trim();
  if (!trimmed) errors.title = "Title is required";
  else if (trimmed.length < 3) errors.title = "Use at least 3 characters";
  else if (trimmed.length > 120) errors.title = "Keep the title under 120 characters";

  if (isContentEmpty(content)) errors.content = "Write something before creating the post";
  else if (content.length > MAX_CONTENT_CHARS)
    errors.content = "This post is too large to save. Remove or shrink some images";

  return errors;
};

export default function NewPostPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverError, setCoverError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(title, content);
  const visibleErrors: Errors = submitted ? errors : {};

  const handleCover = async (file: File | null) => {
    if (!file) {
      setCoverImage("");
      setCoverError("");
      return;
    }
    try {
      setCoverImage(await fileToDataUrl(file, 1400, 0.8));
      setCoverError("");
    } catch (error) {
      setCoverError(error instanceof Error ? error.message : "Couldn't add this image");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;


     const post={
        title: title.trim(),
        content,
        coverImage: coverImage || null,
      }

      console.log("Posts: ",post)
    
    dispatch(
      postAdded(post),
    );
    router.push("/admin/posts");
  };

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

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FormField
          type="text"
          name="title"
          label="Title"
          placeholder="e.g. 10 tips for better writing"
          value={title}
          onChange={setTitle}
          error={visibleErrors.title}
          required
        />

        <FormField
          type="file"
          name="coverImage"
          label="Cover image (optional)"
          maxSizeMB={5}
          value={coverImage}
          onFileChange={handleCover}
          error={coverError}
        />

        <div>
          <p className="mb-2 text-sm font-medium">
            Content <span className="text-danger">*</span>
          </p>
          <RichTextEditor onChange={setContent} error={visibleErrors.content} />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/posts")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create post
          </Button>
        </div>
      </form>
    </div>
  );
}