// components/dashboard/charts.tsx
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CategoryDatum = { name: string; value: number };

export const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const compactInr = (amount: number) =>
  `₹${new Intl.NumberFormat("en-IN", { notation: "compact" }).format(amount)}`;

// Uses your --color-cat-* tokens (Tailwind v4 theme vars) and falls back to a palette
const FALLBACK = ["#2563eb", "#f97316", "#10b981", "#eab308", "#ec4899", "#16a34a"];

export const categoryColor = (name: string, index: number) =>
  `var(--color-cat-${name.toLowerCase().replace(/\s+/g, "-")}, ${FALLBACK[index % FALLBACK.length]})`;

// ---------- shared pieces ----------

type TooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string | number; value?: number | string }[];
  format: (value: number) => string;
};

function ChartTooltip({ active, payload, label, format }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{label ?? item.name}</p>
      <p className="text-muted-foreground">{format(Number(item.value))}</p>
    </div>
  );
}

const EmptyChart = () => (
  <p className="py-12 text-center text-sm text-muted-foreground">No data yet.</p>
);

// ---------- donut: share by category ----------

export function CategoryDonutChart({
  data,
  unit,
}: {
  data: CategoryDatum[];
  /** word shown under the total in the middle, e.g. "bookings" */
  unit: string;
}) {
  const total = data.reduce((sum, data) => sum + data.value, 0);
  if (!total) return <EmptyChart />;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative size-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
                isAnimationActive={true}
  animationBegin={0}
  animationDuration={700}
  animationEasing="ease-in-out"
            >
              {data.map((data, i) => (
                <Cell key={data.name} fill={categoryColor(data.name, i)} />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip format={(v) => `${v.toLocaleString("en-IN")} ${unit}`} />}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold">{total.toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-3">
        {data.map((data, i) => (
          <li key={data.name} className="flex items-center gap-3 text-sm">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ background: categoryColor(data.name, i) }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{data.name}</span>
            <span className="text-muted-foreground tabular-nums">{data.value}</span>
            <span className="w-14 text-right font-semibold tabular-nums">
              {((data.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- bars: revenue by category ----------

export function CategoryRevenueChart({ data }: { data: CategoryDatum[] }) {
  if (!data.some((d) => d.value > 0)) return <EmptyChart />;

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--color-line, #e5e7eb)" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={compactInr}
            width={56}
          />
          <Tooltip
            cursor={{ fill: "rgba(120,120,120,0.08)" }}
            content={<ChartTooltip format={inr} />}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={categoryColor(d.name, i)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}