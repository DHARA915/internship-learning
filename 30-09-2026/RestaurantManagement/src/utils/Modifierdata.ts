export type ModifierType = "addon" | "preference";
export type Selection = "single" | "multiple";
export type Status = "Active" | "Inactive";

export interface ModifierOption {
  id: string;
  name: string;
  price?: number; // default price (add-on). Items can override it in Add Item.
}

/**
 * A general modifier group, e.g. "Size", "Portion", "Extra Cheese".
 * CHANGED: no menuSectionIds any more. A group is not tied to a menu section;
 * each menu item picks the groups it needs (Add Item page).
 */
export interface ModifierGroup {
  id: string;
  name: string;
  type: ModifierType;
  selection: Selection; // preference = choose one, add-on = admin picks one or many
  required: boolean; // preference: customer must choose; add-on: may skip
  status: Status;
  options: ModifierOption[];

    // Temporary — keep for existing code
  menuSectionIds?: any[];
}

/** Prices live on the menu item (Add Item page), one entry per option the item offers. */
export interface ItemModifierPrice {
  groupId: string;
  optionId: string;
  price: number;
}

export const MODIFIER_TYPE_LABELS: Record<ModifierType, string> = {
  addon: "Add-on",
  preference: "Preference",
};

export interface ModifierLimit {
  min: number;
  selection: Selection; // default selection mode
  required: boolean;
  placeholders: string[];
  chooseSelection?: boolean; // admin picks single / multiple (add-on)
  hasPrice?: boolean; // options carry a default price (add-on)
}

export const MODIFIER_LIMITS: Record<ModifierType, ModifierLimit> = {
  preference: {
    min: 1,
    selection: "single",
    required: true,
    placeholders: ["Small", "Medium", "Large"],
  },
  addon: {
    min: 1,
    selection: "multiple",
    required: false,
    chooseSelection: true,
    hasPrice: true,
    placeholders: ["Garlic mayo", "Peri peri", "Chipotle"],
  },
};

//type for modifieroptions
type ModifierOptionInput =
  | string
  | {
      name: string;
      isVeg: boolean;
      price?: number;
    };

/* ---------- seed JSON ---------- */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

// CHANGED: no menuSectionIds argument
const group = (
  id: string,
  name: string,
  type: ModifierType,
  options: ModifierOptionInput[],
): ModifierGroup => ({
  id,
  name,
  type,
  selection: MODIFIER_LIMITS[type].selection,
  required: MODIFIER_LIMITS[type].required,
  status: "Active",

  options: options.map((o) => {
    const option = typeof o === "string" ? { name: o, isVeg: true } : o;

    return {
      id: `${id}_${slug(option.name)}`,
      name: option.name,
      isVeg: option.isVeg,
      price: (option as { price?: number }).price, // undefined unless a default is given
    };
  }),
});

/**
 * General groups, shared by every menu section.
 * Ids of the groups that existed before are kept (mod_base, mod_drink_size, mod_portion ...)
 * so prices already saved on menu items still point to a real group and option.
 */


export const modifierSeed: ModifierGroup[] = [
  // =========================================================
  // 1. SIZE
  // =========================================================
  {
    id: "mod_size",
    name: "Size",
    type: "preference",
    selection: "single",
    required: true,
    status: "Active",
    options: [
      { id: "opt_size_small", name: "Small" },
      { id: "opt_size_medium", name: "Medium" },
      { id: "opt_size_large", name: "Large" },
    ],
  },

  // =========================================================
  // 2. CRUST
  // =========================================================
  {
    id: "mod_crust",
    name: "Crust",
    type: "preference",
    selection: "single",
    required: true,
    status: "Active",
    options: [
      { id: "opt_crust_thin", name: "Thin Crust" },
      { id: "opt_crust_hand_tossed", name: "Hand Tossed" },
      { id: "opt_crust_whole_wheat", name: "Whole Wheat" },
      { id: "opt_crust_cheese_burst", name: "Cheese Burst" },
    ],
  },

  // =========================================================
  // 3. PIZZA TOPPINGS
  // =========================================================
  {
    id: "mod_pizza_toppings",
    name: "Pizza Toppings",
    type: "addon",
    selection: "multiple",
    required: false,
    status: "Active",
    options: [
      { id: "opt_topping_mushroom", name: "Mushrooms" },
      { id: "opt_topping_olive", name: "Black Olives" },
      { id: "opt_topping_jalapeno", name: "Jalapeños" },
      { id: "opt_topping_onion", name: "Onions" },
      { id: "opt_topping_capsicum", name: "Capsicum" },
      { id: "opt_topping_corn", name: "Sweet Corn" },
      { id: "opt_topping_paneer", name: "Paneer" },
    ],
  },

  // =========================================================
  // 4. EXTRA CHEESE
  // =========================================================
  {
    id: "mod_extra_cheese",
    name: "Extra Cheese",
    type: "addon",
    selection: "single",
    required: false,
    status: "Active",
    options: [
      { id: "opt_cheese_mozzarella", name: "Mozzarella" },
      { id: "opt_cheese_cheddar", name: "Cheddar" },
      { id: "opt_cheese_parmesan", name: "Parmesan" },
    ],
  },

  // =========================================================
  // 5. BURGER ADD-ONS
  // =========================================================
  {
    id: "mod_burger_addons",
    name: "Burger Add-ons",
    type: "addon",
    selection: "multiple",
    required: false,
    status: "Active",
    options: [
      { id: "opt_burger_cheese", name: "Cheese Slice" },
      { id: "opt_burger_jalapeno", name: "Jalapeños" },
      { id: "opt_burger_pickles", name: "Pickles" },
      { id: "opt_burger_onion", name: "Caramelized Onion" },
      { id: "opt_burger_egg", name: "Fried Egg" },
      { id: "opt_burger_patty", name: "Extra Patty" },
    ],
  },

  // =========================================================
  // 6. SAUCES & DIPS
  // =========================================================
  {
    id: "mod_sauces_dips",
    name: "Sauces & Dips",
    type: "addon",
    selection: "multiple",
    required: false,
    status: "Active",
    options: [
      { id: "opt_sauce_garlic_mayo", name: "Garlic Mayo" },
      { id: "opt_sauce_peri_peri", name: "Peri Peri Sauce" },
      { id: "opt_sauce_bbq", name: "Smoky BBQ" },
      { id: "opt_sauce_chipotle", name: "Chipotle Sauce" },
      { id: "opt_dip_cheese", name: "Cheese Dip" },
      { id: "opt_dip_mint", name: "Mint Mayo" },
    ],
  },

  // =========================================================
  // 7. BEVERAGE CUSTOMIZATION
  // =========================================================
  {
    id: "mod_beverage",
    name: "Beverage Customization",
    type: "preference",
    selection: "multiple",
    required: false,
    status: "Active",
    options: [
      { id: "opt_beverage_extra_ice", name: "Extra Ice" },
      { id: "opt_beverage_no_ice", name: "No Ice" },
      { id: "opt_beverage_less_sugar", name: "Less Sugar" },
      { id: "opt_beverage_no_sugar", name: "No Sugar" },
      { id: "opt_beverage_extra_syrup", name: "Extra Flavour Syrup" },
    ],
  },

  // =========================================================
  // 8. COFFEE EXTRAS
  // =========================================================
  {
    id: "mod_coffee_extras",
    name: "Coffee Extras",
    type: "addon",
    selection: "multiple",
    required: false,
    status: "Active",
    options: [
      { id: "opt_coffee_extra_shot", name: "Extra Espresso Shot" },
      { id: "opt_coffee_whipped_cream", name: "Whipped Cream" },
      { id: "opt_coffee_vanilla", name: "Vanilla Syrup" },
      { id: "opt_coffee_caramel", name: "Caramel Syrup" },
      { id: "opt_coffee_hazelnut", name: "Hazelnut Syrup" },
    ],
  },

  // =========================================================
  // 9. SIDE & FRIES
  // =========================================================
  {
    id: "mod_side_customization",
    name: "Side Customization",
    type: "preference",
    selection: "single",
    required: false,
    status: "Active",
    options: [
      { id: "opt_fries_regular", name: "Regular Fries" },
      { id: "opt_fries_peri_peri", name: "Peri Peri Fries" },
      { id: "opt_fries_cheesy", name: "Cheesy Fries" },
      { id: "opt_fries_masala", name: "Masala Fries" },
      { id: "opt_fries_loaded", name: "Loaded Fries" },
    ],
  },

  // =========================================================
  // 10. DESSERT TOPPINGS
  // =========================================================
  {
    id: "mod_dessert_toppings",
    name: "Dessert Toppings",
    type: "addon",
    selection: "multiple",
    required: false,
    status: "Active",
    options: [
      { id: "opt_dessert_chocolate", name: "Chocolate Sauce" },
      { id: "opt_dessert_caramel", name: "Caramel Sauce" },
      { id: "opt_dessert_sprinkles", name: "Sprinkles" },
      { id: "opt_dessert_nuts", name: "Chopped Nuts" },
      { id: "opt_dessert_whipped_cream", name: "Whipped Cream" },
      { id: "opt_dessert_berries", name: "Fresh Berries" },
    ],
  },
];