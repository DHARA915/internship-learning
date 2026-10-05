import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart, type CartItem, buildCartKey } from "../../Redux/Slices/cartSlice";
import type { AppDispatch, RootState } from "../../Redux/store";
import Card from "../../components/Card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../../components/ui/drawer";
import {
  menuItemSeed,
  formatPrice,
  type MenuItem,
} from "../../utils/MenuItemdata";
import {
  modifierSeed,
  type ModifierGroup,
  type ModifierOption,
} from "../../utils/Modifierdata"; 
import { getItemGroups, getDefaultSelection } from "../../utils/modifierHelpers";

/* ---------- small UI piece ---------- */

const VegMark = ({ isVeg }: { isVeg: boolean }) => (
  <span
    title={isVeg ? "Veg" : "Non-veg"}
    className={`flex size-5 shrink-0 items-center justify-center rounded-sm border-2 bg-white ${
      isVeg ? "border-green-600" : "border-red-600"
    }`}
  >
    <span
      className={`size-2.5 rounded-full ${
        isVeg ? "bg-green-600" : "bg-red-600"
      }`}
    />
  </span>
);

/* ---------- page ---------- */

const MenuSectionPage = () => {
  const { sectionId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector(
    (s: RootState) => s.menuSections.menuSections
  );

 

  // All hooks must stay above the early return below
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const openItem = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelected(getDefaultSelection(item));
    setOpen(true);
  };

  const toggleOption = (group: ModifierGroup, optionId: string) => {
    setSelected((prev) => {
      const current = prev[group.id] ?? [];

      if (group.selection === "single") {
        return { ...prev, [group.id]: [optionId] };
      }

      return {
        ...prev,
        [group.id]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const section = sections.find((s) => String(s.id) === sectionId);

  if (!section || section.status !== "Active") {
    return <Navigate to="/user/home" replace />;
  }

  const items = menuItemSeed.filter(
    (item) => item.menuSectionId === section.id && item.status === "Active"
  );

  // Modifiers + price for the item open in the drawer
  const itemGroups = selectedItem ? getItemGroups(selectedItem) : [];

  const modifierTotal = itemGroups.reduce(
    (sum, { group, options }) =>
      sum +
      options
        .filter((o) => selected[group.id]?.includes(o.id))
        .reduce((s, o) => s + o.price, 0),
    0
  );

  // price of ONE unit = base price + selected modifiers
  const unitPrice = selectedItem ? selectedItem.price + modifierTotal : 0;

  const handleAddToCart = () => {
  if (!selectedItem) return;

  // every modifier option the customer picked
  const chosenModifiers = itemGroups.flatMap(({ group, options }) =>
    options
      .filter((o) => selected[group.id]?.includes(o.id))
      .map((o) => ({
        groupId: group.id,
        groupName: group.name,
        optionId: o.id,
        name: o.name,
        price: o.price,
      }))
  );

  const cartItem = {
    key: buildCartKey(selectedItem.id, chosenModifiers.map((m) => m.optionId)),//add key to distinct same item with different modifier 
    itemId: selectedItem.id,
    name: selectedItem.name,
    image: selectedItem.image,
    isVeg: selectedItem.isVeg,
    menuSectionId: selectedItem.menuSectionId,
    basePrice: selectedItem.price,
    modifiers: chosenModifiers,
    modifierTotal,
    unitPrice, // base price + modifiers, for ONE unit
    quantity,
    lineTotal: unitPrice * quantity,
  };

  console.log("Add to cart:", JSON.stringify(cartItem, null, 2));
  dispatch(addToCart(cartItem))
  setOpen(false);
};

  return (
    <div className="p-4 sm:p-6">
      {/* Section header */}
      <div className="mb-6 flex items-center gap-4">
        <img
          src={section.icon}
          alt=""
          className="size-14 rounded-xl bg-brand-soft object-contain p-1"
        />
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            {section.name}
          </h1>
          <p className="text-sm text-secondary">{section.description}</p>
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-sm text-secondary">
          No items available in this section yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              title={item.name}
              price={formatPrice(item.price)}
              badge={<VegMark isVeg={item.isVeg} />}
              onClick={() => openItem(item)}
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
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
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
                  {formatPrice(selectedItem.price)}
                </p>
                <DrawerDescription className="w-full !max-w-none text-wrap text-sm leading-relaxed text-secondary">
                  {selectedItem.description}
                </DrawerDescription>
              </DrawerHeader>

              {/* Scrolls: modifiers only */}
              <div className="min-h-0 flex-1 overflow-y-auto pt-5">
                {itemGroups.map(({ group, options }) => {
                  const single = group.selection === "single";

                  return (
                    <div key={group.id} className="px-5 pb-5">
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
                          const isSelected =
                            selected[group.id]?.includes(opt.id) ?? false;

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

              {/* Fixed: quantity + add button */}
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

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-11 w-full rounded-lg bg-button-primary  text-sm font-semibold text-hover hover:bg-button-primary-hover"
                >
                  Add To Cart  {formatPrice(unitPrice * quantity)}
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