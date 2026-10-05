import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";

import type { RootState } from "../../Redux/store";
import Card from "../../components/Card";
import { menuItemSeed, formatPrice } from "../../utils/MenuItemdata";

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
  const sections = useSelector(
    (s: RootState) => s.menuSections.menuSections
  );

  // header search bar writes ?q=...
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const activeSectionIds = useMemo(
    () => new Set(sections.filter((s) => s.status === "Active").map((s) => s.id)),
    [sections]
  );

  // Suggestions: up to 2 dishes from each active section, so every
  // kind of food gets a chance to show up
  const suggestions = useMemo(() => {
    const available = menuItemSeed.filter(
      (i) => i.status === "Active" && activeSectionIds.has(i.menuSectionId)
    );

    // searching: match any dish by name, description or section
    if (query) {
      return available.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.menuName.toLowerCase().includes(query)
      );
    }

    const picked: typeof available = [];
    for (const id of activeSectionIds) {
      picked.push(...available.filter((i) => i.menuSectionId === id).slice(0, 2));
    }
    return picked;
  }, [activeSectionIds, query]);

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
            {suggestions.map((item) => (
              <Card
                key={item.id}
                image={item.image}
                title={item.name}
                price={formatPrice(item.price)}
                badge={<VegMark isVeg={item.isVeg} />}
                onClick={() => navigate(`/user/menu/${item.menuSectionId}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;