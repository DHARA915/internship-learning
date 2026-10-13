// app/(protected)/dashboard/page.tsx   ->  URL: /dashboard
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from '../../app/src/components/ui/button';
const API = "https://dummyjson.com/products";

type Product = { id: number; title: string; price: number };

// Products added here get a big id (Date.now()) and don't exist in the API.
const isLocal = (id: number) => id > 1000;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default function DashboardPage() {
  const queryClient = useQueryClient();

  // Listing api(Get)
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await request<{ products: Product[] }>(
        `${API}?limit=10&select=title,price`
      );
      return data.products;
    },
    staleTime: Infinity,
  });

  // The dummy API won't remember changes, so we update the cached list too.
  const setProducts = (change: (list: Product[]) => Product[]) =>
    queryClient.setQueryData<Product[]>(["products"], (old = []) => change(old));

  // CREATE
  const addMutation = useMutation({
    mutationFn: (input: { title: string; price: number }) =>
      request(`${API}/add`, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (_data, input) =>
      setProducts((list) => [{ id: Date.now(), ...input }, ...list]),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async ({ id, price }: { id: number; price: number }) => {
      if (isLocal(id)) return;
      await request(`${API}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ price }),
      });
    },
    onSuccess: (_data, { id, price }) =>
      setProducts((list) => list.map((product) => (product.id === id ? { ...product, price } : product))),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isLocal(id)) return;
      await request(`${API}/${id}`, { method: "DELETE" });
    },
    onSuccess: (_data, id) =>
      setProducts((list) => list.filter((product) => product.id !== id)),
  });

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const price = Number(data.get("price"));

    if (!title || !(price > 0)) return;
    addMutation.mutate({ title, price }, { onSuccess: () => form.reset() });
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: number) {
    e.preventDefault();
    const price = Number(new FormData(e.currentTarget).get("price"));

    if (!(price > 0)) return;
    updateMutation.mutate({ id, price });
  }

  const anyError =addMutation.isError || updateMutation.isError || deleteMutation.isError;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Dashboard</h1>

      {/* Add */}
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-2">
        <input
          name="title"
          placeholder="Title"
          className={`${inputClass} min-w-0 flex-1`}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Price"
          className={`${inputClass} w-28`}
        />
        <Button type="submit" disabled={addMutation.isPending}>
          {addMutation.isPending ? "Adding..." : "Add"}
        </Button>
      </form>

      {anyError && (
        <p role="alert" className="mb-4 text-sm text-danger">
          Something went wrong. Please try again.
        </p>
      )}

      {/* List */}
      {isLoading ? (
        <p className="text-foreground-muted">Loading...</p>
      ) : isError ? (
        <p className="text-danger">Could not load products.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background-card p-3"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {product.title}
              </span>

              <form
                key={`${product.id}-${product.price}`}
                onSubmit={(e) => handleUpdate(e, product.id)}
                className="flex gap-2"
              >
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  defaultValue={product.price}
                  aria-label={`Price of ${product.title}`}
                  className={`${inputClass} w-24`}
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={updateMutation.isPending}
                >
                  Save
                </Button>
              </form>

              <Button
                type="button"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(product.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}