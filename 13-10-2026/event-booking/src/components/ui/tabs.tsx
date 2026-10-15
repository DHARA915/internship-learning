// "use client";

// import type { ReactNode } from "react";
// import { cn } from "cn";
// import { Button } from "../ui/button";

// export type TabItem<T extends string> = {
//   value: T;
//   label: string;
//   icon?: ReactNode;
//   /** shows a small red dot on the tab */
//   hasError?: boolean;
// };

// type TabsProps<T extends string> = {
//   tabs: TabItem<T>[];
//   value: T;
//   onChange: (value: T) => void;
//   className?: string;
// };

// /**
//  * Common tab bar (underline style). It only draws the tabs; the page decides what to show.
//  * Give the content `role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`}`.
//  */
// export function Tabs<T extends string>({ tabs, value, onChange, className }: TabsProps<T>) {
//   return (
//     <div
//       role="tablist"
//       // the grey baseline sits under every tab; the active tab's blue line covers it
//       // className={cn("flex overflow-x-auto shadow-[inset_0_-1px_0_var(--color-line)]", className)}
//       className={cn(
//   "flex overflow-x-auto scrollbar-none shadow-[inset_0_-1px_0_var(--color-line)]",
//   className
// )}
//     >
//       {tabs.map((tab) => {
//         const active = tab.value === value;
//         return (
//           <Button
//             key={tab.value}
//             type="button"
//             variant="ghost"
//             role="tab"
//             id={`tab-${tab.value}`}
//             aria-selected={active}
//             aria-controls={`panel-${tab.value}`}
//             onClick={() => onChange(tab.value)}
//             className={cn(
//               "h-auto flex-1 shrink-0 items-center justify-center gap-2 rounded-none border-b-2 p-2 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/30 [&_svg]:size-4",
//               active
//                 ? "border-brand text-brand hover:text-brand"
//                 : "border-transparent text-muted-foreground hover:text-foreground",
//             )}
//           >
//             {tab.icon}
//             {tab.label}
//             {tab.hasError && (
//               <span className="size-2 rounded-full bg-danger" role="img" aria-label="has errors" />
//             )}
//           </Button>
//         );
//       })}
//     </div>
//   );
// }
"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
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
 * Common tab bar (underline style) with a sliding indicator.
 * It only draws the tabs; the page decides what to show.
 * Give the content `role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`}`.
 */
export function Tabs<T extends string>({ tabs, value, onChange, className }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const hasMeasured = useRef(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!list || !active) return;

    setIndicator((prev) =>
      prev.left === active.offsetLeft && prev.width === active.offsetWidth && prev.ready
        ? prev
        : { left: active.offsetLeft, width: active.offsetWidth, ready: true },
    );

    // keep the active tab visible on small screens (skip on first paint)
    if (hasMeasured.current) {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    hasMeasured.current = true;
  }, []);

  // move the indicator when the active tab / tabs change
  useLayoutEffect(() => {
    updateIndicator();
  }, [value, tabs, updateIndicator]);

  // keep it correct when the screen size / container size changes
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => {
      const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!active) return;
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth, ready: true });
    });
    ro.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [tabs]);

  // arrow keys / Home / End navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.value === value);
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;

    e.preventDefault();
    onChange(tabs[next].value);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      // grey baseline under every tab; the sliding indicator covers it
      className={cn(
        "relative flex overflow-x-auto scrollbar-none shadow-[inset_0_-1px_0_var(--color-line)]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Button
            key={tab.value}
            type="button"
            variant="ghost"
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={active}
            aria-controls={`panel-${tab.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              // grow to fill space when there is room, keep content width when there isn't (scrolls)
              "h-auto shrink-0 grow basis-auto items-center justify-center gap-1.5 rounded-none px-3 py-3 text-xs font-medium whitespace-nowrap outline-none transition-colors",
              "sm:gap-2 sm:px-4 sm:py-3.5 sm:text-sm",
              "hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/30 [&_svg]:size-4",
              active
                ? "text-brand hover:text-brand"
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

      {/* sliding indicator */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-brand",
          indicator.ready
            ? "transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
            : "opacity-0",
        )}
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
        }}
      />
    </div>
  );
}