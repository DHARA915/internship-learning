// app/(user)/booking/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchX } from "lucide-react";
import type { AppDispatch } from "@/Redux/store";
import {
  eventRegistered,
  selectPublishedEvents,
} from "@/Redux/Slices/eventslice";
import { seatsLeft, type EventCategory } from "@/data/events/events";
import { EventCard } from "@/components/user/Eventcard ";
import EventDetailDialog from "@/components/user/Eventdetaildialog";
import FormField from "@/components/form-field/FormField";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type PriceFilter = "all" | "free" | "paid";
type SortKey =
  | "date-asc"
  | "date-desc"
  | "price-asc"
  | "price-desc"
  | "seats-desc";

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "All prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date-asc", label: "Date: soonest first" },
  { value: "date-desc", label: "Date: latest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "seats-desc", label: "Most seats left" },
];

const CATEGORIES: EventCategory[] = ["Technology", "Business", "Design", "Music"];

// Full class names so Tailwind can see them
const categoryDot: Record<EventCategory, string> = {
  Technology: "bg-cat-technology",
  Business: "bg-cat-business",
  Design: "bg-cat-design",
  Music: "bg-cat-music",
};

export default function BookingPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector(selectPublishedEvents);

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortKey>("date-asc");

  // dialog: store only the id, so it always shows live seat counts from Redux
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = events.find((event) => event.id === selectedId) ?? null;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = events.filter((event) => {
      if (category !== "all" && event.category !== category) return false;
      if (price !== "all" && event.price_type !== price) return false;
      if (!q) return true;
      return [event.title, event.speaker, event.city, event.venue, event.category].some((v) =>
        v.toLowerCase().includes(q),
      );
    });

    const when = (e: (typeof events)[number]) => `${e.date} ${e.start_time}`;

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "date-desc":
          return when(b).localeCompare(when(a));
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "seats-desc":
          return seatsLeft(b) - seatsLeft(a);
        case "date-asc":
        default:
          return when(a).localeCompare(when(b));
      }
    });
  }, [events, search, category, price, sort]);

  const hasFilters = search !== "" || category !== "all" || price !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setPrice("all");
  };

  const register = (id: number) => dispatch(eventRegistered(id));

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Filter bar */}
      <section className="mb-8 flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1">
            <FormField
              type="search"
              name="search"
              value={search}
              onChange={(value) => setSearch(String(value))}
              placeholder="Search by event, speaker or city"
            />
          </div>

          {/* Price segmented control */}
          <div
            role="group"
            aria-label="Filter by price"
            className="flex shrink-0 gap-1 self-start rounded-xl bg-line p-1"
          >
            {PRICE_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                variant={price === value ? "outline" : "ghost"}
                aria-pressed={price === value}
                onClick={() => setPrice(value)}
                className={cn(
                  "border-transparent ",
                  price === value
                    ? "text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="shrink-0 lg:w-56">
            <FormField
              type="select"
              name="sort"
              value={sort}
              options={SORT_OPTIONS}
              onChange={(value) => setSort(value as SortKey)}
            />
          </div>
        </div>

        {/* Category chips: scroll sideways on small screens */}
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          <Button
            type="button"
            variant={category === "all" ? "default" : "outline"}
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 rounded-full",
              category === "all" && "bg-foreground hover:bg-foreground/90",
            )}
          >
            All events
          </Button>

          {CATEGORIES.map((c) => (
            <Button
              key={c}
              type="button"
              variant="outline"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 gap-2 rounded-full",
                category === c && "border-foreground",
              )}
            >
              <span className={cn("size-2 rounded-full", categoryDot[c])} />
              {c}
            </Button>
          ))}
        </div>
      </section>

      {/* Heading */}
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {visible.length} upcoming {visible.length === 1 ? "event" : "events"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Seat counts update live
        </p>
      </div>

      {/* Cards */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-4 py-16 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="size-5" />
          </div>
          <p className="font-semibold">No events match your filters</p>
          <p className="text-sm text-muted-foreground">
            Try a different search or clear the filters.
          </p>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpen={(e) => setSelectedId(e.id)}
              onRegister={(e) => router.push(`/registration/${e?.id}`)}
            />
          ))}
        </div>
      )}

{selected && (
  <EventDetailDialog
    event={selected}
    onOpenChange={(open) => !open && setSelectedId(null)}
    onRegister={(e) => router.push(`/registration/${e?.id}`)}
  />
)}
    </div>
  );
}