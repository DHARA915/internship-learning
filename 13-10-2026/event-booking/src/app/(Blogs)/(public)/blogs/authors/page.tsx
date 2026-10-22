import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Post = { id: number; userId: number };

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  company: { name: string; title: string };
};

const PAGE_SIZE = 8;

function Avatar({ user, size }: { user: User; size: string }) {
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-brand-soft font-bold text-brand`}
    >
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" className="size-full object-cover" />
      ) : (
        user.firstName.charAt(0)
      )}
    </div>
  );
}

const page = async ({ searchParams }: { searchParams: Promise<{ show?: string }> }) => {
  const { show } = await searchParams;
  const visible = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE);

  const usersRes = await fetch(
    "https://dummyjson.com/users?limit=0&select=firstName,lastName,email,image,company",
    { cache: "force-cache" },
  );
  const usersData: { users: User[] } = await usersRes.json();



  // limit=0 returns all 251 posts, so every author's count is correct
  const postsRes = await fetch("https://dummyjson.com/posts?limit=0&select=userId", {
    cache: "force-cache",
  });
  const postsData: { posts: Post[] } = await postsRes.json();

  const countByAuthor = postsData.posts.reduce<Record<number, number>>((acc, post) => {
    acc[post.userId] = (acc[post.userId] ?? 0) + 1;
    return acc;
  }, {});

  const users = usersData.users;
  const shown = users.slice(0, visible);
  const hasMore = visible < users.length;

  const postPill = (count: number) =>
    `inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
      count > 0 ? "bg-brand-soft text-brand" : "bg-tertiary text-muted-foreground"
    }`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-sm text-muted-foreground">Pick an author to read all of their posts.</p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {users.length} authors
        </span>
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-card shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-tertiary text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Author</th>
              <th scope="col" className="px-5 py-3 font-semibold">Email</th>
              <th scope="col" className="px-5 py-3 font-semibold">Company</th>
              <th scope="col" className="px-5 py-3 font-semibold">Posts</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shown.map((user) => (
              <tr key={user.id} className="group relative transition hover:bg-brand-soft/40">
                <td className="px-5 py-3">
                  {/* the ::after overlay makes the whole row clickable */}
                  <Link
                    href={`/blogs/authors/${user.id}`}
                    className="flex items-center gap-3 font-semibold after:absolute after:inset-0"
                  >
                    <Avatar user={user} size="size-10" />
                    {user.firstName} {user.lastName}
                  </Link>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-5 py-3">
                  <p>{user.company.name}</p>
                  <p className="text-xs text-muted-foreground">{user.company.title}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={postPill(countByAuthor[user.id] ?? 0)}>
                    {countByAuthor[user.id] ?? 0} posts
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                    View
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {shown.map((user) => (
          <li key={user.id}>
            <div
              // href={`/blogs/authors/${user.id}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm transition hover:border-brand"
            >
              <Avatar user={user} size="size-12" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <p className="truncate text-xs text-muted-foreground">{user.company.name}</p>
              </div>
              <span className={postPill(countByAuthor[user.id] ?? 0)}>
                {countByAuthor[user.id] ?? 0}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Load more: a link, so no client state is needed */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">
          Showing {shown.length} of {users.length}
        </p>
        {hasMore && (
          <Link
            href={`/blogs/authors?show=${visible + PAGE_SIZE}`}
            scroll={false}
            className="rounded-lg border border-line bg-card px-4 py-2 text-sm font-semibold transition hover:bg-tertiary"
          >
            Load more
          </Link>
        )}
      </div>
    </>
  );
};

export default page;