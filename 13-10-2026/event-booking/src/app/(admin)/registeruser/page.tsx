// app/admin/registrations/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import FormField from "@/components/form-field/FormField";
import { selectAllEvents } from "@/Redux/Slices/eventslice";
import type { Registration } from "@/data/registration/registrationdata";
import { selectAllRegistrations } from "@/Redux/Slices/Registrationsslice ";

type SortKey = "newest" | "oldest" | "name" | "amount_high" | "amount_low";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Name A–Z", value: "name" },
  { label: "Amount: high to low", value: "amount_high" },
  { label: "Amount: low to high", value: "amount_low" },
];

const SORTERS: Record<SortKey, (a: Registration, b: Registration) => number> = {
  newest: (a, b) => b.id - a.id,
  oldest: (a, b) => a.id - b.id,
  name: (a, b) => a.full_name.localeCompare(b.full_name),
  amount_high: (a, b) => b.total_amount - a.total_amount,
  amount_low: (a, b) => a.total_amount - b.total_amount,
};

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const columns: DataTableColumn<Registration>[] = [
  {
    key: "attendee",
    header: "Attendee",
    cell: (r) => (
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {initials(r.full_name)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold">{r.full_name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "event",
    header: "Event",
    cell: (r) => r.event_title,
    cellClassName: "max-w-56 truncate",
  },
  {
    key: "tickets",
    header: "Ticket",
    cell: (r) => `${r.tickets} ${r.tickets === 1 ? "ticket" : "tickets"}`,
  },
  {
    key: "amount",
    header: "Amount",
    cell: (r) => (r.total_amount > 0 ? inr(r.total_amount) : "Free"),
  },
  {
    key: "code",
    header: "Ticket code",
    cell: (r) => r.code,
    cellClassName: "font-mono font-bold",
  },
];

export default function RegistrationsPage() {
  const registrations = useSelector(selectAllRegistrations);
  const events = useSelector(selectAllEvents);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [category, setCategory] = useState("all");

  // a registration has no category, so find it through its event
  const categoryByEventId = useMemo(
    () => new Map<number, string>(events.map((e) => [e.id, e.category])),
    [events],
  );

  const categoryOptions = useMemo(
    () => [
      { label: "All categories", value: "all" },
      ...Array.from(new Set(events.map((e) => e.category))).map((c) => ({
        label: c,
        value: c,
      })),
    ],
    [events],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = registrations.filter((r) => {
      const matchesCategory =
        category === "all" || categoryByEventId.get(r.event_id) === category;

      const matchesQuery =
        !q ||
        [r.full_name, r.email, r.code, r.event_title].some((field) =>
          field.toLowerCase().includes(q),
        );

      return matchesCategory && matchesQuery;
    });

    return filtered.sort(SORTERS[sort]);
  }, [registrations, query, sort, category, categoryByEventId]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Registrations</h1>
        <p className="mt-1 text-muted-foreground">
          {rows.length} of {registrations.length} registrations
        </p>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-[1fr_12rem_14rem]">
        <FormField
          type="text"
          name="search"
          // label="Search"
          placeholder="Search attendee, email or ticket code"
          value={query}
          onChange={(value) => setQuery(value)}
        />

        <FormField
          type="select"
          name="category"
          options={categoryOptions}
          value={category}
          onChange={(value) => setCategory(value)}
        />

        <FormField
          type="select"
          name="sort"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(value) => setSort(value as SortKey)}
        />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(r) => r.id}
        caption="All registrations"
        emptyMessage="No registrations found."
      />
    </div>
  );
}