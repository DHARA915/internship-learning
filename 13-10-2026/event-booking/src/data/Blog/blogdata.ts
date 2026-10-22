export interface Post {
  id: number;
  title: string;
  /** HTML produced by the editor */
  content: string;
  coverImage: string | null;
  created_at: string;
}

export type PostInput = Omit<Post, "id" | "created_at">;

// posts are kept in Redux (and possibly localStorage), so cap the size
export const MAX_CONTENT_CHARS = 2_000_000;

/** Empty means: no text AND no image, table or divider. */
export const isContentEmpty = (html: string): boolean => {
  if (/<(img|table|hr)\b/i.test(html)) return false;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length === 0;
};