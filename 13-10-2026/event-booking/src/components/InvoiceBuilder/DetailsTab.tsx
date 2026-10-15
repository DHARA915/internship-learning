// components/ui/Tabs.tsx
"use client";

import type { ReactNode } from "react";
import { cn } from "cn";
import { Button } from "../ui/button";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  /** shows a small red dot on the tab */
  hasError?: boolean;
};

type TabsProps<T extends string> = {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Common tab bar. It only draws the tabs; the page decides what to show.
 * Give the content `role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`}`.
 */
export function Tabs<T extends string>({ tabs, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn("flex gap-1 overflow-x-auto rounded-xl bg-muted p-1", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Button
            key={tab.value}
            type="button"
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={active}
            aria-controls={`panel-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex flex-1 shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 sm:px-4 [&_svg]:size-4",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.hasError && (
              <span className="size-2 rounded-full bg-danger" role="img" aria-label="has errors" />
            )}
          </Button>
        );
      })}
    </div>
  );
}