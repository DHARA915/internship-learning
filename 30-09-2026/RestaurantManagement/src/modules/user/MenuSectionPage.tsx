import { useState } from "react";
import ItemCard, { VegMark, ItemImage } from "../../modules/user/ItemCard";
import { useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { addToCart, buildCartKey } from "../../Redux/Slices/cartSlice";
import type { AppDispatch, RootState } from "../../Redux/store";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../../components/ui/drawer";
import {
  formatPrice,
  type MenuItem,
  type ItemModifierGroup,
} from "../../utils/MenuItemdata";
import { isMenuLive, fmtTime, daysLabel } from "../../utils/Menusectiondata";

/* ---------- helpers ---------- */

// cartSlice still types these ids as numbers, but the real ids are strings
// ("itm_001", "menu_001"). Keep the real value and only satisfy the type.
const asCartId = (id: string) => id as unknown as number;

type Selection = Record<string, string[]>; // groupId -> chosen option ids

// a "preference" group must be answered; an "addon" group is optional
const isRequired = (g: ItemModifierGroup) => g.type === "preference";

/** required groups start with their first option picked, add-ons start empty */
const getDefaultSelection = (item: MenuItem): Selection =>
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

/** price of ONE unit = sum of the selected modifier options */
const getUnitPrice = (item: MenuItem, selection: Selection) =>
  getPicked(item, selection).reduce((sum, { option }) => sum + option.price, 0);

const choiceHint = (g: ItemModifierGroup) => {
  const pick = g.selection === "single" ? "Choose 1" : "Choose any";
  return isRequired(g) ? `Required · ${pick}` : `Optional · ${pick}`;
};


/* ---------- page ---------- */

const MenuSectionPage = () => {
  // route param keeps its old name; its value is now a menu id (menu_001 ...)
  const { sectionId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const menus = useSelector((s: RootState) => s.menus.menus);
  // adjust if your store registers the menu item slice under another key
  const menuItems = useSelector((s: RootState) => s.menuItems.menuItems);

  // All hooks must stay above the early return below
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Selection>({});

  const openItem = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelected(getDefaultSelection(item));
    setOpen(true);
  };

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

  const menu = menus.find((m) => m.id === sectionId);

  if (!menu || menu.status !== "Active") {
    return <Navigate to="/user/home" replace />;
  }

  // A menu lists its items by id, in the order the admin chose.
  // An item can belong to several menus.
  const items = menu.itemIds
    .map((id) => menuItems.find((i) => i.id === id))
    .filter((i): i is MenuItem => !!i && i.status === "Active");

  // is the menu being served right now (day + time window)?
  const live = isMenuLive(menu);

  // ----- drawer: price + validation for the open item -----
  const picked = selectedItem ? getPicked(selectedItem, selected) : [];
  const unitPrice = selectedItem ? getUnitPrice(selectedItem, selected) : 0;
  const lineTotal = unitPrice * quantity;

  const missingGroups = selectedItem
    ? selectedItem.modifiers.filter(
        (g) => isRequired(g) && !(selected[g.groupId]?.length > 0),
      )
    : [];
  const canAdd = !!selectedItem && missingGroups.length === 0;

  const handleAddToCart = () => {
    if (!selectedItem || !canAdd) return;

    // every modifier option the customer picked
    const chosenModifiers = picked.map(({ group, option }) => ({
      groupId: group.groupId,
      groupName: group.groupName,
      optionId: option.id,
      name: option.name,
      price: option.price,
    }));

    const cartItem = {
      // key keeps the same item with different modifiers as separate lines
      key: buildCartKey(
        asCartId(selectedItem.id),
        chosenModifiers.map((m) => m.optionId),
      ),
      itemId: asCartId(selectedItem.id),
      name: selectedItem.name,
      image: selectedItem.image,
      isVeg: selectedItem.isVeg,
      menuSectionId: asCartId(menu.id), // the menu the customer ordered from
      basePrice: 0, // dishes have no base price; all pricing comes from modifiers
      modifiers: chosenModifiers,
      modifierTotal: unitPrice,
      unitPrice, // sum of selected modifiers, for ONE unit
      quantity,
      lineTotal,
    };

    dispatch(addToCart(cartItem));
    setOpen(false);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Menu header */}
      <div className="mb-6 flex items-center gap-4">
        {menu.icon ? (
          <img
            src={menu.icon}
            alt=""
            className="size-14 rounded-xl bg-brand-soft object-contain p-1"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-xl bg-brand-soft text-xl font-semibold text-primary">
            {menu.name.charAt(0)}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-primary">{menu.name}</h1>
          <p className="text-sm text-secondary">
            {fmtTime(menu.timing.startTime)} – {fmtTime(menu.timing.endTime)} ·{" "}
            {daysLabel(menu.timing.days)}
          </p>
          {!live && (
            <p className="mt-1 text-xs font-medium text-red-600">
              Not being served right now
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-sm text-secondary">
          No items available in this menu yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              startPrice={getUnitPrice(item, getDefaultSelection(item))}
              onClick={() => openItem(item)}
              disabled={!live}
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerContent className="flex h-full w-full flex-col gap-0 bg-primary p-0 sm:max-w-md">
          {selectedItem && (
            <>
              {/* Fixed: image */}
              <div className="h-64 w-full shrink-0 overflow-hidden p-3">
                <ItemImage
                  src={selectedItem.image}
                  name={selectedItem.name}
                  className="h-full w-full rounded-lg"
                />
              </div>

              {/* Fixed: name, price, description */}
              <DrawerHeader className="flex shrink-0 flex-col gap-1.5 border-b border-line p-5 text-left">
                <div className="flex items-center gap-2">
                  <VegMark isVeg={selectedItem.isVeg} />
                  <DrawerTitle className="text-xl text-primary">
                    {selectedItem.name}
                  </DrawerTitle>
                </div>
                <p className="text-lg font-semibold text-button-primary">
                  {formatPrice(unitPrice)}
                </p>
                <DrawerDescription className="w-full !max-w-none text-wrap text-sm leading-relaxed text-secondary">
                  {selectedItem.description}
                </DrawerDescription>
              </DrawerHeader>

              {/* Scrolls: modifiers only */}
              <div className="min-h-0 flex-1 overflow-y-auto pt-5">
                {selectedItem.modifiers.length === 0 && (
                  <p className="px-5 pb-5 text-sm text-secondary">
                    No customisation for this item.
                  </p>
                )}

                {selectedItem.modifiers.map((group) => {
                  const single = group.selection === "single";

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
                  Add To Cart {formatPrice(lineTotal)}
                </button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MenuSectionPage;