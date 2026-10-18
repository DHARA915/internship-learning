import { useEffect, useRef, useState, type DragEvent } from "react";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { cn } from "cn";
import { FieldWrapper } from "../Fieldwrapper ";
import type { ImageFieldProps } from "./Types";

// the picker only lists these; check() enforces it again for drag & drop
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const IMAGE_ACCEPT = ALLOWED_TYPES.join(",");

export function ImageField({
  name,
  label,
  value = "",
  onBlur,
  onValidate,
  onFileChange,
  error: externalError,
  helperText,
  required,
  disabled,
  className,
  placeholder = "Click to upload or drag an image here",
  maxSizeMB = 5,
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [localPreview, setLocalPreview] = useState<string>();
  const [internalError, setInternalError] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);

  // external (server) error wins over the internal one
  const error = externalError || internalError;

  // the image just picked, or the saved one passed in through `value`
  const preview = localPreview ?? (value || undefined);

  // release the temporary preview URL when it changes or on unmount
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  /** returns an error message, or undefined when the file is fine */
  const check = (file: File): string | undefined => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Only PNG, JPG, WebP or SVG images are allowed";
    if (file.size > maxSizeMB * 1024 * 1024) return `Image must be smaller than ${maxSizeMB} MB`;
    return undefined;
  };

  const report = (message: string | undefined) => {
    setInternalError(message);
    onValidate?.(message, name);
  };

  /** shared by the file picker and drag & drop */
  const handleFile = (file: File) => {
    const message = check(file);
    report(message);
    if (message) return; // keep the current image, show the error

    setLocalPreview(URL.createObjectURL(file));
    onFileChange?.(file, name);
  };

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    event.target.value = ""; // lets the same file be picked again
  };

  const handleRemove = () => {
    setLocalPreview(undefined);
    onFileChange?.(null, name);
    report(required ? `${label ?? "Image"} is required` : undefined);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  /* ---------- drag & drop ---------- */

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault(); // required, otherwise the browser opens the file
    if (!disabled) setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleBlur = () => {
    // required check once the user has left the field with no image
    if (!preview && required) report(`${label ?? "Image"} is required`);
    onBlur?.();
  };

  return (
    <FieldWrapper {...{ name, label, required, error, helperText, className }}>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={IMAGE_ACCEPT}
        disabled={disabled}
        className="sr-only"
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={handlePick}
        onBlur={handleBlur}
      />

      {preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex items-center gap-3 rounded-lg border border-line bg-card p-3 transition-colors",
            isDragging && "border-brand bg-brand-soft",
            error && "border-danger",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected image preview"
            className="size-16 shrink-0 rounded-md border border-line bg-white object-contain"
          />

          <div className="flex flex-1 flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={openPicker}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm transition-colors hover:bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              <Pencil className="size-3.5" />
              Change
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
            isDragging && "border-brand bg-brand-soft text-brand",
            error && "border-danger",
          )}
        >
          <ImagePlus className="size-5" />
          <span>{placeholder}</span>
          <span className="text-xs">PNG, JPG, WebP or SVG, up to {maxSizeMB} MB</span>
        </button>
      )}
    </FieldWrapper>
  );
}