import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  ChevronDown,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import type { AppDispatch, RootState } from "../../Redux/store";
import {
  buildCartKey,
  changeQuantity,
  clearCart,
  removeFromCart,
  updateCartModifiers,
  type CartItem,
  type CartModifier,
} from "../../Redux/Slices/cartSlice";
import { formatPrice, menuItemSeed } from "../../utils/MenuItemdata";
import { getItemGroups, type PricedOption } from "../../utils/modifierHelpers";
import type { ModifierGroup } from "../../utils/Modifierdata";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((s: RootState) => s.cart.items);
  console.log("All items from cart",items)
  const [placed, setPlaced] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);

  const placeOrder = () => {
    // the array that will become the order
    console.log("Order:", JSON.stringify({ items, total }, null, 2));
    dispatch(clearCart());
    setPlaced(true);
  };

  // Edit one option of one line from inside the accordion
  const handleToggle = (
    item: CartItem,
    group: ModifierGroup,
    options: PricedOption[],
    optionId: string
  ) => {
    const current = item.modifiers
      .filter((m) => m.groupId === group.id)
      .map((m) => m.optionId);

    const nextIds =
      group.selection === "single"
        ? [optionId]
        : current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];

    const others = item.modifiers.filter((m) => m.groupId !== group.id);
    const mine: CartModifier[] = options
      .filter((o) => nextIds.includes(o.id))
      .map((o) => ({
        groupId: group.id,
        groupName: group.name,
        optionId: o.id,
        name: o.name,
        price: o.price,
      }));

    const modifiers = [...others, ...mine];

    dispatch(updateCartModifiers({ key: item.key, modifiers }));
    // the line's key changes with its options, so keep it open
    setOpenKey(buildCartKey(item.itemId, modifiers.map((m) => m.optionId)));
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 className="size-14 text-green-600" />
        <h2 className="text-xl font-semibold text-primary">Order placed</h2>
        <p className="text-sm text-secondary">
          Your order has been sent to the kitchen.
        </p>
        <Link
          to="/user/home"
          className="mt-2 inline-flex h-11 items-center rounded-lg bg-button-primary px-6 text-sm font-semibold text-hover hover:bg-button-primary-hover"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-center">
        <ShoppingCart className="size-12 text-tertiary" />
        <h2 className="text-lg font-semibold text-primary">
          Your cart is empty
        </h2>
        <Link
          to="/user/home"
          className="inline-flex h-11 items-center rounded-lg bg-button-primary px-6 text-sm font-semibold text-primary hover:bg-button-primary-hover"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
      {/* Cart lines: accordion */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isOpen = openKey === item.key;
          const menuItem = menuItemSeed.find((m) => m.id === item.itemId);
          const groups = menuItem ? getItemGroups(menuItem) : [];

          return (
            <div
              key={item.key}
              className="overflow-hidden rounded-xl border border-line bg-primary"
            >
              {/* Collapsed header: image, name, price */}
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : item.key)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-3 text-left hover:bg-black/5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-16 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-primary">
                    {item.name}
                  </h3>
                  <p className="text-xs text-tertiary">
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>
                </div>

                <span className="shrink-0 text-base font-semibold text-primary">
                  {formatPrice(item.lineTotal)}
                </span>

                <ChevronDown
                  className={`size-5 shrink-0 text-secondary transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded: editable modifiers, quantity, remove */}
              {isOpen && (
                <div className="border-t border-line">
                  {groups.length === 0 ? (
                    <p className="p-4 text-sm text-secondary">
                      No customisations for this item.
                    </p>
                  ) : (
                    groups.map(({ group, options }) => {
                      const single = group.selection === "single";
                      const chosen = item.modifiers
                        .filter((m) => m.groupId === group.id)
                        .map((m) => m.optionId);

                      return (
                        <div key={group.id} className="px-4 pt-4">
                          <div className="mb-2 flex items-baseline justify-between">
                            <h4 className="text-sm font-semibold text-primary">
                              {group.name}
                            </h4>
                            <span className="text-xs text-tertiary">
                              {group.required
                                ? "Required · Choose 1"
                                : single
                                  ? "Optional · Choose 1"
                                  : "Optional"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            {options.map((opt) => {
                              const isSelected = chosen.includes(opt.id);

                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() =>
                                    handleToggle(item, group, options, opt.id)
                                  }
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
                                        single ? "rounded-full" : "rounded"
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

                                  <span className="shrink-0 text-xs text-secondary">
                                    {opt.price > 0
                                      ? `+${formatPrice(opt.price)}`
                                      : "Free"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Quantity + remove */}
                  <div className="mt-4 flex items-center justify-between border-t border-line p-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            changeQuantity({ key: item.key, delta: -1 })
                          )
                        }
                        aria-label="Decrease quantity"
                        className="flex size-9 items-center justify-center rounded-lg border border-line text-primary hover:bg-black/5"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center text-base font-semibold text-primary">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(changeQuantity({ key: item.key, delta: 1 }))
                        }
                        aria-label="Increase quantity"
                        className="flex size-9 items-center justify-center rounded-lg border border-line text-primary hover:bg-black/5"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.key))}
                      className="flex items-center gap-1.5 text-sm text-tertiary hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="h-fit rounded-xl border border-line bg-primary p-5">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Order summary
        </h2>

        <div className="flex justify-between text-sm text-secondary">
          <span>Items</span>
          <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
        </div>

        <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold text-primary">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          type="button"
          onClick={placeOrder}
          className="mt-5 h-11 w-full rounded-lg bg-button-primary text-sm font-semibold text-hover hover:bg-button-primary-hover"
        >
          Place order · {formatPrice(total)}
        </button>
      </div>
    </div>
  );
};

export default CartPage;