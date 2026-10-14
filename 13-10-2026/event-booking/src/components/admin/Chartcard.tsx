// components/dashboard/ChartCard.tsx
import type { ReactNode } from "react";
import { cn } from "cn";

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Common white card with a title, used for charts and lists on the dashboard. */
export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <section className={cn("rounded-2xl bg-card p-5 shadow-sm sm:p-6", className)}>
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}