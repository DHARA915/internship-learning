/* modules/CompareProducts/CompareStepper.tsx
   The 1 > 2 > 3 banner. `active` is the current step (0, 1 or 2). */
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

const STEPS = [
  { title: "Select Category", description: "Choose the product category (e.g., Phones)" },
  { title: "Choose Items", description: "Search and select up to 3 products to compare" },
  { title: "Compare", description: "View side-by-side comparison and find the best match" },
];

export function CompareStepper({ active }: { active: number }) {
  return (
    <ol className="grid gap-4 rounded-2xl bg-product p-5 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li
          key={s.title}
          aria-current={i === active ? "step" : undefined}
          className={cn(
            "flex items-center gap-3 transition-opacity",
            i > active && "opacity-60",
          )}
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-base font-semibold",
              i <= active ? "bg-button-primary text-white" : "bg-muted text-secondary",
            )}
          >
            {i + 1}
          </span>

          <div className="min-w-0">
            <p className="font-semibold text-primary">{s.title}</p>
            <p className="text-sm text-secondary">{s.description}</p>
          </div>

          {i < STEPS.length - 1 && (
            <ChevronRight
              aria-hidden
              className="ml-auto hidden size-4 shrink-0 text-secondary md:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}