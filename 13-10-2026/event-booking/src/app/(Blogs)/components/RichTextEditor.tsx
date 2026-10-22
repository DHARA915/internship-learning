"use client";

import { useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Code, Heading2, Heading3, Highlighter,
  ImagePlus, Italic, Link as LinkIcon, List, ListOrdered, Minus, Palette, Quote,
  Redo2, Strikethrough, Table as TableIcon, Underline as UnderlineIcon, Undo2,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

const MAX_IMAGE_MB = 5;

/** Reads an image, shrinks it to `maxWidth` and returns a data URL. Throws a readable error. */
export async function fileToDataUrl(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024)
    throw new Error(`Image must be smaller than ${MAX_IMAGE_MB} MB`);

  // SVG and GIF would lose their quality / animation on a canvas, keep them as they are
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Couldn't read this image"));
      reader.readAsDataURL(file);
    });
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", quality);
}

function ToolButton({
  label, active, disabled, onClick, children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn("size-8 shrink-0", active && "bg-brand-soft text-brand")}
    >
      {children}
    </Button>
  );
}

const Divider = () => <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-line" />;

function ColorPicker({
  label, icon, onPick, onClear,
}: {
  label: string;
  icon: ReactNode;
  onPick: (color: string) => void;
  onClear: () => void;
}) {
  return (
    <span className="flex shrink-0 items-center">
      <label
        title={label}
        className="relative flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-tertiary"
      >
        {icon}
        <span className="sr-only">{label}</span>
        <input
          type="color"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(event) => onPick(event.target.value)}
        />
      </label>
    </span>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") return void chain().extendMarkRange("link").unsetLink().run();
    if (!/^https?:\/\//i.test(url)) return void setUploadError("Links must start with http:// or https://");
    setUploadError("");
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      const src = await fileToDataUrl(file, 1200, 0.8);
      setUploadError("");
      chain().setImage({ src, alt: file.name }).run();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Couldn't add this image");
    }
  };

  const inTable = editor.isActive("table");

  return (
    <div className="rounded-t-xl border-b border-line bg-card">
      <div className="flex flex-wrap items-center gap-0.5 p-2">
        <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}><Undo2 className="size-4" /></ToolButton>
        <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}><Redo2 className="size-4" /></ToolButton>
        <Divider />

        <ToolButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 className="size-4" /></ToolButton>
        <ToolButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 className="size-4" /></ToolButton>
        <Divider />

        <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}><Bold className="size-4" /></ToolButton>
        <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}><Italic className="size-4" /></ToolButton>
        <ToolButton label="Underline" active={editor.isActive("underline")} onClick={() => chain().toggleUnderline().run()}><UnderlineIcon className="size-4" /></ToolButton>
        <ToolButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => chain().toggleStrike().run()}><Strikethrough className="size-4" /></ToolButton>
        <Divider />

        <ColorPicker
          label="Text color"
          icon={<Palette className="size-4" />}
          onPick={(color) => chain().setColor(color).run()}
          onClear={() => chain().unsetColor().run()}
        />
        <ColorPicker
          label="Highlight"
          icon={<Highlighter className="size-4" />}
          onPick={(color) => chain().setHighlight({ color }).run()}
          onClear={() => chain().unsetHighlight().run()}
        />
        <Divider />

        <ToolButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => chain().setTextAlign("left").run()}><AlignLeft className="size-4" /></ToolButton>
        <ToolButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => chain().setTextAlign("center").run()}><AlignCenter className="size-4" /></ToolButton>
        <ToolButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => chain().setTextAlign("right").run()}><AlignRight className="size-4" /></ToolButton>
        <Divider />

        <ToolButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}><List className="size-4" /></ToolButton>
        <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolButton>
        <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}><Quote className="size-4" /></ToolButton>
        <ToolButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => chain().toggleCodeBlock().run()}><Code className="size-4" /></ToolButton>
        <ToolButton label="Divider line" onClick={() => chain().setHorizontalRule().run()}><Minus className="size-4" /></ToolButton>
        <Divider />

        <ToolButton label="Link" active={editor.isActive("link")} onClick={setLink}><LinkIcon className="size-4" /></ToolButton>
        <ToolButton label="Insert image" onClick={() => imageInput.current?.click()}><ImagePlus className="size-4" /></ToolButton>
        <ToolButton label="Insert table" onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="size-4" /></ToolButton>

        <input
          ref={imageInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(event) => {
            void addImage(event.target.files?.[0]);
            event.target.value = ""; // lets the same file be picked again
          }}
        />
      </div>

      {/* table tools only appear while the cursor is inside a table */}
      {inTable && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-line px-2 py-1.5">
          <span className="text-xs text-muted-foreground">Table:</span>
          <Button type="button" variant="outline" size="sm" onClick={() => chain().addRowAfter().run()}>+ Row</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => chain().addColumnAfter().run()}>+ Column</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => chain().deleteRow().run()}>− Row</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => chain().deleteColumn().run()}>− Column</Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => chain().deleteTable().run()}>Delete table</Button>
        </div>
      )}

      {uploadError && (
        <p role="alert" className="border-t border-line px-3 py-1.5 text-sm text-danger">
          {uploadError}
        </p>
      )}
    </div>
  );
}

export type RichTextEditorProps = {
  value?: string;
  onChange: (html: string) => void;
  error?: string;
  placeholder?: string;
};

export function RichTextEditor({
  value = "",
  onChange,
  error,
  placeholder = "Start writing your post...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // avoids a hydration mismatch in Next.js
    content: value,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
      attributes: { class: "rich-content min-h-72 p-4 outline-none" },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  return (
    <div>
      <div
        className={cn(
          "rounded-xl border bg-card focus-within:ring-1 focus-within:ring-line-strong",
          error ? "border-danger" : "border-line",
        )}
      >
        {editor ? <Toolbar editor={editor} /> : <div className="h-12 border-b border-line" />}
        <EditorContent editor={editor} />
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}