

export type ModifierType = "base" | "addon" | "extra" | "preference";
export type Selection = "single" | "multiple";
export type Status = "Active" | "Inactive";

export interface ModifierOption {
  id: string;
  name: string;
  isVeg:boolean;
}

/** A modifier group, e.g. "Crust", "Burger Add-ons". No prices here. */
export interface ModifierGroup {
  id: string;
  name: string;
  type: ModifierType;
  selection: Selection; // base/preference = pick one, addon/extra = pick several
  required: boolean; // customer must choose (base/preference) or may skip (addon/extra)
  menuSectionIds: number[]; // ids from Menusectiondata this group is offered for
  status: Status;
  options: ModifierOption[];
}

/** Prices live on the menu item (Add Item page), one entry per option the item offers. */
export interface ItemModifierPrice {
  groupId: string;
  optionId: string;
  price: number;
}

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

//type for modifieroptions

type ModifierOptionInput =
  | string
  | {
      name: string;
      isVeg: boolean;
    };

/* ---------- seed JSON ---------- */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

/** Ids from Menusectiondata. */
const SEC = { drinks: 1, pizza: 2, burgers: 3, desserts: 4, starters: 5 , pasta:6 , Sandwiches:7 ,fries:8 } as const;

const group = (
  id: string,
  name: string,
  type: ModifierType,
  menuSectionIds: number[],
  options: ModifierOptionInput[],
): ModifierGroup => ({
  id,
  name,
  type,
  selection: MODIFIER_LIMITS[type].selection,
  required: MODIFIER_LIMITS[type].required,
  menuSectionIds,
  status: "Active",

  options: options.map((o) => {
    const option =
      typeof o === "string"
        ? { name: o, isVeg: true }
        : o;

    return {
      id: `${id}_${slug(option.name)}`,
      name: option.name,
      isVeg: option.isVeg,
    };
  }),
});

export const modifierSeed: ModifierGroup[] = [
  /* Drinks */
  group(
    "mod_drink_size",
    "Drink Size",
    "base",
    [SEC.drinks],
    ["Small", "Medium", "Large"]
  ),

  group(
    "mod_drink_extras",
    "Drink Extras",
    "addon",
    [SEC.drinks],
    ["Extra shot", "Whipped cream", "Flavour syrup"]
  ),

  /* Pizza */
  group(
    "mod_base",
    "Pizza Size",
    "base",
    [SEC.pizza],
    ["Regular", "Medium", "Large"]
  ),

  group(
    "mod_crust",
    "Crust",
    "base",
    [SEC.pizza],
    ["Hand tossed", "Thin crust", "Cheese burst", "Whole wheat"]
  ),

  group(
    "mod_pizza_toppings",
    "Pizza Toppings",
    "addon",
    [SEC.pizza],
    [
      "Olives",
      "Jalapeños",
      "Mushrooms",
      "Onions",
      "Bell peppers",
      "Sweet corn",
      "Paneer",
    ]
  ),

  group(
    "mod_seasoning",
    "Seasoning Sachets",
    "addon",
    [SEC.pizza],
    ["Oregano", "Chilli flakes", "Garlic powder"]
  ),

  /* Burgers */
  group(
    "mod_patty_count",
    "Patty Count",
    "base",
    [SEC.burgers],
    ["Single", "Double", "Triple"]
  ),

  group(
    "mod_bun",
    "Bun Type",
    "base",
    [SEC.burgers],
    ["Classic", "Brioche", "Multigrain", "Gluten-free"]
  ),

  group(
    "mod_burger_addons",
    "Burger Add-ons",
    "addon",
    [SEC.burgers],
    [
      "Cheese slice",
      "Jalapeños",
      "Caramelized onion",
      { name: "Fried egg", isVeg: false },
      "Pickles",
      "Crispy lettuce",
    ]
  ),

  /* Desserts */
  group(
    "mod_portion",
    "Portion",
    "base",
    [SEC.desserts],
    ["Regular", "Large", "Sharing"]
  ),

  group(
    "mod_dessert_toppings",
    "Dessert Toppings",
    "addon",
    [SEC.desserts],
    [
      "Hot fudge",
      "Caramel drizzle",
      "Chopped nuts",
      "Sprinkles",
      "Whipped cream",
      "Fresh berries",
    ]
  ),

  group(
    "mod_ice_cream",
    "Add Ice Cream",
    "extra",
    [SEC.desserts],
    ["Vanilla scoop", "Chocolate scoop", "Strawberry scoop"]
  ),

  /* Starters */
  group(
    "mod_dips",
    "Dips",
    "addon",
    [SEC.starters,SEC.fries],
    ["Ketchup", "Cheese dip", "Mint mayo", "Honey mustard"]
  ),

  /* Shared across sections */
  group(
    "mod_sauce",
    "Add-on Sauces",
    "addon",
    [SEC.pizza, SEC.burgers, SEC.starters],
    ["Garlic mayo", "Peri peri", "Chipotle", "Smoky BBQ"]
  ),

  group(
    "mod_cheese",
    "Extra Cheese",
    "extra",
    [SEC.pizza, SEC.burgers],
    ["Mozzarella", "Cheddar", "Parmesan"]
  ),

  /* Pasta */
group(
  "mod_pasta_addons",
  "Pasta Add-ons",
  "addon",
  [SEC.pasta],
  [
    { name: "Grilled chicken", isVeg: false },
    "Mushrooms",
    "Broccoli",
    "Olives",
    "Garlic bread",
  ]
),

group(
  "mod_pasta_cheese",
  "Extra Cheese",
  "extra",
  [SEC.pasta],
  [
    "Mozzarella",
    "Cheddar",
    "Parmesan",
  ]
),

  /* Sandwiches */
  group(
    "mod_bread",
    "Bread",
    "base",
    [SEC.Sandwiches],
    ["White", "Brown", "Multigrain", "Sourdough"]
  ),

  group(
    "mod_serve_style",
    "Serve Style",
    "preference",
    [SEC.Sandwiches],
    ["Grilled", "Toasted", "Cold"]
  ),

  group(
    "mod_sandwich_addons",
    "Sandwich Add-ons",
    "addon",
    [SEC.Sandwiches],
    [
      "Extra veggies",
      "Cheese slice",
      { name: "Egg", isVeg: false },
      { name: "Grilled chicken", isVeg: false },
      "Grilled paneer",
    ]
  ),

  /* Fries */
  // group(
  //   "mod_fries_size",
  //   "Fries Size",
  //   "base",
  //   [SEC.fries],
  //   ["Regular", "Medium", "Large"]
  // ),

  group(
    "mod_fries_seasoning",
    "Fries Seasoning",
    "preference",
    [SEC.fries],
    ["Salted", "Peri peri", "Cheesy", "Masala"]
  ),

  /* Starters */

group(
  "mod_manchurian_portion",
  "Manchurian Portion",
  "base",
  [SEC.starters],
  ["Half", "Full"]
),

];
