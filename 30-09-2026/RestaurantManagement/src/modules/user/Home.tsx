import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import type { RootState } from "../../Redux/store";
import Card from "../../components/Card";
import { menuItemSeed, formatPrice } from "../../utils/MenuItemdata";

type MenuItem = (typeof menuItemSeed)[number];

/**
 * I couldn't see the MenuItem type, so this tries the usual price field
 * names. Once you know the real one, replace the body with a direct read,
 * e.g. `return i.basePrice;`
 */
const getPrice = (i: MenuItem): number => {
  const record = i as unknown as Record<string, unknown>;
  for (const key of ["price", "basePrice", "sellingPrice", "amount", "cost"]) {
    const value = record[key];
    if (typeof value === "number") return value;
  }
  return 0;
};

const VegMark = ({ isVeg }: { isVeg: boolean }) => (
  <span
    title={isVeg ? "Veg" : "Non-veg"}
    className={`flex size-5 shrink-0 items-center justify-center rounded-sm border-2 bg-white ${
      isVeg ? "border-green-600" : "border-red-600"
    }`}
  >
    <span
      className={`size-2.5 rounded-full ${
        isVeg ? "bg-green-600" : "bg-red-600"
      }`}
    />
  </span>
);

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
  const menus = useSelector((s: RootState) => s.menus.menus);

  // header search bar writes ?q=...
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const activeMenus = useMemo(
    () => (menus ?? []).filter((m) => m.status === "Active"),
    [menus],
  );

  // Suggestions: up to 2 dishes from each active menu (all matches when searching)
  const suggestions = useMemo(() => {
    const itemsById = new Map<string, MenuItem>(
      menuItemSeed.map((i) => [i.id, i]),
    );
    const seen = new Set<string>(); // a dish can be in several menus; show it once
    const result: { item: MenuItem; menuId: string }[] = [];

    const matches = (i: MenuItem, menuName: string) =>
      !query ||
      i.name.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query) ||
      menuName.toLowerCase().includes(query);

    for (const menu of activeMenus) {
      let taken = 0;
      for (const id of menu.itemIds) {
        const item = itemsById.get(id);
        if (!item || item.status !== "Active" || seen.has(item.id)) continue;
        if (!matches(item, menu.name)) continue;
        if (!query && taken >= 2) break;
        seen.add(item.id);
        taken += 1;
        result.push({ item, menuId: menu.id });
      }
    }
    return result;
  }, [activeMenus, query]);

  const firstName = currentUser?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
      {/* ---------------- Small banner ---------------- */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-button-primary px-5 py-5 sm:px-8 sm:py-6">
        <div className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -bottom-20 right-24 size-40 rounded-full border border-white/20" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85">
            <Sparkles className="size-3.5" />
            {greeting()}
          </span>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Hi {firstName}, hungry?
          </h1>
          <p className="mt-1 text-sm text-white/85">
            Pick a dish, customise it and add it to your cart.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            {query ? "Search results" : "What would you like to eat today?"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {query
              ? `${suggestions.length} dish${suggestions.length === 1 ? "" : "es"} for "${query}"`
              : "Here are a few things we think you'll love."}
          </p>
        </div>

        {suggestions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-10 text-center text-sm text-secondary">
            {query
              ? `No dishes match "${query}".`
              : "No dishes available right now."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suggestions.map(({ item, menuId }) => (
              <Card
                key={item.id}
                image={item.image}
                title={item.name}
                price={formatPrice(getPrice(item))}
                badge={<VegMark isVeg={item.isVeg} />}
                onClick={() => navigate(`/user/menu/${menuId}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;