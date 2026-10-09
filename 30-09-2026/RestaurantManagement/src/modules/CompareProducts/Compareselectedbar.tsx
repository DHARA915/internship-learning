import { Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { ProductImage } from "./ProductImage";
import { formatINR } from "./Helper/CompareHelper";
import type { CompareCategoryConfig } from "./Helper/Comparetype";

interface Props {
  category: CompareCategoryConfig;
  selected: any[];
  max: number;
  /** true while the choose-item grid is open (highlights the + card) */
  adding: boolean;
  onChangeCategory: () => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function CompareSelectedBar({
  category,
  selected,
  max,
  adding,
  onChangeCategory,
  onAdd,
  onRemove,
}: Props) {
  const Icon = category.icon;

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* selected category */}
      <div className="flex flex-col justify-center gap-3 rounded-2xl bg-product p-4">
        <p className="text-sm font-semibold text-primary">Selected Category</p>

        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-button-primary/10 text-button-primary">
            <Icon className="size-6" />
          </span>
          <span className="font-semibold text-primary">{category.title}</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onChangeCategory}
          className="h-auto self-start px-0 py-0 text-sm font-medium text-button-primary hover:bg-transparent hover:underline"
        >
          Change category
        </Button>
      </div>

      {/* chosen items */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-9">
        {selected.map((p, i) => (
          <div
            key={p.id}
            className="relative flex min-h-[8.5rem] items-center gap-4 rounded-2xl border border-line bg-primary p-4"
          >
            {i > 0 && (
              <span className="absolute -left-9 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-product text-xs font-bold text-button-primary md:flex">
                VS
              </span>
            )}

            <ProductImage src={p.image} alt={p.name} className="h-24 w-[4.5rem] shrink-0" />

            <div className="min-w-0">
              <p className="font-semibold text-primary">{p.name}</p>
              {p.variant && <p className="text-sm text-secondary">{p.variant}</p>}
              <p className="mt-2 font-bold text-primary">{formatINR(p.price)}</p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${p.name}`}
              onClick={() => onRemove(p.id)}
              className="absolute right-2 top-2 size-7 rounded-full text-secondary hover:bg-muted hover:text-primary"
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}

        {selected.length < max && (
          <Button
            type="button"
            variant="ghost"
            onClick={onAdd}
            className={cn(
              "h-auto min-h-[8.5rem] flex-col justify-center gap-1 whitespace-normal rounded-2xl border-2 border-dashed p-4 text-center text-sm font-normal text-secondary transition-colors",
              adding
                ? "border-button-primary bg-button-primary/5 hover:bg-button-primary/5"
                : "border-line hover:border-button-primary hover:bg-button-primary/5",
            )}
          >
            <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-button-primary/10 text-button-primary">
              <Plus className="size-5" />
            </span>
            <span className="font-medium text-primary">Add another {category.noun}</span>
            <span>(to compare up to {max})</span>
          </Button>
        )}
      </div>
    </div>
  );
}