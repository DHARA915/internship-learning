import { useState } from "react";
import { useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { addToCart, buildCartKey } from "../../../Redux/Slices/cartSlice";
import type { AppDispatch } from "../../../Redux/store";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../../../components/ui/drawer";
import {
  formatPrice,
  type MenuItem,
  type ItemModifierGroup,
} from "../../../utils/MenuItemdata";
import { VegMark, ItemImage } from "./ItemCard";

/* ---------- helpers (also used by the pages for the "from" price) ---------- */

// cartSlice still types these ids as numbers, but the real ids are strings
// ("itm_001", "menu_001"). Keep the real value and only satisfy the type.
const asCartId = (id: string) => id as unknown as number;

type Selection = Record<string, string[]>; // groupId -> chosen option ids

// a "preference" group must be answered; an "addon" group is optional
const isRequired = (g: ItemModifierGroup) => g.type === "preference";

/** required groups start with their first option picked, add-ons start empty */
export const getDefaultSelection = (item: MenuItem): Selection =>
  Object.fromEntries(
    item.modifiers.map((g) => [
      g.groupId,
      isRequired(g) && g.options[0] ? [g.options[0].id] : [],
    ]),
  );

/** every option picked for this item, with the group it belongs to */
const getPicked = (item: MenuItem, selection: Selection) =>
  item.modifiers.flatMap((group) =>
    group.options
      .filter((o) => selection[group.groupId]?.includes(o.id))
      .map((option) => ({ group, option })),
  );

/** price of ONE unit = selected preference price + selected add-ons */
export const getUnitPrice = (item: MenuItem, selection: Selection) =>
  getPicked(item, selection).reduce((sum, { option }) => sum + option.price, 0);

const choiceHint = (g: ItemModifierGroup) => {
  const pick = g.selection === "single" ? "Choose 1" : "Choose any";
  return isRequired(g) ? `Required · ${pick}` : `Optional · ${pick}`;
};

/* ---------- the drawer ---------- */

type ItemDrawerProps = {
  item: MenuItem | null;
  /** the menu the customer is ordering from (saved on the cart line) */
  menuId: string;
  /** false when the menu is not being served right now: ordering is blocked */
  live?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ItemDrawer = ({
  item,
  menuId,
  live,
  open,
  onOpenChange,
}: ItemDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Selection>({});

  // start fresh every time the drawer opens or a different dish is chosen
  // (state is adjusted during render, so there is no flash of old values)
  const [last, setLast] = useState<{ open: boolean; item: MenuItem | null }>({
    open: false,
    item: null,
  });
  if (last.open !== open || last.item !== item) {
    setLast({ open, item });
    if (open && item) {
      setQuantity(1);
      setSelected(getDefaultSelection(item));
    }
  }

  const toggleOption = (group: ItemModifierGroup, optionId: string) => {
    setSelected((prev) => {
      const current = prev[group.groupId] ?? [];

      if (group.selection === "single") {
        // radio behaviour; an optional group can be cleared by tapping again
        const alreadyPicked = current.includes(optionId);
        return {
          ...prev,
          [group.groupId]:
            alreadyPicked && !isRequired(group) ? [] : [optionId],
        };
      }

      return {
        ...prev,
        [group.groupId]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const picked = item ? getPicked(item, selected) : [];
  const unitPrice = item ? getUnitPrice(item, selected) : 0;
  const lineTotal = unitPrice * quantity;

  const missingGroups = item
    ? item.modifiers.filter(
        (g) => isRequired(g) && !(selected[g.groupId]?.length > 0),
      )
    : [];
  const canAdd = !!item && missingGroups.length === 0 && live;

  const handleAddToCart = () => {
    if (!item || !canAdd) return;

    // every modifier option the customer picked
    const chosenModifiers = picked.map(({ group, option }) => ({
      groupId: group.groupId,
      groupName: group.groupName,
      optionId: option.id,
      name: option.name,
      price: option.price,
    }));

    dispatch(
      addToCart({
        // key keeps the same item with different modifiers as separate lines
        key: buildCartKey(
          asCartId(item.id),
          chosenModifiers.map((m) => m.optionId),
        ),
        itemId: asCartId(item.id),
        name: item.name,
        image: item.image,
        isVeg: item.isVeg,
        menuSectionId: asCartId(menuId), // the menu the customer ordered from
        basePrice: 0, // all pricing comes from the selected options
        modifiers: chosenModifiers,
        modifierTotal: unitPrice,
        unitPrice, // selected preference + add-ons, for ONE unit
        quantity,
        lineTotal,
      }),
    );
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="flex h-full w-full flex-col gap-0 bg-primary p-0 sm:max-w-md">
        {item && (
          <>
            {/* Fixed: image */}
            <div className="h-64 w-full shrink-0 overflow-hidden p-3">
              <ItemImage
                src={item.image}
                name={item.name}
                className="h-full w-full rounded-lg"
              />
            </div>

            {/* Fixed: name, price, description */}
            <DrawerHeader className="flex shrink-0 flex-col gap-1.5 border-b border-line p-5 text-left">
              <div className="flex items-center gap-2">
                <VegMark isVeg={item.isVeg} />
                <DrawerTitle className="text-xl text-primary">
                  {item.name}
                </DrawerTitle>
              </div>
              <p className="text-lg font-semibold text-button-primary">
                {formatPrice(unitPrice)}
              </p>
              <DrawerDescription className="w-full !max-w-none text-wrap text-sm leading-relaxed text-secondary">
                {item.description}
              </DrawerDescription>
            </DrawerHeader>

            {/* Scrolls: modifiers only */}
            <div className="min-h-0 flex-1 overflow-y-auto pt-5">
              {item.modifiers.length === 0 && (
                <p className="px-5 pb-5 text-sm text-secondary">
                  No customisation for this item.
                </p>
              )}

              {item.modifiers.map((group) => {
                const isSingle = group.selection === "single";
                const required = isRequired(group);

                return (
                  <div key={group.groupId} className="px-5 pb-5">
                    <div className="mb-2 flex items-baseline justify-between">
                      <h4 className="text-sm font-semibold text-primary">
                        {group.groupName}
                      </h4>
                      <span className="text-xs text-tertiary">
                        {choiceHint(group)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {group.options.map((opt) => {
                        const isSelected =
                          selected[group.groupId]?.includes(opt.id) ?? false;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleOption(group, opt.id)}
                            aria-pressed={isSelected}
                            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                              isSelected
                                ? "border-button-primary bg-button-primary/10"
                                : "border-line hover:bg-black/5"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={`flex size-4 shrink-0 items-center justify-center border-2 ${
                                  isSingle ? "rounded-full" : "rounded"
                                } ${
                                  isSelected
                                    ? "border-button-primary bg-button-primary"
                                    : "border-line"
                                }`}
                              >
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-white" />
                                )}
                              </span>
                              <span className="font-medium text-primary">
                                {opt.name}
                              </span>
                            </span>

                            {/* preferences show their full price, add-ons show "+" */}
                            <span className="shrink-0 text-xs text-secondary">
                              {required
                                ? formatPrice(opt.price)
                                : `+${formatPrice(opt.price)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fixed: quantity + price + add button */}
            <DrawerFooter className="shrink-0 gap-4 border-t border-line p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Quantity
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity === 1}
                    className="flex size-9 items-center justify-center rounded-lg border border-line text-primary hover:bg-black/5 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" />
                  </button>

                  <span className="w-6 text-center text-base font-semibold text-primary">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex size-9 items-center justify-center rounded-lg border border-line text-primary hover:bg-black/5"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-secondary">
                <span>
                  {formatPrice(unitPrice)} × {quantity}
                </span>
                <span className="font-semibold text-primary">
                  {formatPrice(lineTotal)}
                </span>
              </div>

              {missingGroups.length > 0 && (
                <p className="text-xs text-red-600">
                  Please choose: {missingGroups.map((g) => g.groupName).join(", ")}
                </p>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="h-11 w-full rounded-lg bg-button-primary text-sm font-semibold text-hover hover:bg-button-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {live
                  ? `Add To Cart ${formatPrice(lineTotal)}`
                  : "Not being served right now"}
              </button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ItemDrawer;