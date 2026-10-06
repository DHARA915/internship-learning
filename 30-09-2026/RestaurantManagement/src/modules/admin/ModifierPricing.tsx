import { useSelector } from "react-redux";
import { FormField } from "../../components/form-field/FormField.tsx";
// import { selectModifiersForSection } from "../../Redux/Slices/Modifierslice.ts";
import type { RootState } from "../../Redux/store.ts";
import type { ItemModifierPrice } from "../../utils/Modifierdata.ts";
import { useMemo } from "react";

interface Props {
  /** Item's menu section id; only modifier groups used for it are shown */
  menuSectionId?: number;
  isVeg: boolean;
  value: ItemModifierPrice[];
  onChange: (next: ItemModifierPrice[]) => void;
  /** Optional error text per group id, e.g. { mod_base: "Price at least one option" } */
  errors?: Record<string, string>;
}

// FormField may hand back an event or the raw value; accept both
const read = (e: any) => (e?.target ? e.target.value : e);

/** Shows every active modifier option from Redux; admin enters a price per option.
 *  A blank price means the option is not offered for this item. */
export function ModifierPricing({
  menuSectionId,
  value,
  isVeg,
  onChange,
  errors = {},
}: Props) {
  // const groups = useSelector((s: RootState) =>
  //   selectModifiersForSection(s, menuSectionId),
  // );

// filtering option based on veg option
  const visibleGroups = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          options: g.options.filter((o) => !isVeg || o.isVeg !== false),
        }))
        .filter((g) => g.options.length > 0),
    [groups, isVeg],
  );

const getPrice = (groupId: string, optionId: string) => {
  const price = value.find(
    (p) => p.groupId === groupId && p.optionId === optionId,
  )?.price;
  return price == null ? "" : String(price);
};

  const setPrice = (groupId: string, optionId: string, raw: unknown) => {
    const rest = value.filter(
      (p) => !(p.groupId === groupId && p.optionId === optionId),
    );
    const n = raw === "" || raw == null ? NaN : Number(raw);
    // blank or invalid = option not offered for this item
    onChange(Number.isFinite(n) && n >= 0 ? [...rest, { groupId, optionId, price: n }] : rest);
  };

  if (visibleGroups.length === 0)
    return (
      <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-tertiary">
        No modifier groups are assigned to this menu section yet.
      </p>
    );

  return (
    <div className="grid gap-5">
      {visibleGroups.map((g) => {
        const priced = value.filter((p) => p.groupId === g.id).length;
        return (
          <div
            key={g.id}
            className="grid gap-3 rounded-lg border border-line px-3 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">
                  {g.name}
                  {g.required && <span className="ml-0.5 text-danger">*</span>}
                </p>
                <p className="text-xs text-tertiary">
                  {g.required ? "Required" : "Optional"} ·{" "}
                  {g.selection === "single" ? "customer picks one" : "customer can pick several"}
                </p>
              </div>
              <span className="shrink-0 text-xs text-tertiary">
                {priced}/{g.options.length} priced
              </span>
            </div>

            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-3">
              {g.options.map((o) => (
                <FormField
                  key={o.id}
                  type="number"
                  name={`price-${g.id}-${o.id}`}
                  label={o.name}
                  placeholder="Not offered"
                  value={getPrice(g.id, o.id) ?? ""}
                  onChange={(e: any) => setPrice(g.id, o.id, read(e))}
                />
              ))}
            </div>

            {errors[g.id] && (
              <p className="text-xs text-danger">{errors[g.id]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}