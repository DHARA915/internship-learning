import type { Status } from "./Modifierdata";

export const CURRENCY = "INR";

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(n);

/** one option of a modifier group, with the price set for this item */
export interface ItemModifierOption {
  id: string;
  name: string;
  price: number;
}

/** a modifier group attached to a menu item */
export interface ItemModifierGroup {
  groupId: string;
  groupName: string;
  type: string; // "preference" | "addon"
  selection: "single" | "multiple";
  options: ItemModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  isVeg: boolean;
  image: string;
  description: string;
  status: Status;
  modifiers: ItemModifierGroup[];
  createdAt: string;
  updatedAt: string;
}

/* ---------- seed helpers ---------- */
const group = (
  groupId: string,
  groupName: string,
  type: string,
  selection: "single" | "multiple",
  options: Record<string, number>,
): ItemModifierGroup => ({
  groupId,
  groupName,
  type,
  selection,
  options: Object.entries(options).map(([name, price]) => ({
    id: `opt_${groupId.replace(/^mod_/, "")}_${name.toLowerCase().replace(/\s+/g, "_")}`,
    name,
    price,
  })),
});

/* ---------- reusable modifier groups (ids should match your Modifiers page) ---------- */
const drinkSize = () =>
  group("mod_drink_size", "Size", "preference", "single", { Small: 0, Medium: 20, Large: 40 });
const drinkExtras = () =>
  group("mod_drink_extras", "Extras", "addon", "multiple", {
    "Extra Shot": 30,
    "Whipped Cream": 20,
    "Flavour Syrup": 15,
  });
const pizzaSize = () =>
  group("mod_size", "Size", "preference", "single", { Small: 0, Medium: 100, Large: 200 });
const pizzaToppings = () =>
  group("mod_toppings", "Extra Toppings", "addon", "multiple", {
    "Extra Cheese": 40,
    Olives: 25,
    Jalapeno: 20,
    Mushroom: 30,
  });
const nonVegToppings = () =>
  group("mod_nv_toppings", "Extra Toppings", "addon", "multiple", {
    "Extra Cheese": 40,
    "Chicken Tikka": 60,
    Pepperoni: 70,
  });
const portion = () =>
  group("mod_portion", "Portion", "preference", "single", { Half: 0, Full: 120 });
const spice = () =>
  group("mod_spice", "Spice Level", "preference", "single", { Mild: 0, Medium: 0, Hot: 0 });
const scoop = () =>
  group("mod_scoop", "Ice Cream Scoop", "addon", "multiple", {
    Vanilla: 40,
    Chocolate: 40,
    Butterscotch: 45,
  });
const dessertSauce = () =>
  group("mod_sauce", "Sauce", "addon", "multiple", {
    "Chocolate Sauce": 25,
    "Caramel Sauce": 25,
    "Nuts Topping": 30,
  });
const burgerAddons = () =>
  group("mod_burger_addons", "Add-ons", "addon", "multiple", {
    "Extra Patty": 70,
    "Cheese Slice": 25,
    "Fries Combo": 80,
  });

let n = 0;
const item = (
  name: string,
  isVeg: boolean,
  description: string,
  modifiers: ItemModifierGroup[] = [],
  status: Status = "Active",
): MenuItem => {
  n += 1;
  return {
    id: `itm_${String(n).padStart(3, "0")}`,
    name,
    isVeg,
    image: "",
    description,
    status,
    modifiers,
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  };
};

export const menuItemSeed: MenuItem[] = [
  /* ==================== DRINKS ==================== */
  item("Fresh Lime Soda", true, "Refreshing lime soda with a balance of sweet and tangy.", [drinkSize(), drinkExtras()]),
  item("Masala Chaas", true, "Spiced buttermilk with roasted cumin and mint.", [drinkSize()]),
  item("Mango Lassi", true, "Thick, chilled yoghurt drink blended with ripe mango.", [drinkSize(), drinkExtras()]),
  item("Cold Coffee", true, "Iced coffee blended with milk and a scoop of cream.", [drinkSize(), drinkExtras()]),
  item("Virgin Mojito", true, "Mint, lime and soda over crushed ice.", [drinkSize()]),
  item("Chocolate Milkshake", true, "Rich chocolate shake topped with whipped cream.", [drinkSize(), dessertSauce()]),
  item("Egg Nog Shake", false, "Creamy milkshake blended with egg, nutmeg and vanilla.", [drinkSize()]),
  item("Chicken Bone Broth", false, "Slow-simmered chicken broth with herbs, served hot.", [portion()]),

  /* ==================== DESSERTS ==================== */
  item("Gulab Jamun", true, "Soft milk dumplings soaked in rose-cardamom syrup.", [portion()]),
  item("Chocolate Brownie", true, "Warm fudgy brownie with a gooey centre.", [scoop(), dessertSauce()]),
  item("Sizzling Brownie", true, "Brownie served on a hot plate with ice cream and sauce.", [scoop(), dessertSauce()]),
  item("Rasmalai", true, "Soft cottage-cheese discs in saffron milk.", [portion()]),
  item("Tiramisu", false, "Coffee-soaked sponge layered with mascarpone and egg cream.", []),
  item("Crème Brûlée", false, "Egg-custard dessert with a caramelised sugar crust.", []),
  item("Vanilla Ice Cream", true, "Classic vanilla ice cream, two scoops.", [dessertSauce()], "Inactive"),

  /* ==================== STARTERS ==================== */
  item("Paneer Tikka", true, "Cottage cheese marinated in spices and grilled in the tandoor.", [portion(), spice()]),
  item("Veg Spring Rolls", true, "Crispy rolls stuffed with seasoned vegetables.", [portion()]),
  item("Chicken Tikka", false, "Boneless chicken marinated in yoghurt and spices, grilled.", [portion(), spice()]),
  item("Fish Fingers", false, "Crumb-coated fish strips with tartar dip.", [portion()]),

  /* ==================== PIZZA & BURGERS ==================== */
  item("Farm Villa Pizza", true, "Loaded with capsicum, onion, sweet corn and mushrooms.", [pizzaSize(), pizzaToppings()]),
  item("Margherita Pizza", true, "Classic pizza with tomato sauce and mozzarella.", [pizzaSize(), pizzaToppings()]),
  item("Chicken Tikka Pizza", false, "Wood-fired pizza topped with smoky chicken tikka.", [pizzaSize(), nonVegToppings()]),
  item("Pepperoni Pizza", false, "Mozzarella and spicy pepperoni on a crisp base.", [pizzaSize(), nonVegToppings()]),
  item("Aloo Tikki Burger", true, "Crispy potato patty with mint mayo and fresh veggies.", [burgerAddons()]),
  item("Chicken Zinger Burger", false, "Crunchy fried chicken fillet with spicy mayo.", [burgerAddons()]),

  /* ==================== MAIN COURSE ==================== */
  item("Paneer Butter Masala", true, "Paneer in a rich tomato-butter gravy.", [portion(), spice()]),
  item("Dal Makhani", true, "Slow-cooked black lentils finished with cream and butter.", [portion()]),
  item("Veg Biryani", true, "Fragrant basmati rice cooked with vegetables and saffron.", [portion(), spice()]),
  item("Butter Chicken", false, "Tandoori chicken simmered in a creamy tomato gravy.", [portion(), spice()]),
  item("Chicken Biryani", false, "Dum-cooked basmati rice layered with spiced chicken.", [portion(), spice()]),
  item("Mutton Rogan Josh", false, "Kashmiri-style slow-cooked mutton curry.", [portion(), spice()]),
  item("Egg Curry", false, "Boiled eggs simmered in an onion-tomato masala.", [portion(), spice()]),
];