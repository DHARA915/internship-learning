// import { useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Sparkles } from "lucide-react";
// import type { RootState } from "../../Redux/store";
// import ItemCard from "../../modules/user/components/ItemCard";
// import ItemDrawer, {
//   getDefaultSelection,
//   getUnitPrice,
// } from "../../modules/user/components/Itemdrawer";
// import type { MenuItem } from "../../utils/MenuItemdata";
// import { isMenuLive } from "../../utils/Menusectiondata";

// type Suggestion = { item: MenuItem; menuId: string;};


// const greeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return "Good morning";
//   if (hour < 17) return "Good afternoon";
//   return "Good evening";
// };

// const Home = () => {
//   const currentUser = useSelector((s: RootState) => s.auth.currentUser);
//   const menus = useSelector((s: RootState) => s.menus.menus);
//   // same slice key the menu page uses; adjust if your store names it differently
//   const menuItems = useSelector((s: RootState) => s.menuItems.menuItems);

//   // the dish whose drawer is open
//   const [open, setOpen] = useState(false);
//   const [chosen, setChosen] = useState<Suggestion | null>(null);

//   // header search bar writes ?q=...
//   const [searchParams] = useSearchParams();
//   const query = (searchParams.get("q") ?? "").trim().toLowerCase();

// const liveMenus = useMemo(
//   () => (menus ?? []).filter((m) => isMenuLive(m)),
//   [menus],
// );

//   // Suggestions: up to 2 dishes from each active menu (all matches when searching)
//   const suggestions = useMemo<Suggestion[]>(() => {
//     const itemsById = new Map<string, MenuItem>(
//       (menuItems ?? []).map((i) => [i.id, i]),
//     );
//     const seen = new Set<string>(); // a dish can be in several menus; show it once
//     const result: Suggestion[] = [];

//     const matches = (i: MenuItem, menuName: string) =>
//       !query ||
//       i.name.toLowerCase().includes(query) ||
//       i.description.toLowerCase().includes(query) ||
//       menuName.toLowerCase().includes(query);

//     for (const menu of liveMenus) {
//       const live = isMenuLive(menu);
//       let taken = 0;
//       for (const id of menu.itemIds) {
//         const item = itemsById.get(id);
//         if (!item || item.status !== "Active" || seen.has(item.id)) continue;
//         if (!matches(item, menu.name)) continue;
//         if (!query && taken >= 2) break;
//         seen.add(item.id);
//         taken += 1;
//         result.push({ item, menuId: menu.id,});
//       }
//     }
//     return result;
//   }, [liveMenus, menuItems, query]);

//   const openItem = (s: Suggestion) => {
//     setChosen(s);
//     setOpen(true);
//   };

//   const firstName = currentUser?.name?.split(" ")[0] ?? "there";

//   return (
//     <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
//       {/* ---------------- Small banner ---------------- */}
//       <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-button-primary px-5 py-5 sm:px-8 sm:py-6">
//         <div className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full border border-white/20" />
//         <div className="pointer-events-none absolute -bottom-20 right-24 size-40 rounded-full border border-white/20" />

//         <div className="relative">
//           <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85">
//             <Sparkles className="size-3.5" />
//             {greeting()}
//           </span>
//           <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
//             Hi {firstName}, hungry?
//           </h1>
//           <p className="mt-1 text-sm text-white/85">
//             Pick a dish, customise it and add it to your cart.
//           </p>
//         </div>
//       </section>

//       <section>
//         <div className="mb-5">
//           <h2 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
//             {query ? "Search results" : "What would you like to eat today?"}
//           </h2>
//           <p className="mt-1 text-sm text-secondary">
//             {query
//               ? `${suggestions.length} dish${suggestions.length === 1 ? "" : "es"} for "${query}"`
//               : "Here are a few things we think you'll love."}
//           </p>
//         </div>

//         {suggestions.length === 0 ? (
//           <p className="rounded-xl border border-dashed border-line p-10 text-center text-sm text-secondary">
//             {query
//               ? `No dishes match "${query}".`
//               : "No dishes available right now."}
//           </p>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {suggestions.map((s) => (
//               <ItemCard
//                 key={s.item.id}
//                 item={s.item}
//                 startPrice={getUnitPrice(s.item, getDefaultSelection(s.item))}
//                 showModifiers={false}
//                 onClick={() => openItem(s)}
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Same drawer the menu page uses: pick options, quantity, add to cart */}
//       <ItemDrawer
//         item={chosen?.item ?? null}
//         menuId={chosen?.menuId ?? ""}
//         open={open}
//         onOpenChange={setOpen}
//       />
//     </div>
//   );
// };

// export default Home;

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import type { RootState } from "../../Redux/store";
import { Button } from "../../components/ui/button";
import ItemCard from "../../modules/user/components/ItemCard";
import ItemDrawer, {
  getDefaultSelection,
  getUnitPrice,
} from "../../modules/user/components/Itemdrawer";
import type { MenuItem } from "../../utils/MenuItemdata";
import { isMenuLive } from "../../utils/Menusectiondata";

type Suggestion = { item: MenuItem; menuId: string };

/** dishes shown per menu until the customer taps "Show all dishes" */
const PER_MENU = 6;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
  const menus = useSelector((s: RootState) => s.menus.menus);
  // same slice key the menu page uses; adjust if your store names it differently
  const menuItems = useSelector((s: RootState) => s.menuItems.menuItems);

  // the dish whose drawer is open
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<Suggestion | null>(null);
  const [showAll, setShowAll] = useState(false);

  // header search bar writes ?q=...
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  // only menus being served right now (Active + today + inside the time window)
  const liveMenus = useMemo(
    () => (menus ?? []).filter((m) => isMenuLive(m)),
    [menus],
  );

  // Every available dish from the live menus (a dish in several menus shows once)
  const dishes = useMemo<Suggestion[]>(() => {
    const itemsById = new Map<string, MenuItem>(
      (menuItems ?? []).map((i) => [i.id, i]),
    );
    const seen = new Set<string>();
    const result: Suggestion[] = [];

    const matches = (i: MenuItem, menuName: string) =>
      !query ||
      i.name.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query) ||
      menuName.toLowerCase().includes(query);

    for (const menu of liveMenus) {
      for (const id of menu.itemIds) {
        const item = itemsById.get(id);
        if (!item || item.status !== "Active" || seen.has(item.id)) continue;
        if (!matches(item, menu.name)) continue;
        seen.add(item.id);
        result.push({ item, menuId: menu.id });
      }
    }
    return result;
  }, [liveMenus, menuItems, query]);

  // Without a search: PER_MENU dishes from each menu, or everything after "Show all"
  const visible = useMemo(() => {
    if (query || showAll) return dishes;
    const perMenu: Record<string, number> = {};
    return dishes.filter((d) => {
      perMenu[d.menuId] = (perMenu[d.menuId] ?? 0) + 1;
      return perMenu[d.menuId] <= PER_MENU;
    });
  }, [dishes, query, showAll]);

  const hasMore = !query && dishes.length > visible.length;
  const canCollapse = !query && showAll && dishes.length > liveMenus.length * PER_MENU;

  const openItem = (s: Suggestion) => {
    setChosen(s);
    setOpen(true);
  };

  const firstName = currentUser?.name?.split(" ")[0] ?? "there";

  const emptyMessage = query
    ? `No dishes match "${query}".`
    : liveMenus.length === 0
      ? "No menus are being served right now. Please check back later."
      : "No dishes available right now.";

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
              ? `${dishes.length} dish${dishes.length === 1 ? "" : "es"} for "${query}"`
              : "Here are a few things we think you'll love."}
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-10 text-center text-sm text-secondary">
            {emptyMessage}
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((s) => (
                <ItemCard
                  key={s.item.id}
                  item={s.item}
                  startPrice={getUnitPrice(s.item, getDefaultSelection(s.item))}
                  showModifiers={false}
                  onClick={() => openItem(s)}
                />
              ))}
            </div>

            {(hasMore || canCollapse) && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {hasMore
                    ? `Show all ${dishes.length} dishes`
                    : "Show fewer dishes"}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Same drawer the menu page uses: pick options, quantity, add to cart */}
      <ItemDrawer
        item={chosen?.item ?? null}
        menuId={chosen?.menuId ?? ""}
        live
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default Home;