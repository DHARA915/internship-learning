import React from 'react'

const Admindashboard = () => {
  return (
    <div>
      This is Admin Dashboard
    </div>
  )
}

export default Admindashboard


// import {
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
//   type CSSProperties,
//   type ReactNode,
// } from "react";
// import { useSelector } from "react-redux";
// import {
//   IndianRupee,
//   ShoppingBag,
//   SlidersHorizontal,
//   TrendingDown,
//   TrendingUp,
//   UtensilsCrossed,
//   type LucideIcon,
// } from "lucide-react";
// import { cn } from "../../lib/utils";
// import type { RootState } from "../../Redux/store";
// import { formatPrice } from "../../utils/MenuItemdata.ts";

// /* =====================================================================
//    Dashboard
//    - Menu numbers (items, sections, modifiers, veg split, items per section)
//      are LIVE from Redux.
//    - Revenue, orders, top-selling counts and recent orders are DUMMY data.
//      Replace the DUMMY block below when you have a real orders API.
//    - Theme colour = --button-primary (orange). Charts, bars and active chips
//      use it; text stays on --text-* tokens for contrast.
//    ===================================================================== */

// /* ---------- entrance animation (one orchestrated sequence) ---------- */
// const animationCss = `
// @keyframes dash-rise {
//   from { opacity: 0; transform: translateY(16px); }
//   to   { opacity: 1; transform: none; }
// }
// @keyframes dash-draw {
//   from { stroke-dashoffset: 1; }
//   to   { stroke-dashoffset: 0; }
// }
// @keyframes dash-fade {
//   from { opacity: 0; }
//   to   { opacity: 1; }
// }
// @keyframes dash-grow {
//   from { transform: scaleX(0); }
//   to   { transform: scaleX(1); }
// }
// @keyframes dash-donut {
//   from { stroke-dasharray: 0 var(--c); }
//   to   { stroke-dasharray: var(--len) var(--gap); }
// }

// /* cards rise one after another: --i is the card's position */
// .dash-rise  { animation: dash-rise .6s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i, 0) * 70ms); }
// /* revenue line draws itself, then the area under it fades in */
// .dash-line  { stroke-dasharray: 1 2; animation: dash-draw 1.3s cubic-bezier(.4,0,.2,1) .55s both; }
// .dash-area  { animation: dash-fade 1s ease-out 1s both; }
// /* bars grow from the left */
// .dash-bar   { transform-origin: left center; animation: dash-grow .9s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(.7s + var(--i, 0) * 90ms); }
// /* donut segments sweep in */
// .dash-donut { animation: dash-donut 1.1s cubic-bezier(.22,1,.36,1) .65s both; }

// @media (prefers-reduced-motion: reduce) {
//   .dash-rise, .dash-line, .dash-area, .dash-bar, .dash-donut { animation: none !important; }
//   .dash-line { stroke-dasharray: none; }
// }
// `;

// /** Counts a number up from 0 once the dashboard opens (instant if motion is reduced) */
// function useCountUp(target: number, duration = 1200, delay = 250) {
//   const [value, setValue] = useState(0);
//   useEffect(() => {
//     if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
//       setValue(target);
//       return;
//     }
//     let raf = 0;
//     let start = 0;
//     const timer = setTimeout(() => {
//       const tick = (now: number) => {
//         if (!start) start = now;
//         const p = Math.min((now - start) / duration, 1);
//         setValue(target * (1 - Math.pow(1 - p, 3))); // ease-out
//         if (p < 1) raf = requestAnimationFrame(tick);
//       };
//       raf = requestAnimationFrame(tick);
//     }, delay);
//     return () => {
//       clearTimeout(timer);
//       cancelAnimationFrame(raf);
//     };
//   }, [target, duration, delay]);
//   return value;
// }

// /** Width of an element in px, kept up to date on resize */
// function useWidth<T extends HTMLElement>() {
//   const ref = useRef<T>(null);
//   const [width, setWidth] = useState(0);
//   useLayoutEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     setWidth(el.clientWidth);
//     const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);
//   return [ref, width] as const;
// }

// const withIndex = (i: number) => ({ "--i": i }) as CSSProperties;

// /* ---------- DUMMY data ---------- */
// const DAY_MS = 86_400_000;

// /** Deterministic fake revenue for the last `days` days (weekends are busier) */
// const makeRevenue = (days: number) =>
//   Array.from({ length: days }, (_, i) => {
//     const date = new Date(Date.now() - (days - 1 - i) * DAY_MS);
//     const weekend = date.getDay() === 0 || date.getDay() === 6;
//     const value = 15000 + 4800 * Math.sin(i / 1.9) + (weekend ? 4200 : 0) + (i % 4) * 600;
//     return { date, value: Math.round(value / 100) * 100 };
//   });

// const TOP_SOLD = [142, 118, 96, 74, 53]; // units sold this week, applied to your real items

// type OrderStatus = "Delivered" | "Preparing" | "Cancelled";
// const recentOrders: {
//   id: string;
//   customer: string;
//   items: number;
//   total: number;
//   status: OrderStatus;
//   time: string;
// }[] = [
//   { id: "#1048", customer: "Aarav Mehta", items: 3, total: 749, status: "Preparing", time: "2 min ago" },
//   { id: "#1047", customer: "Diya Shah", items: 2, total: 458, status: "Preparing", time: "9 min ago" },
//   { id: "#1046", customer: "Kabir Patel", items: 5, total: 1295, status: "Delivered", time: "24 min ago" },
//   { id: "#1045", customer: "Isha Verma", items: 1, total: 199, status: "Delivered", time: "41 min ago" },
//   { id: "#1044", customer: "Rohan Desai", items: 4, total: 862, status: "Cancelled", time: "1 hr ago" },
//   { id: "#1043", customer: "Meera Joshi", items: 2, total: 389, status: "Delivered", time: "1 hr ago" },
// ];

// const statusCls: Record<OrderStatus, string> = {
//   Delivered: "bg-green-600/10 text-green-700",
//   Preparing: "bg-amber-500/15 text-amber-700",
//   Cancelled: "bg-red-600/10 text-red-700",
// };

// /* ---------- small building blocks ---------- */
// const Card = ({
//   i = 0,
//   title,
//   description,
//   action,
//   className,
//   children,
// }: {
//   i?: number; // entrance order
//   title?: string;
//   description?: string;
//   action?: ReactNode;
//   className?: string;
//   children: ReactNode;
// }) => (
//   <section
//     style={withIndex(i)}
//     className={cn("dash-rise rounded-xl border border-line bg-primary p-5", className)}
//   >
//     {(title || action) && (
//       <header className="mb-4 flex items-start justify-between gap-3">
//         <div className="space-y-0.5">
//           <h2 className="text-sm font-semibold text-primary">{title}</h2>
//           {description && <p className="text-xs text-tertiary">{description}</p>}
//         </div>
//         {action}
//       </header>
//     )}
//     {children}
//   </section>
// );

// const StatCard = ({
//   i,
//   label,
//   value,
//   format = (n) => String(n),
//   icon: Icon,
//   delta,
//   hint,
// }: {
//   i: number;
//   label: string;
//   value: number;
//   format?: (n: number) => string;
//   icon: LucideIcon;
//   delta?: number; // % change, dummy for sales cards
//   hint: string;
// }) => {
//   const shown = Math.round(useCountUp(value));
//   const up = (delta ?? 0) >= 0;
//   const Trend = up ? TrendingUp : TrendingDown;
//   return (
//     <Card i={i}>
//       <div className="flex items-start justify-between">
//         <div className="space-y-1">
//           <p className="text-sm text-secondary">{label}</p>
//           <p className="text-2xl font-semibold tabular-nums tracking-tight text-primary">
//             {format(shown)}
//           </p>
//         </div>
//         <span className="row-dull flex h-10 w-10 items-center justify-center rounded-lg text-primary">
//           <Icon className="h-5 w-5" />
//         </span>
//       </div>
//       <div className="mt-3 flex items-center gap-2 text-xs">
//         {delta != null && (
//           <span
//             className={cn(
//               "inline-flex items-center gap-1 font-medium",
//               up ? "text-green-700" : "text-red-700",
//             )}
//           >
//             <Trend className="h-3.5 w-3.5" />
//             {Math.abs(delta)}%
//           </span>
//         )}
//         <span className="text-tertiary">{hint}</span>
//       </div>
//     </Card>
//   );
// };

// const ItemThumb = ({ src, name }: { src: string; name: string }) => {
//   const [failed, setFailed] = useState(false);
//   if (!src || failed)
//     return (
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-tertiary text-sm font-medium text-secondary">
//         {name.charAt(0).toUpperCase()}
//       </div>
//     );
//   return (
//     <img
//       src={src}
//       alt=""
//       loading="lazy"
//       onError={() => setFailed(true)}
//       className="h-10 w-10 shrink-0 rounded-lg border border-line object-cover"
//     />
//   );
// };

// /* ---------- area chart (plain SVG, sized to its container) ---------- */
// const H = 220;
// const TOP = 16;
// const BOTTOM = 4;

// const niceMax = (v: number) => {
//   if (v <= 0) return 1;
//   const step = 10 ** Math.floor(Math.log10(v)) / 2;
//   return Math.ceil(v / step) * step;
// };
// const compact = (v: number) =>
//   v === 0 ? "0" : `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;

// type Point = { label: string; tooltip: string; value: number };

// const AreaChart = ({ data, labelEvery }: { data: Point[]; labelEvery: number }) => {
//   const [hover, setHover] = useState<number | null>(null);
//   const [plotRef, W] = useWidth<HTMLDivElement>();

//   const n = data.length;
//   const max = niceMax(Math.max(...data.map((d) => d.value)));
//   const yOf = (v: number) => TOP + (1 - v / max) * (H - TOP - BOTTOM);
//   const xs = data.map((_, i) => ((i + 0.5) / n) * W);
//   const ys = data.map((d) => yOf(d.value));
//   const ticks = [0, 1, 2, 3, 4].map((i) => (max * i) / 4);

//   let line = `M ${xs[0]} ${ys[0]}`;
//   for (let i = 1; i < n; i++) {
//     const cx = (xs[i - 1] + xs[i]) / 2;
//     line += ` C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
//   }
//   const area = `${line} L ${xs[n - 1]} ${H} L ${xs[0]} ${H} Z`;

//   const hx = hover == null ? 0 : ((hover + 0.5) / n) * 100;
//   const tipLeft = Math.min(Math.max(hx, 14), 86);

//   return (
//     <div>
//       <div className="flex">
//         {/* y-axis labels */}
//         <div className="relative h-[220px] w-12 shrink-0">
//           {ticks.map((t) => (
//             <span
//               key={t}
//               className="absolute right-2 -translate-y-1/2 text-xs text-tertiary"
//               style={{ top: yOf(t) }}
//             >
//               {compact(t)}
//             </span>
//           ))}
//         </div>

//         {/* plot */}
//         <div
//           ref={plotRef}
//           className="relative h-[220px] flex-1"
//           onMouseLeave={() => setHover(null)}
//         >
//           {W > 0 && (
//             <svg
//               width={W}
//               height={H}
//               viewBox={`0 0 ${W} ${H}`}
//               className="absolute inset-0 text-button-primary"
//               aria-hidden
//             >
//               <defs>
//                 <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
//                   <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               {ticks.map((t) => (
//                 <line
//                   key={t}
//                   x1={0}
//                   x2={W}
//                   y1={yOf(t)}
//                   y2={yOf(t)}
//                   className="stroke-line"
//                   strokeWidth={1}
//                 />
//               ))}
//               <path className="dash-area" d={area} fill="url(#revenue-fill)" />
//               <path
//                 className="dash-line"
//                 d={line}
//                 pathLength={1}
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2.5}
//                 strokeLinejoin="round"
//               />
//             </svg>
//           )}

//           {/* one hover / focus column per point */}
//           <div className="absolute inset-0 flex">
//             {data.map((d, i) => (
//               <button
//                 key={i}
//                 type="button"
//                 aria-label={`${d.tooltip}: ${formatPrice(d.value)}`}
//                 onMouseEnter={() => setHover(i)}
//                 onFocus={() => setHover(i)}
//                 onBlur={() => setHover(null)}
//                 className="h-full flex-1 cursor-default focus:outline-none"
//               />
//             ))}
//           </div>

//           {hover != null && W > 0 && (
//             <>
//               <div
//                 className="pointer-events-none absolute bottom-0 top-0 w-px bg-line"
//                 style={{ left: `${hx}%` }}
//               />
//               <div
//                 className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-button-primary shadow"
//                 style={{ left: `${hx}%`, top: ys[hover] }}
//               />
//               <div
//                 className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line bg-primary px-2.5 py-1.5 text-xs shadow-md"
//                 style={{ left: `${tipLeft}%` }}
//               >
//                 <p className="text-tertiary">{data[hover].tooltip}</p>
//                 <p className="font-semibold tabular-nums text-primary">
//                   {formatPrice(data[hover].value)}
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* x-axis labels */}
//       <div className="flex pl-12">
//         {data.map((d, i) => (
//           <div key={i} className="relative h-6 flex-1">
//             {i % labelEvery === 0 && (
//               <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap text-xs text-tertiary">
//                 {d.label}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// /* ---------- donut ---------- */
// const Donut = ({ veg, nonVeg }: { veg: number; nonVeg: number }) => {
//   const total = veg + nonVeg;
//   const shownTotal = Math.round(useCountUp(total, 1000, 650));
//   const r = 40;
//   const C = 2 * Math.PI * r;
//   const vegLen = total ? (veg / total) * C : 0;
//   const nonVegLen = total ? (nonVeg / total) * C : 0;
//   const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

//   const seg = (len: number): CSSProperties =>
//     ({ "--c": C, "--len": len, "--gap": C - len }) as CSSProperties;

//   return (
//     <div className="flex flex-col items-center gap-5">
//       <div className="relative h-40 w-40">
//         <svg
//           viewBox="0 0 100 100"
//           className="h-full w-full -rotate-90"
//           role="img"
//           aria-label={`${veg} veg and ${nonVeg} non-veg items`}
//         >
//           <circle cx={50} cy={50} r={r} fill="none" strokeWidth={12} className="stroke-line" />
//           {vegLen > 0 && (
//             <circle
//               className="dash-donut stroke-green-600"
//               style={seg(vegLen)}
//               cx={50}
//               cy={50}
//               r={r}
//               fill="none"
//               strokeWidth={12}
//               strokeDasharray={`${vegLen} ${C - vegLen}`}
//             />
//           )}
//           {nonVegLen > 0 && (
//             <circle
//               className="dash-donut stroke-red-600"
//               style={seg(nonVegLen)}
//               cx={50}
//               cy={50}
//               r={r}
//               fill="none"
//               strokeWidth={12}
//               strokeDasharray={`${nonVegLen} ${C - nonVegLen}`}
//               strokeDashoffset={-vegLen}
//             />
//           )}
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-2xl font-semibold tabular-nums text-primary">{shownTotal}</span>
//           <span className="text-xs text-tertiary">active items</span>
//         </div>
//       </div>

//       <ul className="grid w-full gap-2 text-sm">
//         {[
//           { label: "Veg", n: veg, dot: "bg-green-600" },
//           { label: "Non-Veg", n: nonVeg, dot: "bg-red-600" },
//         ].map((row) => (
//           <li key={row.label} className="flex items-center justify-between">
//             <span className="flex items-center gap-2 text-secondary">
//               <span className={cn("h-2.5 w-2.5 rounded-full", row.dot)} />
//               {row.label}
//             </span>
//             <span className="font-medium text-primary">
//               {row.n} <span className="font-normal text-tertiary">({pct(row.n)}%)</span>
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// /* ---------- page ---------- */
// const RANGES = [
//   { key: 7, label: "7 days" },
//   { key: 30, label: "30 days" },
// ] as const;

// const AdminDashboard = () => {
//   const items = useSelector((s: RootState) => s.menuItems.menuItems);
//   const sections = useSelector((s: RootState) => s.menuSections.menuSections);
//   const modifiers = useSelector((s: RootState) => s.modifiers.modifiers);
//   const [range, setRange] = useState<7 | 30>(7);

//   /* live menu stats */
//   const menu = useMemo(() => {
//     const active = items.filter((i) => i.status === "Active");
//     const veg = active.filter((i) => i.isVeg).length;
//     const perSection = sections
//       .map((s) => ({
//         id: s.id,
//         name: s.name,
//         count: active.filter((i) => i.menuSectionId === s.id).length,
//       }))
//       .sort((a, b) => b.count - a.count);
//     return {
//       active,
//       veg,
//       nonVeg: active.length - veg,
//       perSection,
//       maxPerSection: Math.max(1, ...perSection.map((p) => p.count)),
//       activeModifiers: modifiers.filter((m) => m.status === "Active").length,
//     };
//   }, [items, sections, modifiers]);

//   /* dummy sales series */
//   const revenue = useMemo<Point[]>(
//     () =>
//       makeRevenue(range).map(({ date, value }) => ({
//         value,
//         label:
//           range === 7
//             ? date.toLocaleDateString("en-IN", { weekday: "short" })
//             : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
//         tooltip: date.toLocaleDateString("en-IN", {
//           weekday: "short",
//           day: "numeric",
//           month: "short",
//         }),
//       })),
//     [range],
//   );
//   const revenueTotal = revenue.reduce((sum, d) => sum + d.value, 0);

//   const topItems = menu.active.slice(0, TOP_SOLD.length).map((item, i) => ({
//     item,
//     sold: TOP_SOLD[i],
//   }));

//   return (
//     <div className="space-y-4 p-6">
//       <style>{animationCss}</style>

//       {/* stat cards */}
//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           i={0}
//           label="Revenue today"
//           value={24850}
//           format={formatPrice}
//           icon={IndianRupee}
//           delta={12.4}
//           hint="vs yesterday"
//         />
//         <StatCard
//           i={1}
//           label="Orders today"
//           value={86}
//           icon={ShoppingBag}
//           delta={-3.2}
//           hint="vs yesterday"
//         />
//         <StatCard
//           i={2}
//           label="Active menu items"
//           value={menu.active.length}
//           icon={UtensilsCrossed}
//           hint={`${items.length} in total across ${sections.length} sections`}
//         />
//         <StatCard
//           i={3}
//           label="Modifier groups"
//           value={menu.activeModifiers}
//           icon={SlidersHorizontal}
//           hint={`${modifiers.length} created`}
//         />
//       </div>

//       {/* revenue + veg split */}
//       <div className="grid gap-4 xl:grid-cols-3">
//         <Card
//           i={4}
//           className="xl:col-span-2"
//           title="Revenue"
//           description={`${formatPrice(revenueTotal)} in the last ${range} days`}
//           action={
//             <div className="flex gap-2">
//               {RANGES.map((r) => (
//                 <button
//                   key={r.key}
//                   type="button"
//                   aria-pressed={range === r.key}
//                   onClick={() => setRange(r.key)}
//                   className={cn(
//                     "cursor-pointer rounded-lg border px-3 py-1 text-xs transition-colors",
//                     range === r.key
//                       ? "row-dull border-button-primary text-primary"
//                       : "border-line bg-primary text-secondary hover:bg-secondary",
//                   )}
//                 >
//                   {r.label}
//                 </button>
//               ))}
//             </div>
//           }
//         >
//           {/* key = remount on range change so the line draws again */}
//           <AreaChart key={range} data={revenue} labelEvery={range === 7 ? 1 : 5} />
//         </Card>

//         <Card i={5} title="Veg and non-veg" description="Active menu items">
//           <Donut veg={menu.veg} nonVeg={menu.nonVeg} />
//         </Card>
//       </div>

//       {/* items per section + top selling */}
//       <div className="grid gap-4 lg:grid-cols-2">
//         <Card i={6} title="Items per menu section" description="Active items in each section">
//           {menu.perSection.length === 0 ? (
//             <p className="py-6 text-center text-sm text-tertiary">
//               No menu sections yet. Add one on the Menu Sections page.
//             </p>
//           ) : (
//             <ul className="grid gap-4">
//               {menu.perSection.map((s, idx) => (
//                 <li key={s.id} className="grid gap-1.5">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-primary">{s.name}</span>
//                     <span className="font-medium tabular-nums text-secondary">{s.count}</span>
//                   </div>
//                   <div className="h-2 overflow-hidden rounded-full bg-tertiary">
//                     <div
//                       className="dash-bar h-full rounded-full bg-button-primary"
//                       style={{ ...withIndex(idx), width: `${(s.count / menu.maxPerSection) * 100}%` }}
//                     />
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </Card>

//         <Card i={7} title="Top selling items" description="Units sold this week">
//           {topItems.length === 0 ? (
//             <p className="py-6 text-center text-sm text-tertiary">
//               Add menu items to see them here.
//             </p>
//           ) : (
//             <ul className="grid gap-4">
//               {topItems.map(({ item, sold }, idx) => (
//                 <li key={item.id} className="flex items-center gap-3">
//                   <ItemThumb src={item.image} name={item.name} />
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-baseline justify-between gap-3">
//                       <p className="truncate text-sm font-medium text-primary">{item.name}</p>
//                       <p className="shrink-0 text-sm font-medium tabular-nums text-primary">
//                         {formatPrice(sold * item.price)}
//                       </p>
//                     </div>
//                     <div className="mt-1.5 flex items-center gap-3">
//                       <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-tertiary">
//                         <div
//                           className="dash-bar h-full rounded-full bg-button-primary"
//                           style={{ ...withIndex(idx), width: `${(sold / TOP_SOLD[0]) * 100}%` }}
//                         />
//                       </div>
//                       <span className="shrink-0 text-xs tabular-nums text-tertiary">
//                         {sold} sold
//                       </span>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </Card>
//       </div>

//       {/* recent orders */}
//       <Card i={8} title="Recent orders" description="Latest orders from all channels">
//         <div className="-mx-2 overflow-x-auto px-2">
//           <table className="w-full min-w-[560px] text-left text-sm">
//             <thead>
//               <tr className="border-b border-line text-secondary">
//                 <th className="py-2 pr-4 font-medium">Order</th>
//                 <th className="py-2 pr-4 font-medium">Customer</th>
//                 <th className="py-2 pr-4 font-medium">Items</th>
//                 <th className="py-2 pr-4 font-medium">Total</th>
//                 <th className="py-2 pr-4 font-medium">Status</th>
//                 <th className="py-2 text-right font-medium">Placed</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentOrders.map((o, idx) => (
//                 <tr
//                   key={o.id}
//                   className={cn(idx !== recentOrders.length - 1 && "border-b border-line")}
//                 >
//                   <td className="py-3 pr-4 font-medium text-primary">{o.id}</td>
//                   <td className="py-3 pr-4 text-primary">{o.customer}</td>
//                   <td className="py-3 pr-4 text-secondary">{o.items}</td>
//                   <td className="py-3 pr-4 tabular-nums text-primary">{formatPrice(o.total)}</td>
//                   <td className="py-3 pr-4">
//                     <span
//                       className={cn(
//                         "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
//                         statusCls[o.status],
//                       )}
//                     >
//                       {o.status}
//                     </span>
//                   </td>
//                   <td className="py-3 text-right text-tertiary">{o.time}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AdminDashboard;