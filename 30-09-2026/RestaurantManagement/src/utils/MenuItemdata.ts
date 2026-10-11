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

/**
 * A modifier group attached to a menu item.
 *
 * - type "preference" + selection "single"  -> a VARIANT group (Size, Portion,
 *   Quantity ...). Every option carries its FULL price. The customer picks one,
 *   and that option's price replaces the item's starting price.
 *   Every item has at least one of these.
 * - type "addon"                            -> optional extras. Option prices
 *   are ADDED on top of the selected variant price.
 */
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
  /** starting price in INR: the cheapest preference option */
  price: number;
  isVeg: boolean; // false = non-veg (egg counts as non-veg)
  image: string;
  description: string;
  status: Status;
  modifiers: ItemModifierGroup[];
  createdAt: string;
  updatedAt: string;
}

export const isVariantGroup = (g: ItemModifierGroup) =>
  g.type === "preference" && g.selection === "single";

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

/* ---------- preference (variant) groups: full prices, set per item ---------- */
const variant = (groupId: string, groupName: string, options: Record<string, number>) =>
  group(groupId, groupName, "preference", "single", options);

const drinkSize = (small: number, medium: number, large: number) =>
  variant("mod_drink_size", "Size", { Small: small, Medium: medium, Large: large });
const pizzaSize = (small: number, medium: number, large: number) =>
  variant("mod_size", "Size", { Small: small, Medium: medium, Large: large });
const regularLarge = (regular: number, large: number) =>
  variant("mod_size_rl", "Size", { Regular: regular, Large: large });
const portion = (half: number, full: number) =>
  variant("mod_portion", "Portion", { Half: half, Full: full });
const eggCount = (two: number, three: number) =>
  variant("mod_egg_count", "Eggs", { "2 Eggs": two, "3 Eggs": three });
const pieces = (two: number, four: number) =>
  variant("mod_pieces", "Quantity", { "2 Pieces": two, "4 Pieces": four });
const single = (one: number, two: number) =>
  variant("mod_single_double", "Quantity", { "1 Piece": one, "2 Pieces": two });

/* ---------- add-on groups (prices are added on top) ---------- */
const drinkExtras = () =>
  group("mod_drink_extras", "Extras", "addon", "multiple", {
    "Extra Shot": 40,
    "Whipped Cream": 25,
    "Flavour Syrup": 30,
  });
const pizzaToppings = () =>
  group("mod_toppings", "Extra Toppings", "addon", "multiple", {
    "Extra Cheese": 60,
    Olives: 40,
    Jalapeno: 30,
    Mushroom: 40,
  });
const nonVegToppings = () =>
  group("mod_nv_toppings", "Extra Toppings", "addon", "multiple", {
    "Extra Cheese": 60,
    "Chicken Tikka": 80,
    Pepperoni: 90,
  });
const scoop = () =>
  group("mod_scoop", "Ice Cream Scoop", "addon", "multiple", {
    Vanilla: 50,
    Chocolate: 50,
    Butterscotch: 60,
  });
const dessertSauce = () =>
  group("mod_sauce", "Sauce", "addon", "multiple", {
    "Chocolate Sauce": 30,
    "Caramel Sauce": 30,
    "Nuts Topping": 40,
  });
const burgerAddons = () =>
  group("mod_burger_addons", "Add-ons", "addon", "multiple", {
    "Cheese Slice": 30,
    "Fries Combo": 90,
    "Extra Sauce": 15,
  });
const breakfastExtras = () =>
  group("mod_breakfast_extras", "Extras", "addon", "multiple", {
    "Extra Butter": 20,
    "Extra Chutney": 15,
    "Cheese Topping": 40,
  });
const toastUpgrade = () =>
  group("mod_toast_upgrade", "Bread Upgrade", "addon", "single", {
    "Brown Bread": 10,
    "Multigrain Bread": 20,
  });
const indianBreads = () =>
  group("mod_indian_breads", "Breads", "addon", "multiple", {
    "Butter Naan": 60,
    "Tandoori Roti": 30,
    "Laccha Paratha": 50,
  });
const comboAddons = () =>
  group("mod_combo_addons", "Add-ons", "addon", "multiple", {
    "Extra Cheese": 30,
    "Extra Sauce": 15,
    "Fries Combo": 90,
  });

let n = 0;
/**
 * Every item must have at least one preference (variant) group; its starting
 * price is the cheapest option, so price and options can never disagree.
 */
const item = (
  name: string,
  isVeg: boolean,
  description: string,
  modifiers: ItemModifierGroup[],
  status: Status = "Active",
): MenuItem => {
  const v = modifiers.find(isVariantGroup);
  if (!v) throw new Error(`Menu item "${name}" needs a preference (variant) group`);
  n += 1;
  return {
    id: `itm_${String(n).padStart(3, "0")}`,
    name,
    price: Math.min(...v.options.map((o) => o.price)),
    isVeg,
    image: "",
    description,
    status,
    modifiers,
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  };
};

/**
 * Ids run in the order below (itm_001 ... itm_077):
 *   Beverages        1-12
 *   Breakfast       13-24
 *   Lunch           25-38
 *   Snacks & Pizza  39-54
 *   Desserts        55-66
 *   Late Night      67-77
 * Keep this order when adding items, because the menu seed lists ids by number.
 */
export const menuItemSeed: MenuItem[] = [
  /* ==================== BEVERAGES (1-12) ==================== */
  item("Fresh Lime Soda", true, "Refreshing lime soda with a balance of sweet and tangy.", [drinkSize(70, 90, 110)]),
  item("Masala Chaas", true, "Spiced buttermilk with roasted cumin and mint.", [drinkSize(50, 70, 90)]),
  item("Mango Lassi", true, "Thick, chilled yoghurt drink blended with ripe mango.", [drinkSize(110, 140, 170)]),
  item("Cold Coffee", true, "Iced coffee blended with milk and a scoop of cream.", [drinkSize(130, 160, 190), drinkExtras()]),
  item("Virgin Mojito", true, "Mint, lime and soda over crushed ice.", [drinkSize(120, 150, 180)]),
  item("Chocolate Milkshake", true, "Rich chocolate shake topped with whipped cream.", [drinkSize(150, 180, 210), dessertSauce()]),
  item("Masala Chai", true, "Strong tea simmered with ginger, cardamom and milk.", [drinkSize(30, 45, 60)]),
  item("Filter Coffee", true, "South Indian decoction coffee with frothy hot milk.", [drinkSize(40, 60, 80)]),
  item("Fresh Orange Juice", true, "Freshly squeezed oranges, served chilled.", [drinkSize(90, 120, 150)]),
  item("Egg Nog Shake", false, "Creamy milkshake blended with egg, nutmeg and vanilla.", [drinkSize(160, 190, 220)]),
  item("Chicken Bone Broth", false, "Slow-simmered chicken broth with herbs, served hot.", [portion(140, 220)]),
  item("Vietnamese Egg Coffee", false, "Strong coffee topped with a whipped egg-yolk cream.", [drinkSize(170, 200, 230)]),

  /* ==================== BREAKFAST (13-24) ==================== */
  item("Masala Dosa", true, "Crisp rice crepe filled with spiced potato, with sambar and chutneys.", [
    variant("mod_dosa_style", "Style", { Regular: 120, "Ghee Roast": 150, Cheese: 160 }),
    breakfastExtras(),
  ]),
  item("Idli Sambar", true, "Steamed rice cakes served with sambar and coconut chutney.", [pieces(80, 140), breakfastExtras()]),
  item("Medu Vada", true, "Crisp lentil doughnuts with sambar and chutney.", [pieces(90, 160), breakfastExtras()]),
  item("Poha", true, "Flattened rice cooked with onion, peanuts and curry leaves.", [regularLarge(80, 120)]),
  item("Aloo Paratha", true, "Whole-wheat flatbread stuffed with spiced potato, served with curd.", [
    variant("mod_paratha_qty", "Quantity", { "1 Paratha": 90, "2 Parathas": 160 }),
    breakfastExtras(),
  ]),
  item("Chole Bhature", true, "Spiced chickpea curry with fluffy fried bread.", [
    variant("mod_bhature_qty", "Quantity", { "1 Bhatura": 130, "2 Bhature": 180 }),
  ]),
  item("Masala Omelette", false, "Omelette with onion, tomato, chilli and coriander, served with toast.", [eggCount(90, 120), toastUpgrade()]),
  item("Egg Bhurji Pav", false, "Spicy scrambled eggs served with buttered pav.", [eggCount(110, 140)]),
  item("Boiled Eggs & Toast", false, "Boiled eggs with buttered toast, salt and pepper.", [eggCount(80, 110), toastUpgrade()]),
  item("Chicken Sausage Breakfast Plate", false, "Grilled chicken sausages, fried egg, hash brown and toast.", [
    variant("mod_sausage_qty", "Sausages", { "2 Sausages": 240, "4 Sausages": 340 }),
    toastUpgrade(),
  ]),
  item("Chicken Keema Paratha", false, "Flatbread stuffed with spiced minced chicken, served with curd.", [
    variant("mod_keema_qty", "Quantity", { "1 Paratha": 160, "2 Parathas": 300 }),
  ]),
  item("Pancakes with Maple Syrup", true, "Fluffy pancakes with butter and maple syrup.", [
    variant("mod_pancake_qty", "Quantity", { "3 Pancakes": 150, "5 Pancakes": 220 }),
    dessertSauce(),
  ]),

  /* ==================== LUNCH (25-38) ==================== */
  item("Paneer Butter Masala", true, "Paneer in a rich tomato-butter gravy.", [portion(190, 320), indianBreads()]),
  item("Dal Makhani", true, "Slow-cooked black lentils finished with cream and butter.", [portion(160, 260), indianBreads()]),
  item("Veg Biryani", true, "Fragrant basmati rice cooked with vegetables and saffron.", [portion(170, 260)]),
  item("Rajma Chawal", true, "Kidney bean curry served with steamed rice.", [portion(120, 180)]),
  item("Veg Thali", true, "Two sabzis, dal, rice, roti, salad, papad and sweet.", [
    variant("mod_thali_size", "Thali", { Mini: 200, Regular: 260, Deluxe: 340 }),
  ]),
  item("Palak Paneer", true, "Cottage cheese in a smooth spiced spinach gravy.", [portion(180, 300), indianBreads()]),
  item("Butter Chicken", false, "Tandoori chicken simmered in a creamy tomato gravy.", [portion(230, 380), indianBreads()]),
  item("Chicken Biryani", false, "Dum-cooked basmati rice layered with spiced chicken.", [portion(220, 350)]),
  item("Mutton Rogan Josh", false, "Kashmiri-style slow-cooked mutton curry.", [portion(300, 480), indianBreads()]),
  item("Egg Curry", false, "Boiled eggs simmered in an onion-tomato masala.", [portion(150, 240), indianBreads()]),
  item("Fish Curry Meal", false, "Coastal-style fish curry served with steamed rice.", [portion(240, 340)]),
  item("Chicken Thali", false, "Chicken curry, dal, rice, roti, salad, papad and sweet.", [
    variant("mod_thali_size", "Thali", { Mini: 250, Regular: 320, Deluxe: 420 }),
  ]),
  item("Dal Tadka", true, "Yellow lentils tempered with garlic, cumin and red chilli.", [portion(130, 210), indianBreads()]),
  item("Butter Naan", true, "Soft tandoor-baked flatbread brushed with butter.", [single(60, 110)]),

  /* ==================== SNACKS & PIZZA (39-54) ==================== */
  item("Paneer Tikka", true, "Cottage cheese marinated in spices and grilled in the tandoor.", [portion(180, 300)]),
  item("Veg Spring Rolls", true, "Crispy rolls stuffed with seasoned vegetables.", [portion(120, 200)]),
  item("Hara Bhara Kabab", true, "Spinach and green pea patties, shallow fried.", [portion(140, 240)]),
  item("Cheese Garlic Bread", true, "Toasted bread with garlic butter and melted mozzarella.", [
    variant("mod_garlic_bread_qty", "Quantity", { "4 Pieces": 150, "8 Pieces": 270 }),
  ]),
  item("French Fries", true, "Crisp golden fries with a peri-peri dusting.", [portion(90, 150)]),
  item("Chicken Tikka", false, "Boneless chicken marinated in yoghurt and spices, grilled.", [portion(220, 380)]),
  item("Fish Fingers", false, "Crumb-coated fish strips with tartar dip.", [portion(240, 380)]),
  item("Chicken Wings", false, "Crispy wings tossed in a spicy buffalo glaze.", [portion(230, 400)]),
  item("Farm Villa Pizza", true, "Loaded with capsicum, onion, sweet corn and mushrooms.", [pizzaSize(249, 449, 599), pizzaToppings()]),
  item("Margherita Pizza", true, "Classic pizza with tomato sauce and mozzarella.", [pizzaSize(199, 349, 499), pizzaToppings()]),
  item("Chicken Tikka Pizza", false, "Wood-fired pizza topped with smoky chicken tikka.", [pizzaSize(299, 499, 649), nonVegToppings()]),
  item("Pepperoni Pizza", false, "Mozzarella and spicy pepperoni on a crisp base.", [pizzaSize(329, 529, 699), nonVegToppings()]),
  item("Aloo Tikki Burger", true, "Crispy potato patty with mint mayo and fresh veggies.", [
    variant("mod_burger_patty", "Patty", { "Single Patty": 129, "Double Patty": 199 }),
    burgerAddons(),
  ]),
  item("Chicken Zinger Burger", false, "Crunchy fried chicken fillet with spicy mayo.", [
    variant("mod_burger_patty", "Patty", { "Single Patty": 189, "Double Patty": 279 }),
    burgerAddons(),
  ]),
  item("Veg Club Sandwich", true, "Triple-decker toasted sandwich with veggies, cheese and mint chutney.", [portion(110, 170), comboAddons()]),
  item("Chicken Club Sandwich", false, "Triple-decker toasted sandwich with grilled chicken, egg and lettuce.", [portion(140, 220), comboAddons()]),

  /* ==================== DESSERTS (55-66) ==================== */
  item("Gulab Jamun", true, "Soft milk dumplings soaked in rose-cardamom syrup.", [pieces(80, 150)]),
  item("Chocolate Brownie", true, "Warm fudgy brownie with a gooey centre.", [single(150, 280), scoop(), dessertSauce()]),
  item("Sizzling Brownie", true, "Brownie served on a hot plate with ice cream and sauce.", [
    variant("mod_sizzler_serving", "Serving", { Regular: 240, Sharing: 420 }),
    scoop(),
    dessertSauce(),
  ]),
  item("Rasmalai", true, "Soft cottage-cheese discs in saffron milk.", [pieces(110, 200)]),
  item("Vanilla Ice Cream", true, "Classic vanilla ice cream.", [
    variant("mod_scoops_count", "Scoops", { "1 Scoop": 60, "2 Scoops": 110, "3 Scoops": 150 }),
    dessertSauce(),
  ], "Inactive"),
  item("Kulfi Falooda", true, "Pistachio kulfi with vermicelli, basil seeds and rose syrup.", [regularLarge(140, 200)]),
  item("Gajar Halwa", true, "Slow-cooked carrot pudding with milk, ghee and nuts.", [portion(100, 170)]),
  item("New York Cheesecake", true, "Baked cream-cheese cake on a biscuit base.", [
    variant("mod_cheesecake_qty", "Quantity", { "1 Slice": 260, "2 Slices": 480 }),
    dessertSauce(),
  ]),
  item("Tiramisu", false, "Coffee-soaked sponge layered with mascarpone and egg cream.", [
    variant("mod_tiramisu_serving", "Serving", { "Single Cup": 260, "Sharing Box": 480 }),
  ]),
  item("Crème Brûlée", false, "Egg-custard dessert with a caramelised sugar crust.", [
    variant("mod_brulee_qty", "Quantity", { "1 Ramekin": 230, "2 Ramekins": 430 }),
  ]),
  item("Caramel Custard Pudding", false, "Silky baked egg custard under a golden caramel.", [single(140, 260)]),
  item("Egg Tart", false, "Flaky pastry shell filled with a warm egg custard.", [single(70, 130)]),

  /* ==================== LATE NIGHT BITES (67-77) ==================== */
  item("Maggi Masala Noodles", true, "Classic instant noodles cooked with onion, tomato and spices.", [
    variant("mod_maggi_style", "Style", { Masala: 90, Cheese: 120, "Veg Loaded": 130 }),
  ]),
  item("Veg Hakka Noodles", true, "Wok-tossed noodles with crunchy vegetables and soy.", [portion(140, 220)]),
  item("Chicken Hakka Noodles", false, "Wok-tossed noodles with shredded chicken, egg and vegetables.", [portion(170, 270)]),
  item("Egg Roll", false, "Paratha wrapped around a spiced egg omelette, onion and chutney.", [
    variant("mod_roll_egg", "Eggs", { "Single Egg": 100, "Double Egg": 130 }),
    comboAddons(),
  ]),
  item("Chicken Kathi Roll", false, "Grilled chicken tikka rolled in a flaky paratha with onion and mint.", [
    variant("mod_roll_chicken", "Filling", { Regular: 160, "Double Chicken": 220 }),
    comboAddons(),
  ]),
  item("Paneer Kathi Roll", true, "Spiced paneer tikka rolled in a flaky paratha with onion and mint.", [
    variant("mod_roll_paneer", "Filling", { Regular: 150, "Double Paneer": 210 }),
    comboAddons(),
  ]),
  item("Nachos with Cheese Dip", true, "Corn chips with warm cheese dip, salsa and jalapeno.", [regularLarge(180, 290)]),
  item("Grilled Cheese Sandwich", true, "Toasted sandwich oozing with three kinds of cheese.", [portion(90, 130), comboAddons()]),
  item("Chicken Popcorn", false, "Bite-sized crispy chicken with a spicy dip.", [portion(150, 260)]),
  item("Egg Fried Rice", false, "Wok-fried rice with scrambled egg, spring onion and soy.", [portion(130, 210)]),
  item("Veg Fried Rice", true, "Wok-fried rice with seasonal vegetables and soy.", [portion(120, 190)]),
];