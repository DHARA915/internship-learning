import { BlogList } from "../../components/BlogList";

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  reactions: { likes: number; dislikes: number };
};

type User = { id: number; firstName: string; lastName: string };

const API = "https://dummyjson.com";

export default async function Page() {

  const { posts }: { posts: Post[] } = await fetch(`${API}/posts?limit=0`).then((res) => res.json());
  console.log("POSTS:",posts)
  const { users }: { users: User[] } = await fetch(
    `${API}/users?limit=0&select=firstName,lastName`,
  ).then((res) => res.json());

  const authorNames: Record<number, string> = Object.fromEntries(
    users.map((user) => [user.id, `${user.firstName} ${user.lastName}`]),
  );

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Latest posts</h1>
      <p className="mb-6 text-sm text-muted-foreground">{posts.length} posts</p>
      <BlogList posts={posts} authorNames={authorNames} />
    </>
  );
}