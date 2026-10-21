// components/inventory/dashboard/MovementChart.tsx
"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Chart colours read your global.css tokens (the value after the comma is only a fallback).
const COLORS = {
  brand: "var(--color-brand, #16a34a)",
  danger: "var(--color-danger, #dc2626)",
  muted: "var(--color-muted-foreground, #737373)",
  track: "var(--color-tertiary, #f1f5f9)",
};

/** Only what the chart needs, so any stock movement row can be passed in. */
type MovementPoint = { change: number; created_at: string };

type DayPoint = { key: string; label: string; stockIn: number; stockOut: number };

// false on the server, true in the browser (no server/browser time-zone mismatch)
const subscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

type TipProps = {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; payload?: DayPoint }[];
};

function MovementTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-semibold">{payload[0].payload?.label}</p>
      {payload.map((item) => (
        <p key={item.name} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}: <span className="font-semibold">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export function MovementChart({ rows }: { rows: MovementPoint[] }) {
  const mounted = useMounted();

  const days = useMemo<DayPoint[]>(() => {
    if (!mounted) return [];
    const today = new Date();
    const list = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index));
      return {
        key: dayKey(date),
        label: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        stockIn: 0,
        stockOut: 0,
      };
    });

    for (const row of rows) {
      const bucket = list.find((item) => item.key === dayKey(new Date(row.created_at)));
      if (!bucket) continue;
      if (row.change > 0) bucket.stockIn += row.change;
      else bucket.stockOut += -row.change;
    }
    return list;
  }, [mounted, rows]);

  if (!mounted) return <div className="h-44 animate-pulse rounded-xl bg-tertiary" />;

  const totalIn = days.reduce((sum, day) => sum + day.stockIn, 0);
  const totalOut = days.reduce((sum, day) => sum + day.stockOut, 0);

  if (totalIn === 0 && totalOut === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted-foreground">
        No stock movements in the last 7 days.
      </p>
    );
  }

  return (
    <div>
      <div role="img" aria-label={`Last 7 days: ${totalIn} units in, ${totalOut} units out`}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={days} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke={COLORS.track} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: COLORS.muted }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: COLORS.muted }}
            />
            <Tooltip content={<MovementTooltip />} cursor={{ fill: COLORS.track }} />
            <Bar
              dataKey="stockIn"
              name="Stock in"
              fill={COLORS.brand}
              radius={[4, 4, 0, 0]}
              maxBarSize={14}
            />
            <Bar
              dataKey="stockOut"
              name="Stock out"
              fill={COLORS.danger}
              radius={[4, 4, 0, 0]}
              maxBarSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-brand" />
          Stock in <span className="font-semibold">+{totalIn}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-danger" />
          Stock out <span className="font-semibold">−{totalOut}</span>
        </span>
      </div>
    </div>
  );
}