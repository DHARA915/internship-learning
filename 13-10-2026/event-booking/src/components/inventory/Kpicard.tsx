// components/inventory/dashboard/KpiCard.tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
export type Tone = "ok" | "warn" | "danger";

/** Colours for the card icons (global.css tokens). */
const TONE_CLASS: Record<Tone, string> = {
  ok: "bg-brand-soft text-brand",
  warn: "bg-tertiary text-foreground",
  danger: "bg-danger-soft text-danger",
};

type KpiCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: Tone;
  active: boolean;
  controls: string;
  onClick: () => void;
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  active,
  controls,
  onClick,
}: KpiCardProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-tertiary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        active ? "border-brand ring-2 ring-brand/30" : "border-line",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          TONE_CLASS[tone],
        )}
      >
        <Icon className="size-5" />
      </span>
    </button>
  );
}