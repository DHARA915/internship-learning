"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { RichTextEditor, fileToDataUrl } from "../components/RichTextEditor"; // adjust to your path
import {
  MAX_CONTENT_CHARS,
  isContentEmpty,
  type Post,
  type PostInput,
} from "@/data/Blog/blogdata";

type Errors = { title?: string; content?: string };

const validate = (title: string, content: string): Errors => {
  const errors: Errors = {};

  const trimmed = title.trim();
  if (!trimmed) errors.title = "Title is required";
  else if (trimmed.length < 3) errors.title = "Use at least 3 characters";
  else if (trimmed.length > 120) errors.title = "Keep the title under 120 characters";

  if (isContentEmpty(content)) errors.content = "Write something before saving the post";
  else if (content.length > MAX_CONTENT_CHARS)
    errors.content = "This post is too large to save. Remove or shrink some images";

  return errors;
};

type PostFormProps = {
  /** Pass a post to edit it; leave out to create a new one. */
  post?: Post;
  submitLabel: string;
  onSubmit: (input: PostInput) => void;
  onCancel: () => void;
};

export default function PostForm({ post, submitLabel, onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [coverError, setCoverError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(title, content);
  // errors show after the first save click, then update as the user fixes them
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

    onSubmit({ title: title.trim(), content, coverImage: coverImage || null });
  };

  return (
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
        <RichTextEditor value={content} onChange={setContent} error={visibleErrors.content} />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}