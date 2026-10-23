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


// Admin posts in the public blog list..........................................................................................................................................

export type ListPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  reactions: { likes: number; dislikes: number };
  /** where the card links to; BlogList falls back to /blogs/:id */
  href?: string;
};

export const CREATED_AUTHOR_ID = 0; // no API user has id 0

const toPlainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Converts an admin post into a list item with the same keys as the API posts. */
export const postToListPost = (post: Post): ListPost => ({
  id: post.id,
  userId: CREATED_AUTHOR_ID,
  title: post.title,
  body: toPlainText(post.content), // the list shows plain text, not HTML
  tags: [],
  views: 0,
  reactions: { likes: 0, dislikes: 0 },
  href: `/blog/${post.id}`,
});

