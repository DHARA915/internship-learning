import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import type { CompareCategoryConfig } from "../../modules/CompareProducts/Helper/Comparetype";
import type { ProductCategory } from "../../Redux/Slices/ProductCompareSlice/compareSlice";

export function CompareCategoryCards({
  categories,
  selected,
  onSelect,
}: {
  categories: CompareCategoryConfig[];
  selected: ProductCategory | null;
  onSelect: (id: ProductCategory) => void;
}) {
  return (
    <section className="rounded-2xl bg-product p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-primary">Select Category</h2>
        <p className="mt-1 text-sm text-secondary">
          Choosee what type of product you want to compare.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = selected === c.id;

          return (
            <Button
              key={c.id}
              type="button"
              variant="ghost"
              onClick={() => onSelect(c.id)}
              className={cn(
                "relative rounded-xl border p-6 text-left transition-all hover:-translate-y-0.5",
                active
                  ? "border-button-primary bg-button-primary/10"
                  : "border-line bg-primary hover:border-button-primary/50",
              )}
            >
              {active && (
                <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-button-primary text-white">
                  <Check className="size-4" />
                </span>
              )}

              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl",
                  active
                    ? "bg-button-primary text-white"
                    : "bg-muted text-secondary",
                )}
              >
                <Icon className="size-6" />
              </span>

              <h3 className="text-lg font-semibold text-primary">{c.title}</h3>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
