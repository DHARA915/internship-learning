// app/admin/dashboard/page.tsx
"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CalendarCheck, IndianRupee, Armchair, Users } from "lucide-react";
import { StatCard } from "@/components/admin/Statcard";
import { ChartCard } from "@/components/admin/Chartcard";
import {
  CategoryDonutChart,
  CategoryRevenueChart,
  inr,
  type CategoryDatum,
} from "@/components/admin/charts";
import { selectAllEvents } from "@/Redux/Slices/eventslice";
import { selectAllRegistrations } from "@/Redux/Slices/Registrationsslice ";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const DashboardPage = () => {
  const events = useSelector(selectAllEvents);
  const registrations = useSelector(selectAllRegistrations);


  const data = useMemo(() => {
    const categoryByEventId = new Map(events.map((event) => [event.id, event.category]));

    const totalRevenue = registrations.reduce(
      (sum, prev) => sum + prev.total_amount,
      0,
    );
    const activeEvents = events.filter((event) => event.status === "published");

    const seatsTotal = activeEvents.reduce((sum, e) => sum + e.capacity, 0);
    const seatsTaken = activeEvents.reduce((sum, e) => sum + e.registered, 0);
    const capacityPct = seatsTotal
      ? Math.round((seatsTaken / seatsTotal) * 100)
      : 0;

    // registrations and revenue per category (a registration finds its category via its event)
    const regsByCategory = new Map<string, number>();
    const revenueByCategory = new Map<string, number>();
    for (const e of events) {
      regsByCategory.set(e.category, 0);
      revenueByCategory.set(e.category, 0);
    }
    for (const r of registrations) {
      const category = categoryByEventId.get(r.event_id);
      if (!category) continue; 
      regsByCategory.set(category, (regsByCategory.get(category) ?? 0) + 1);
      revenueByCategory.set(
        category,
        (revenueByCategory.get(category) ?? 0) + r.total_amount,
      );
    }

    const toData = (map: Map<string, number>): CategoryDatum[] =>
      Array.from(map, ([name, value]) => ({ name, value }));

    const capacityList = [...activeEvents]
      .map((e) => ({
        id: e.id,
        title: e.title,
        registered: e.registered,
        capacity: e.capacity,
        pct: e.capacity ? Math.round((e.registered / e.capacity) * 100) : 0,
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);

    const recent = [...registrations].sort((a, b) => b.id - a.id).slice(0, 5);

    return {
      totalRevenue,
      activeCount: activeEvents.length,
      draftCount: events.length - activeEvents.length,
      seatsTotal,
      seatsTaken,
      capacityPct,
      regsData: toData(regsByCategory),
      revenueData: toData(revenueByCategory),
      capacityList,
      recent,
    };
  }, [events, registrations]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          How your events are doing, at a glance.
        </p>
      </div> */}

      {/* Key numbers */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={inr(data.totalRevenue)}
          hint="From all paid registrations"
          icon={<IndianRupee />}
        />
        <StatCard
          label="Registrations"
          value={registrations.length.toLocaleString("en-IN")}
          hint="Bookings made so far"
          icon={<Users />}
        />
        <StatCard
          label="Active events"
          value={data.activeCount}
          hint={`${data.draftCount} ${data.draftCount === 1 ? "draft" : "drafts"} not live`}
          icon={<CalendarCheck />}
        />
        <StatCard
          label="Capacity filled"
          value={`${data.capacityPct}%`}
          hint={`${data.seatsTaken.toLocaleString("en-IN")} of ${data.seatsTotal.toLocaleString("en-IN")} seats, live events`}
          icon={<Armchair />}
        />
      </div>

      {/* Category charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <ChartCard
          title="Registrations by category"
          description="Share of bookings per category"
          className="lg:col-span-2"
        >
          <CategoryDonutChart data={data.regsData} unit="bookings" />
        </ChartCard>

        <ChartCard
          title="Revenue by category"
          description="Total collected per category"
          className="lg:col-span-3"
        >
          <CategoryRevenueChart data={data.revenueData} />
        </ChartCard>
      </div>

      {/* Capacity + recent bookings */}
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <ChartCard
          title="Capacity filled by event"
          description="Seats registered against capacity, live events only"
          className="lg:col-span-3"
        >
          {data.capacityList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No live events.
            </p>
          ) : (
            <ul className="space-y-5">
              {data.capacityList.map((e) => (
                <li key={e.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium">
                      {e.title}
                    </span>
                    <span className="shrink-0 text-muted-foreground tabular-nums">
                      <span className="font-semibold text-foreground">
                        {e.pct}%
                      </span>{" "}
                      {e.registered}/{e.capacity}
                    </span>
                  </div>
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-tertiary"
                    role="progressbar"
                    aria-valuenow={e.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${e.title} capacity filled`}
                  >
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${Math.min(100, e.pct)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Recent registrations"
          description="Latest 5 bookings"
          className="lg:col-span-2"
        >
          {data.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No bookings yet.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary text-sm font-semibold">
                    {initials(r.full_name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {r.full_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.event_title}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {r.total_amount > 0 ? inr(r.total_amount) : "Free"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardPage