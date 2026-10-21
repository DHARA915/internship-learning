// components/inventory/dashboard/StockHealth.tsx
"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Chart colours read your global.css tokens (the value after the comma is only a fallback).
const COLORS = {
  brand: "var(--color-brand, #16a34a)",
  muted: "var(--color-muted-foreground, #737373)",
  danger: "var(--color-danger, #dc2626)",
};

type StockHealthProps = {
  inStock: number;
  low: number;
  out: number;
  unitsAvailable: number;
  unitsReceived: number;
};

type TipProps = { active?: boolean; payload?: { name?: string; value?: number }[] };

function HealthTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-sm">
      <span className="font-semibold">{payload[0].name}</span>: {payload[0].value}
    </div>
  );
}

export function StockHealth({
  inStock,
  low,
  out,
  unitsAvailable,
  unitsReceived,
}: StockHealthProps) {
  const total = inStock + low + out;
  if (total === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted-foreground">
        Add products to see stock health.
      </p>
    );
  }

  const segments = [
    { name: "In stock", value: inStock, fill: COLORS.brand },
    { name: "Low stock", value: low, fill: COLORS.muted },
    { name: "Out of stock", value: out, fill: COLORS.danger },
  ];
  const availablePct = unitsReceived > 0 ? (unitsAvailable / unitsReceived) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* donut with the product total in the middle */}
        <div
          className="relative h-44 w-full sm:w-44 sm:shrink-0"
          role="img"
          aria-label={`${inStock} in stock, ${low} low stock, ${out} out of stock`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments.filter((segment) => segment.value > 0)}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
              />
              <Tooltip content={<HealthTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold">{total}</span>
            <span className="text-xs text-muted-foreground">
              {total === 1 ? "product" : "products"}
            </span>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2">
          {segments.map((segment) => (
            <li key={segment.name} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.fill }}
              />
              <span className="text-muted-foreground">{segment.name}</span>
              <span className="ml-auto font-semibold">{segment.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-tertiary p-3">
        <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium">Units available</span>
          <span className="font-semibold">
            {unitsAvailable}{" "}
            <span className="font-normal text-muted-foreground">of {unitsReceived}</span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-card">
          <div className="h-full rounded-full bg-brand" style={{ width: `${availablePct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {unitsReceived - unitsAvailable} units sold or taken out so far.
        </p>
      </div>
    </div>
  );
}