export type MenuCategory = "burger" | "pizza" | "pasta" | "sandwich" | "fries" | "dessert";
export type ModifierType = "base" | "addon" | "extra" | "preference";
export type Selection = "single" | "multiple";
export type Status = "Active" | "Inactive";

export interface ModifierOption {
  id: string;
  name: string;
}

/** A modifier group, e.g. "Crust", "Pasta Sauce", "Burger Add-ons". No prices here. */
export interface ModifierGroup {
  id: string;
  name: string;
  type: ModifierType;
  selection: Selection; // base/preference = pick one, addon/extra = pick several
  required: boolean; // customer must choose (base/preference) or may skip (addon/extra)
  categories: MenuCategory[]; // which menu categories use this group
  status: Status;
  options: ModifierOption[];
}

/** Prices live on the menu item (Add Item section), one entry per option the item offers. */
export interface ItemModifierPrice {
  groupId: string;
  optionId: string;
  price: number;
}

export const MENU_CATEGORIES: MenuCategory[] = ["burger", "pizza", "pasta", "sandwich", "fries", "dessert"];

export const MENU_CATEGORY_LABELS: Record<MenuCategory, string> = {
  burger: "Burger",
  pizza: "Pizza",
  pasta: "Pasta",
  sandwich: "Sandwich",
  fries: "Fries",
  dessert: "Dessert",
};

export const MODIFIER_TYPE_LABELS: Record<ModifierType, string> = {
  base: "Base",
  addon: "Add-on",
  extra: "Extra",
  preference: "Preference",
};

export interface ModifierLimit {
  min: number;
  max: number;
  selection: Selection;
  required: boolean;
  placeholders: string[];
  defaults?: string[]; // prefilled when the type is picked in the form
}

export const MODIFIER_LIMITS: Record<ModifierType, ModifierLimit> = {
  base: {
    min: 2, max: 5, selection: "single", required: true,
    placeholders: ["Small", "Medium", "Large", "Extra large", "Family"],
    defaults: ["Small", "Medium", "Large"],
  },
  addon: {
    min: 2, max: 8, selection: "multiple", required: false,
    placeholders: ["Garlic mayo", "Peri peri", "Chipotle", "Smoky BBQ"],
  },
  extra: {
    min: 2, max: 6, selection: "multiple", required: false,
    placeholders: ["Mozzarella", "Cheddar", "Parmesan"],
  },
  preference: {
    min: 2, max: 5, selection: "single", required: true,
    placeholders: ["Mild", "Medium", "Spicy"],
  },
};

/* ---------- seed JSON (built with a small helper, stored shape is plain JSON) ---------- */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const group = (
  id: string,
  name: string,
  type: ModifierType,
  categories: MenuCategory[],
  options: string[],
): ModifierGroup => ({
  id,
  name,
  type,
  selection: MODIFIER_LIMITS[type].selection,
  required: MODIFIER_LIMITS[type].required,
  categories,
  status: "Active",
  options: options.map((o) => ({ id: `${id}_${slug(o)}`, name: o })),
});

export const modifierSeed: ModifierGroup[] = [
  /* Pizza */
  group("mod_base", "Pizza Size", "base", ["pizza"], ["Small", "Medium", "Large"]),
  group("mod_crust", "Crust", "base", ["pizza"], ["Hand tossed", "Thin crust", "Cheese burst", "Whole wheat"]),
  group("mod_pizza_toppings", "Pizza Toppings", "addon", ["pizza"], [
    "Olives", "Jalapeños", "Mushrooms", "Onions", "Bell peppers", "Sweet corn", "Paneer",
  ]),
  group("mod_seasoning", "Seasoning Sachets", "addon", ["pizza", "pasta"], ["Oregano", "Chilli flakes", "Garlic powder"]),

  /* Pasta */
  group("mod_pasta_type", "Pasta Type", "base", ["pasta"], ["Penne", "Spaghetti", "Fusilli", "Macaroni"]),
  group("mod_pasta_sauce", "Pasta Sauce", "base", ["pasta"], ["Red arrabbiata", "White alfredo", "Pink rosa", "Basil pesto"]),
  group("mod_pasta_addons", "Pasta Add-ons", "addon", ["pasta"], [
    "Grilled chicken", "Mushrooms", "Broccoli", "Olives", "Garlic bread",
  ]),

  /* Burger */
  group("mod_patty_count", "Patty Count", "base", ["burger"], ["Single", "Double", "Triple"]),
  group("mod_patty_type", "Patty Type", "base", ["burger"], ["Veg", "Chicken", "Paneer"]),
  group("mod_bun", "Bun Type", "base", ["burger"], ["Classic", "Brioche", "Multigrain", "Gluten-free"]),
  group("mod_burger_addons", "Burger Add-ons", "addon", ["burger"], [
    "Cheese slice", "Jalapeños", "Caramelized onion", "Fried egg", "Pickles", "Crispy lettuce",
  ]),

  /* Sandwich */
  group("mod_bread", "Bread", "base", ["sandwich"], ["White", "Brown", "Multigrain", "Sourdough"]),
  group("mod_serve_style", "Serve Style", "preference", ["sandwich"], ["Grilled", "Toasted", "Cold"]),
  group("mod_sandwich_addons", "Sandwich Add-ons", "addon", ["sandwich"], [
    "Extra veggies", "Cheese slice", "Egg", "Grilled chicken", "Grilled paneer",
  ]),

  /* Fries */
  group("mod_fries_size", "Fries Size", "base", ["fries"], ["Regular", "Medium", "Large"]),
  group("mod_fries_seasoning", "Fries Seasoning", "preference", ["fries"], ["Salted", "Peri peri", "Cheesy", "Masala"]),
  group("mod_dips", "Dips", "addon", ["fries"], ["Ketchup", "Cheese dip", "Mint mayo", "Honey mustard"]),

  /* Dessert */
  group("mod_portion", "Portion", "base", ["dessert"], ["Regular", "Large", "Sharing"]),
  group("mod_dessert_toppings", "Dessert Toppings", "addon", ["dessert"], [
    "Hot fudge", "Caramel drizzle", "Chopped nuts", "Sprinkles", "Whipped cream", "Fresh berries",
  ]),
  group("mod_ice_cream", "Add Ice Cream", "extra", ["dessert"], ["Vanilla scoop", "Chocolate scoop", "Strawberry scoop"]),

  /* Shared across several categories */
  group("mod_sauce", "Add-on Sauces", "addon", ["pizza", "burger", "sandwich", "fries"], [
    "Garlic mayo", "Peri peri", "Chipotle", "Smoky BBQ",
  ]),
  group("mod_cheese", "Extra Cheese", "extra", ["pizza", "pasta", "burger", "sandwich"], [
    "Mozzarella", "Cheddar", "Parmesan",
  ]),
];

/*
  What an item saves (Add Item section), e.g. "Classic Chicken Burger" (category: burger):
  {
    "id": "item_7",
    "name": "Classic Chicken Burger",
    "category": "burger",
    "modifierPrices": [
      { "groupId": "mod_patty_count",  "optionId": "mod_patty_count_single",  "price": 0 },
      { "groupId": "mod_patty_count",  "optionId": "mod_patty_count_double",  "price": 60 },
      { "groupId": "mod_bun",          "optionId": "mod_bun_brioche",         "price": 25 },
      { "groupId": "mod_burger_addons","optionId": "mod_burger_addons_cheese_slice", "price": 20 },
      { "groupId": "mod_sauce",        "optionId": "mod_sauce_peri_peri",     "price": 15 }
    ]
  }
  Options with no entry are simply not offered for that item.
*/