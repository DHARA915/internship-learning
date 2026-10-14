// components/dashboard/StatCard.tsx
import type { ReactNode } from "react";
import { cn } from "cn";

type StatCardProps = {
  label: string;
  value: ReactNode;
  /** Small line under the value, e.g. "3 drafts not counted" */
  hint?: ReactNode;
  icon: ReactNode;
  className?: string;
};

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl bg-card p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tertiary text-brand [&_svg]:size-5">
          {icon}
        </span>
      </div>

      <p className="mt-3 truncate text-3xl font-extrabold tracking-tight sm:text-4xl">
        {value}
      </p>

      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}