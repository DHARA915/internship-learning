/* modules/CompareProducts/CompareProductPicker.tsx
   Step 2: searchable grid of the category's items. Click a card = add it. */
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FormField } from "../../components/form-field/FormField";
import { ProductImage } from "./ProductImage";
import { formatINR } from "./Helper/CompareHelper";

interface Props {
  products: any[];
  plural: string;
  noun: string;
  selectedCount: number;
  max: number;
  highlights: (item: any) => string[];
  onPick: (product: any) => void;
  /** pass it to show a Back button (only when something is already selected) */
  onBack?: () => void;
}

export function CompareProductPicker({
  products,
  plural,
  noun,
  selectedCount,
  max,
  highlights,
  onPick,
  onBack,
}: Props) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      `${p.brand} ${p.name} ${p.variant ?? ""}`.toLowerCase().includes(q),
    );
  }, [products, search]);

  return (
    <section className="space-y-5 rounded-2xl bg-product p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-primary">
            Choose {selectedCount === 0 ? `a ${noun}` : `another ${noun}`}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Select 2 or {max} {plural} to compare.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-secondary">
            {selectedCount} / {max} selected
          </span>

          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-sm">
        <FormField
          type="search"
          name="compareSearch"
          value={search}
          onChange={(v: unknown) => setSearch(String(v))}
          placeholder={`Search ${plural}...`}
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-secondary">
          No {plural} found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {visible.map((p) => (
            <Button
              key={p.id}
              type="button"
              variant="ghost"
              onClick={() => onPick(p)}
              aria-label={`Select ${p.name}`}
              className="group h-auto flex-col items-stretch justify-start gap-0 overflow-hidden whitespace-normal rounded-xl border border-line bg-primary p-0 text-left font-normal transition-all hover:-translate-y-0.5 hover:border-button-primary hover:bg-primary hover:shadow-md"
            >
              <div className="flex h-44 items-center justify-center bg-muted p-4">
                <ProductImage src={p.image} alt={p.name} className="h-full max-w-full" />
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                  {p.brand}
                </p>
                <h3 className="text-base font-semibold text-primary">{p.name}</h3>
                {p.variant && <p className="text-sm text-secondary">{p.variant}</p>}
                <p className="mt-2 text-lg font-bold text-primary">{formatINR(p.price)}</p>

                {highlights(p).length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {highlights(p).map((h) => (
                      <li
                        key={h}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-secondary"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <span className="mt-4 rounded-lg bg-button-primary/10 py-2 text-center text-sm font-semibold text-button-primary transition-colors group-hover:bg-button-primary group-hover:text-white">
                  Select
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}