// components/inventory/dashboard/CategoryBars.tsx
"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CategoryStat = { name: string; value: number; units: number; products: number };

// Chart colours read your global.css tokens (the value after the comma is only a fallback).
const COLORS = {
  brand: "var(--color-brand, #16a34a)",
  track: "var(--color-tertiary, #f1f5f9)",
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const compactMoney = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

type TipProps = { active?: boolean; payload?: { payload: CategoryStat }[] };

function CategoryTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold">{item.name}</p>
      <p>{money(item.value)}</p>
      <p className="text-muted-foreground">
        {item.products} {item.products === 1 ? "product" : "products"} · {item.units} units
        available
      </p>
    </div>
  );
}

export function CategoryBars({ data }: { data: CategoryStat[] }) {
  if (!data.some((item) => item.value > 0)) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted-foreground">
        No stock value to show yet.
      </p>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Stock value by category: ${data
        .map((item) => `${item.name} ${money(item.value)}`)
        .join(", ")}`}
    >
      <ResponsiveContainer width="100%" height={Math.max(140, data.length * 52)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 56, bottom: 0, left: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={96}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CategoryTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="value"
            fill={COLORS.brand}
            radius={[0, 6, 6, 0]}
            barSize={16}
            background={{ fill: COLORS.track, radius: 6 }}
          >
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value: unknown) => compactMoney(Number(value))}
              style={{ fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}