import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, ThumbsUp } from "lucide-react";

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  reactions: { likes: number; dislikes: number };
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: { name: string };
};

type Comment = {
  id: number;
  postId: number;
  body: string;
  likes: number;
  user: { id: number; username: string; fullName: string };
};

const API = "https://dummyjson.com";

export async function generateStaticParams() {
  const { posts }: { posts: Post[] } = await fetch(`${API}/posts?limit=0&select=title`).then((res) =>
    res.json(),
  );

  return posts.map((post) => ({
    id: String(post.id),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const postRes = await fetch(`${API}/posts/${id}`);
  if (!postRes.ok) notFound();
  const post: Post = await postRes.json();

  const author: User = await fetch(
    `${API}/users/${post.userId}?select=firstName,lastName,email,company`,
  ).then((res) => res.json());
  const { comments }: { comments: Comment[] } = await fetch(`${API}/comments/post/${id}`).then((res) =>
    res.json(),
  );

  const authorName = `${author.firstName} ${author.lastName}`;

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link href="/blogs" className="text-sm text-muted-foreground hover:text-brand">← Back to posts</Link>
        <h1 className="mt-4 text-3xl font-bold capitalize break-words">{post.title}</h1>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand">
            {author.firstName.charAt(0)}
          </div>
          <div className="min-w-0 text-sm">
            <Link href={`/blogs/authors/${author.id}`} className="font-semibold hover:text-brand hover:underline">
              {authorName}
            </Link>
            <p className="break-all text-muted-foreground">{author.company.name} · {author.email}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-tertiary px-2.5 py-1">#{tag}</span>
          ))}
          <span className="flex items-center gap-1"><Eye className="size-4" />{post.views} views</span>
          <span className="flex items-center gap-1"><ThumbsUp className="size-4" />{post.reactions.likes} likes</span>
        </div>

        <p className="mt-6 leading-7 whitespace-pre-line">{post.body}</p>
      </div>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-base font-bold">Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted-foreground">
            No comments yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-xl bg-tertiary p-4">
                <p className="text-sm font-semibold">{comment.user.fullName}</p>
                <p className="mb-2 text-xs text-muted-foreground">@{comment.user.username}</p>
                <p className="text-sm">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}