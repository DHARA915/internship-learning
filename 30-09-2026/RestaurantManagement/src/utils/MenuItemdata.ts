
import type { ItemModifierPrice, Status } from "./Modifierdata";

export const CURRENCY = "INR";

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(n);

export interface MenuItem {
  id: number;
  name: string;
  menuSectionId: number;
  menuName: string;
  isVeg: boolean;
  image: string;
  description: string;
  price: number;
  status: Status;
  modifierPrices: ItemModifierPrice[];
  createdAt: string;
  updatedAt: string;
}

const prices = (
  groupId: string,
  entries: Record<string, number>
): ItemModifierPrice[] =>
  Object.entries(entries).map(([slug, price]) => ({
    groupId,
    optionId: `${groupId}_${slug}`,
    price,
}));

const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`;

export const menuItemSeed: MenuItem[] = [
  /* ==================== DRINKS ==================== */

  {
    id: 1,
    name: "Fresh Lime Soda",
    menuSectionId: 1,
    menuName: "Drinks",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoEyrNI0Z6S0o35izA4jLRWsjcfXahrR1g7aB1OmpePA&s=10",
    description: "Refreshing lime soda with a perfect balance of sweet and tangy flavors.",
    price: 80,
    status: "Active",
    modifierPrices: [
      ...prices("mod_drink_size", {
        small: 0,
        medium: 20,
        large: 40,
      }),
      ...prices("mod_drink_extras", {
        extra_shot: 30,
        whipped_cream: 20,
        flavour_syrup: 15,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 2,
    name: "Mango Mojito",
    menuSectionId: 1,
    menuName: "Drinks",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2qo3CVErer3I7iHswD79mCQGF1caOAQfCz7qPmR8GYw&s=10",
    description: "Refreshing mango drink blended with mint, lime, and sparkling soda.",
    price: 140,
    status: "Active",
    modifierPrices: [
      ...prices("mod_drink_size", {
        small: 0,
        medium: 30,
        large: 50,
      }),
      ...prices("mod_drink_extras", {
        extra_shot: 30,
        whipped_cream: 20,
        flavour_syrup: 15,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 3,
    name: "Cold Coffee",
    menuSectionId: 1,
    menuName: "Drinks",
    isVeg: true,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmc1MVjD0Tdct-QuVSLX_WXaieGF3_vZ0pOZfgazInKw&s=10",
    description: "Creamy chilled coffee blended with milk and a hint of sweetness.",
    price: 130,
    status: "Active",
    modifierPrices: [
      ...prices("mod_drink_size", {
        small: 0,
        medium: 30,
        large: 50,
      }),
      ...prices("mod_drink_extras", {
        extra_shot: 40,
        whipped_cream: 25,
        flavour_syrup: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 4,
    name: "Chocolate Shake",
    menuSectionId: 1,
    menuName: "Drinks",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu63yiiRcbiGyvZC7S946Z0h3cn6QYnYFlhjdgpDPJUQ&s=10",
    description: "Rich and creamy chocolate milkshake topped with chocolate sauce.",
    price: 160,
    status: "Active",
    modifierPrices: [
      ...prices("mod_drink_size", {
        small: 0,
        medium: 30,
        large: 60,
      }),
      ...prices("mod_drink_extras", {
        extra_shot: 40,
        whipped_cream: 25,
        flavour_syrup: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 5,
    name: "Masala Lemonade",
    menuSectionId: 1,
    menuName: "Drinks",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmJBKVrKcNyBON8XEKf3iXn6JFe-tXILEEUJdFXQtc6Q&s=10",
    description: "Zesty lemonade infused with aromatic Indian spices.",
    price: 90,
    status: "Active",
    modifierPrices: [
      ...prices("mod_drink_size", {
        small: 0,
        medium: 20,
        large: 40,
      }),
      ...prices("mod_drink_extras", {
        extra_shot: 30,
        whipped_cream: 20,
        flavour_syrup: 15,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  /* ==================== PIZZA ==================== */

  {
    id: 6,
    name: "Margherita Pizza",
    menuSectionId: 2,
    menuName: "Pizza",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6oudypi0Mp1JESyCGWBM4BRpa9fM3dlHhJeDFr4iR7g&s=10",
    description: "Classic pizza topped with tomato sauce, mozzarella, and fresh basil.",
    price: 220,
    status: "Active",
    modifierPrices: [
      ...prices("mod_base", {
        regular: 0,
        medium: 60,
        large: 120,
      }),
      ...prices("mod_crust", {
        hand_tossed: 0,
        thin_crust: 20,
        cheese_burst: 70,
        whole_wheat: 20,
      }),
      ...prices("mod_pizza_toppings", {
        olives: 30,
        jalapenos: 25,
        mushrooms: 30,
        onions: 20,
        bell_peppers: 20,
        sweet_corn: 25,
        paneer: 50,
      }),
      ...prices("mod_seasoning", {
        oregano: 10,
        chilli_flakes: 10,
        garlic_powder: 10,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 7,
    name: "Farmhouse Pizza",
    menuSectionId: 2,
    menuName: "Pizza",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLcpgYa5hjhiUeOtGmGHmgSpo6fOaUrbqsGG-GwqdGeA&s=10",
    description: "Loaded with onions, bell peppers, mushrooms, and sweet corn.",
    price: 280,
    status: "Active",
    modifierPrices: [
      ...prices("mod_base", {
        regular: 0,
        medium: 60,
        large: 120,
      }),
      ...prices("mod_crust", {
        hand_tossed: 0,
        thin_crust: 20,
        cheese_burst: 70,
        whole_wheat: 20,
      }),
      ...prices("mod_pizza_toppings", {
        olives: 30,
        jalapenos: 25,
        mushrooms: 30,
        onions: 20,
        bell_peppers: 20,
        sweet_corn: 25,
        paneer: 50,
      }),
      ...prices("mod_seasoning", {
        oregano: 10,
        chilli_flakes: 10,
        garlic_powder: 10,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 8,
    name: "Paneer Tikka Pizza",
    menuSectionId: 2,
    menuName: "Pizza",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlpnTSS6Y1zB4spMvfS1b9NOePQume9TTkhK40C5gz3A&s=10",
    description: "Spicy paneer tikka with onions, peppers, and melted mozzarella.",
    price: 320,
    status: "Active",
    modifierPrices: [
      ...prices("mod_base", {
        regular: 0,
        medium: 60,
        large: 120,
      }),
      ...prices("mod_crust", {
        hand_tossed: 0,
        thin_crust: 20,
        cheese_burst: 70,
        whole_wheat: 20,
      }),
      ...prices("mod_pizza_toppings", {
        olives: 30,
        jalapenos: 25,
        mushrooms: 30,
        onions: 20,
        bell_peppers: 20,
        sweet_corn: 25,
        paneer: 50,
      }),
      ...prices("mod_seasoning", {
        oregano: 10,
        chilli_flakes: 10,
        garlic_powder: 10,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 9,
    name: "Chicken Tikka Pizza",
    menuSectionId: 2,
    menuName: "Pizza",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcsVh9cCFVSR6ZOSFKVCRX57MNBis3oULX1LtoswQQ9g&s=10",
    description: "Loaded with juicy chicken tikka, onions, peppers, and cheese.",
    price: 360,
    status: "Active",
    modifierPrices: [
      ...prices("mod_base", {
        regular: 0,
        medium: 60,
        large: 120,
      }),
      ...prices("mod_crust", {
        hand_tossed: 0,
        thin_crust: 20,
        cheese_burst: 70,
        whole_wheat: 20,
      }),
      ...prices("mod_pizza_toppings", {
        olives: 30,
        jalapenos: 25,
        mushrooms: 30,
        onions: 20,
        bell_peppers: 20,
        sweet_corn: 25,
        paneer: 50,
      }),
      ...prices("mod_seasoning", {
        oregano: 10,
        chilli_flakes: 10,
        garlic_powder: 10,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 10,
    name: "BBQ Chicken Pizza",
    menuSectionId: 2,
    menuName: "Pizza",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIA98q7_bZZP39hrEqlmogb2d3JCzc5T7XOhGDypEvw&s=10",
    description: "Smoky BBQ chicken with onions, peppers, and a generous cheese topping.",
    price: 380,
    status: "Active",
    modifierPrices: [
      ...prices("mod_base", {
        regular: 0,
        medium: 60,
        large: 120,
      }),
      ...prices("mod_crust", {
        hand_tossed: 0,
        thin_crust: 20,
        cheese_burst: 70,
        whole_wheat: 20,
      }),
      ...prices("mod_pizza_toppings", {
        olives: 30,
        jalapenos: 25,
        mushrooms: 30,
        onions: 20,
        bell_peppers: 20,
        sweet_corn: 25,
        paneer: 50,
      }),
      ...prices("mod_seasoning", {
        oregano: 10,
        chilli_flakes: 10,
        garlic_powder: 10,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  /* ==================== BURGERS ==================== */

  {
    id: 11,
    name: "Classic Veg Burger",
    menuSectionId: 3,
    menuName: "Burgers",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs2crwXiSeYyWF3b7OjMVJJ_p6q-7X5mD426LOLnIcqA&s=10",
    description: "Crispy vegetable patty with lettuce, tomato, and creamy sauce.",
    price: 160,
    status: "Active",
    modifierPrices: [
      ...prices("mod_patty_count", {
        single: 0,
        double: 60,
        triple: 110,
      }),
      ...prices("mod_patty_type", {
        veg: 0,
        paneer: 40,
      }),
      ...prices("mod_bun", {
        classic: 0,
        brioche: 30,
        multigrain: 20,
        gluten_free: 40,
      }),
      ...prices("mod_burger_addons", {
        cheese_slice: 30,
        jalapenos: 20,
        caramelized_onion: 25,
        pickles: 15,
        crispy_lettuce: 15,
      }),
      ...prices("mod_sauce", {
        garlic_mayo: 15,
        peri_peri: 15,
        chipotle: 20,
        smoky_bbq: 20,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 12,
    name: "Paneer Burger",
    menuSectionId: 3,
    menuName: "Burgers",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS--b5-aLV8UK4HbNxvOwtOnEMxwTNq8RIEud8fNSdzfw&s=10",
    description: "Grilled paneer patty with fresh vegetables and flavorful sauces.",
    price: 190,
    status: "Active",
    modifierPrices: [
      ...prices("mod_patty_count", {
        single: 0,
        double: 60,
        triple: 110,
      }),
      ...prices("mod_patty_type", {
        veg: 0,
        paneer: 40,
      }),
      ...prices("mod_bun", {
        classic: 0,
        brioche: 30,
        multigrain: 20,
        gluten_free: 40,
      }),
      ...prices("mod_burger_addons", {
        cheese_slice: 30,
        jalapenos: 20,
        caramelized_onion: 25,
        pickles: 15,
        crispy_lettuce: 15,
      }),
      ...prices("mod_sauce", {
        garlic_mayo: 15,
        peri_peri: 15,
        chipotle: 20,
        smoky_bbq: 20,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 13,
    name: "Classic Chicken Burger",
    menuSectionId: 3,
    menuName: "Burgers",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqUV5It9RAo8xLDq8bYnEWbKuxEIruSnfPCsUEP4ZTgQ&s=10",
    description: "Juicy chicken patty served with lettuce, tomato, and signature sauce.",
    price: 220,
    status: "Active",
    modifierPrices: [
      ...prices("mod_patty_count", {
        single: 0,
        double: 70,
        triple: 120,
      }),
      ...prices("mod_patty_type", {
        chicken: 0,
        veg: 30,
        paneer: 50,
      }),
      ...prices("mod_bun", {
        classic: 0,
        brioche: 30,
        multigrain: 20,
        gluten_free: 40,
      }),
      ...prices("mod_burger_addons", {
        cheese_slice: 30,
        jalapenos: 20,
        caramelized_onion: 25,
        fried_egg: 40,
        pickles: 15,
        crispy_lettuce: 15,
      }),
      ...prices("mod_sauce", {
        garlic_mayo: 15,
        peri_peri: 15,
        chipotle: 20,
        smoky_bbq: 20,
      }),
      ...prices("mod_cheese", {
        mozzarella: 50,
        cheddar: 60,
        parmesan: 70,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },


{
  id: 14,
  name: "Peri Peri Fried Chicken Burger",
  menuSectionId: 3,
  menuName: "Burgers",
  isVeg: false,
  image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQextX6GdH0DILZXtFTkdMGsJvKPfq2rSuEVzu2ly7mXQ&s=10",
  description:
    "Crispy fried chicken burger tossed in spicy peri peri seasoning, served with fresh vegetables and sauce.",
  price: 290,
  status: "Active",
  modifierPrices: [
    ...prices("mod_patty_count", {
      single: 0,
      double: 70,
      triple: 120,
    }),
    ...prices("mod_bun", {
      classic: 0,
      brioche: 30,
      multigrain: 20,
      gluten_free: 40,
    }),
    ...prices("mod_burger_addons", {
      cheese_slice: 30,
      jalapenos: 20,
      caramelized_onion: 25,
      fried_egg: 40,
      pickles: 15,
      crispy_lettuce: 15,
    }),
    ...prices("mod_sauce", {
      garlic_mayo: 15,
      peri_peri: 15,
      chipotle: 20,
      smoky_bbq: 20,
    }),
    ...prices("mod_cheese", {
      mozzarella: 50,
      cheddar: 60,
      parmesan: 70,
    }),
  ],
  createdAt: "2026-10-03",
  updatedAt: "2026-10-03",
},
{
  id: 15,
  name: "Veg Cheese Burst Burger",
  menuSectionId: 3,
  menuName: "Burgers",
  isVeg: true,
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV30E2UoTd_1CfoECDCRV4K6M6NT9rvR4cj8tdemvBpQ&s=10",
  description:
    "Juicy vegetable patty filled with melted cheese, topped with fresh vegetables and creamy sauce.",
  price: 210,
  status: "Active",
  modifierPrices: [
    ...prices("mod_patty_count", {
      single: 0,
      double: 60,
      triple: 110,
    }),
    ...prices("mod_bun", {
      classic: 0,
      brioche: 30,
      multigrain: 20,
      gluten_free: 40,
    }),
    ...prices("mod_burger_addons", {
      cheese_slice: 30,
      jalapenos: 20,
      caramelized_onion: 25,
      pickles: 15,
      crispy_lettuce: 15,
    }),
    ...prices("mod_sauce", {
      garlic_mayo: 15,
      peri_peri: 15,
      chipotle: 20,
      smoky_bbq: 20,
    }),
    ...prices("mod_cheese", {
      mozzarella: 50,
      cheddar: 60,
      parmesan: 70,
    }),
  ],
  createdAt: "2026-10-03",
  updatedAt: "2026-10-03",
},


  /* ==================== DESSERTS ==================== */

  {
    id: 16,
    name: "Chocolate Brownie",
    menuSectionId: 4,
    menuName: "Desserts",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN7iQoh7Ez8MjOzZNPjX5F8mk8hcAiXQNtllt4l3evrg&s=10",
    description: "Warm and fudgy chocolate brownie served with rich chocolate sauce.",
    price: 140,
    status: "Active",
    modifierPrices: [
      ...prices("mod_portion", {
        regular: 0,
        large: 40,
        sharing: 90,
      }),
      ...prices("mod_dessert_toppings", {
        hot_fudge: 20,
        caramel_drizzle: 20,
        chopped_nuts: 25,
        sprinkles: 15,
        whipped_cream: 20,
        fresh_berries: 40,
      }),
      ...prices("mod_ice_cream", {
        vanilla_scoop: 50,
        chocolate_scoop: 50,
        strawberry_scoop: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 17,
    name: "Vanilla Ice Cream",
    menuSectionId: 4,
    menuName: "Desserts",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK4EZ4RbjeVeAKK6D9a8gdek6BJdUWMxsyJdpwwI72dw&s=10",
    description: "Smooth and creamy classic vanilla ice cream.",
    price: 100,
    status: "Active",
    modifierPrices: [
      ...prices("mod_portion", {
        regular: 0,
        large: 40,
        sharing: 80,
      }),
      ...prices("mod_dessert_toppings", {
        hot_fudge: 20,
        caramel_drizzle: 20,
        chopped_nuts: 25,
        sprinkles: 15,
        whipped_cream: 20,
        fresh_berries: 40,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 18,
    name: "Chocolate lava cake",
    menuSectionId: 4,
    menuName: "Desserts",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRKRiut_bmO22NID1p5V1KOvogZdp8-5Wg3PUIDFizkg&s=10",
    description: "Warm chocolate cake with a rich molten chocolate center.",
    price: 180,
    status: "Active",
    modifierPrices: [
      ...prices("mod_portion", {
        regular: 0,
        large: 50,
        sharing: 100,
      }),
      ...prices("mod_dessert_toppings", {
        hot_fudge: 20,
        caramel_drizzle: 20,
        chopped_nuts: 25,
        sprinkles: 15,
        whipped_cream: 20,
        fresh_berries: 40,
      }),
      ...prices("mod_ice_cream", {
        vanilla_scoop: 50,
        chocolate_scoop: 50,
        strawberry_scoop: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 19,
    name: "Caramel cheesecake",
    menuSectionId: 4,
    menuName: "Desserts",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHPly3S6W6ZXfOcgXV0g4WYh1QRUuRzM3HRTM-TKd2cQ&s=10",
    description: "Creamy cheesecake topped with smooth caramel drizzle.",
    price: 190,
    status: "Active",
    modifierPrices: [
      ...prices("mod_portion", {
        regular: 0,
        large: 50,
        sharing: 100,
      }),
      ...prices("mod_dessert_toppings", {
        hot_fudge: 20,
        caramel_drizzle: 20,
        chopped_nuts: 25,
        sprinkles: 15,
        whipped_cream: 20,
        fresh_berries: 40,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 20,
    name: "Strawberry sundae",
    menuSectionId: 4,
    menuName: "Desserts",
    isVeg: true,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKXU-UA7-W-8VcVjQaLgHqeOTCmOZebi4ZzRN5gZ_rtg&s=10",
    description: "Creamy vanilla ice cream topped with fresh strawberries and sauce.",
    price: 160,
    status: "Active",
    modifierPrices: [
      ...prices("mod_portion", {
        regular: 0,
        large: 40,
        sharing: 90,
      }),
      ...prices("mod_dessert_toppings", {
        hot_fudge: 20,
        caramel_drizzle: 20,
        chopped_nuts: 25,
        sprinkles: 15,
        whipped_cream: 20,
        fresh_berries: 40,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  /* ==================== STARTERS ==================== */

{
  id: 21,
  name: "Veg Manchurian",
  menuSectionId: 5,
  menuName: "Starters",
  isVeg: true,
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFKqx5dgJpnn0tIO2oWIu46uCFfI3FsdBtKKugvFdfEQ&s=10",
  description:
    "Crispy vegetable balls tossed in a flavorful Indo-Chinese Manchurian sauce.",
  price: 180,
  status: "Active",
  modifierPrices: [
    ...prices("mod_starter_portion", {
      half: 0,
      full: 60,
    }),
  ],
  createdAt: "2026-10-03",
  updatedAt: "2026-10-03",
},

  {
    id: 22,
    name: "Veg Spring Rolls",
    menuSectionId: 5,
    menuName: "Starters",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo-czXVuRyN5l2N5My6MobKf68lzkkB-yMKnw7R8i8Cg&s=10",
    description: "Crispy rolls filled with seasoned vegetables and served with dip.",
    price: 150,
    status: "Active",
    modifierPrices: [
      ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
      ...prices("mod_sauce", {
        garlic_mayo: 15,
        peri_peri: 15,
        chipotle: 20,
        smoky_bbq: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

{
  id: 23,
  name: "Paneer Chilli Dry",
  menuSectionId: 5,
  menuName: "Starters",
  isVeg: true,
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4FrJYWENX1g852ZItkie9okzppjCrBK8rgOzPD1OTA&s=10",
  description:
    "Crispy paneer tossed with onions, capsicum, green chillies, and flavorful Indo-Chinese spices.",
  price: 210,
  status: "Active",
  modifierPrices: [
    ...prices("mod_starter_portion", {
      half: 0,
      full: 80,
    }),
  ],
  createdAt: "2026-10-03",
  updatedAt: "2026-10-03",
},

  {
    id: 24,
    name: "Chicken Wings",
    menuSectionId: 5,
    menuName: "Starters",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMqolk9cq4yHuxY6RXRkO41A44GlUX38bCgbBaeZQEw&s=10",
    description: "Juicy chicken wings tossed in a flavorful smoky sauce.",
    price: 260,
    status: "Active",
    modifierPrices: [
      ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
      ...prices("mod_sauce", {
        garlic_mayo: 15,
        peri_peri: 15,
        chipotle: 20,
        smoky_bbq: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 25,
    name: "Chicken Nuggets",
    menuSectionId: 5,
    menuName: "Starters",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThI6BFPy2JSV6XCUdC1F0qZeC7AdZ5tazpSUiaRRFXHA&s=10",
    description: "Crispy golden chicken nuggets served with your choice of dip.",
    price: 200,
    status: "Active",
    modifierPrices: [
      ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
      ...prices("mod_sauce", {
        garlic_mayo: 15,
        peri_peri: 15,
        chipotle: 20,
        smoky_bbq: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  /* ==================== PASTA ==================== */

  {
    id: 26,
    name: "Penne Arrabbiata",
    menuSectionId: 6,
    menuName: "Pasta",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2rGXjOOsmiIt_vXhssyPmQNc9G6eFhb6SxSbyNLWHIg&s=10",
    description: "Penne pasta tossed in a spicy tomato and garlic sauce.",
    price: 220,
    status: "Active",
    modifierPrices: [
      ...prices("mod_pasta_type", {
        penne: 0,
        spaghetti: 20,
        fusilli: 20,
        macaroni: 20,
      }),
      ...prices("mod_pasta_sauce", {
        red_arrabbiata: 0,
        white_alfredo: 30,
        pink_rosa: 30,
        basil_pesto: 40,
      }),
      ...prices("mod_pasta_addons", {
        mushrooms: 30,
        broccoli: 25,
        olives: 25,
        garlic_bread: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 27,
    name: "Creamy Alfredo Pasta",
    menuSectionId: 6,
    menuName: "Pasta",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYLt_CAc5IL0th5CBF_da-ic1UnuKUS13QZmgMCHfIhQ&s=10",
    description: "Pasta tossed in a rich and creamy white sauce with herbs.",
    price: 260,
    status: "Active",
    modifierPrices: [
      ...prices("mod_pasta_type", {
        penne: 0,
        spaghetti: 20,
        fusilli: 20,
        macaroni: 20,
      }),
      ...prices("mod_pasta_sauce", {
        red_arrabbiata: 0,
        white_alfredo: 0,
        pink_rosa: 30,
        basil_pesto: 40,
      }),
      ...prices("mod_pasta_addons", {
        mushrooms: 30,
        broccoli: 25,
        olives: 25,
        garlic_bread: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 28,
    name: "Pesto Pasta",
    menuSectionId: 6,
    menuName: "Pasta",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAY2r-60Xl_QNnP4awDq6nBpo3B5t3ZTaWI-7JugJktw&s=10",
    description: "Fresh pasta tossed with aromatic basil pesto and parmesan.",
    price: 280,
    status: "Active",
    modifierPrices: [
      ...prices("mod_pasta_type", {
        penne: 0,
        spaghetti: 20,
        fusilli: 20,
        macaroni: 20,
      }),
      ...prices("mod_pasta_sauce", {
        red_arrabbiata: 0,
        white_alfredo: 30,
        pink_rosa: 30,
        basil_pesto: 0,
      }),
      ...prices("mod_pasta_addons", {
        mushrooms: 30,
        broccoli: 25,
        olives: 25,
        garlic_bread: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 29,
    name: "Chicken Alfredo Pasta",
    menuSectionId: 6,
    menuName: "Pasta",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1dODQwba6ccV9Ptjz2ybTtlt47ipYUpT_kuo6dvcthw&s=10",
    description: "Creamy Alfredo pasta topped with tender grilled chicken.",
    price: 320,
    status: "Active",
    modifierPrices: [
      ...prices("mod_pasta_type", {
        penne: 0,
        spaghetti: 20,
        fusilli: 20,
        macaroni: 20,
      }),
      ...prices("mod_pasta_sauce", {
        red_arrabbiata: 0,
        white_alfredo: 0,
        pink_rosa: 30,
        basil_pesto: 40,
      }),
      ...prices("mod_pasta_addons", {
        grilled_chicken: 80,
        mushrooms: 30,
        broccoli: 25,
        olives: 25,
        garlic_bread: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 30,
    name: "Chicken Arrabbiata",
    menuSectionId: 6,
    menuName: "Pasta",
    isVeg: false,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFU8wB7L8zkCBAuZpm27sHu8ZNydS8Fs6eay7ZF6k-pA&s=10",
    description: "Spicy tomato pasta served with tender grilled chicken.",
    price: 310,
    status: "Active",
    modifierPrices: [
      ...prices("mod_pasta_type", {
        penne: 0,
        spaghetti: 20,
        fusilli: 20,
        macaroni: 20,
      }),
      ...prices("mod_pasta_sauce", {
        red_arrabbiata: 0,
        white_alfredo: 30,
        pink_rosa: 30,
        basil_pesto: 40,
      }),
      ...prices("mod_pasta_addons", {
        grilled_chicken: 80,
        mushrooms: 30,
        broccoli: 25,
        olives: 25,
        garlic_bread: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  /* ==================== SANDWICHES ==================== */

  {
    id: 31,
    name: "Veg Grilled Sandwich",
    menuSectionId: 7,
    menuName: "Sandwiches",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYdKA9h8nzKDL_FvwbhGEzhExTqB73d0P70iUugg6RDQ&s=10",
    description: "Grilled sandwich filled with fresh vegetables and creamy sauce.",
    price: 140,
    status: "Active",
    modifierPrices: [
      ...prices("mod_bread", {
        white: 0,
        brown: 10,
        multigrain: 20,
        sourdough: 30,
      }),
      ...prices("mod_serve_style", {
        grilled: 0,
        toasted: 0,
        cold: 0,
      }),
      ...prices("mod_sandwich_addons", {
        extra_veggies: 20,
        cheese_slice: 30,
        grilled_paneer: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 32,
    name: "Paneer Sandwich",
    menuSectionId: 7,
    menuName: "Sandwiches",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTChnmOo0850G-GiYZovLgXo6JE0fW3OP3cVn1SaWJMkQ&s=10",
    description: "Grilled paneer sandwich with fresh vegetables and flavorful sauces.",
    price: 180,
    status: "Active",
    modifierPrices: [
      ...prices("mod_bread", {
        white: 0,
        brown: 10,
        multigrain: 20,
        sourdough: 30,
      }),
      ...prices("mod_serve_style", {
        grilled: 0,
        toasted: 0,
        cold: 0,
      }),
      ...prices("mod_sandwich_addons", {
        extra_veggies: 20,
        cheese_slice: 30,
        grilled_paneer: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 33,
    name: "Cheese Toastie",
    menuSectionId: 7,
    menuName: "Sandwiches",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ90Iam9UFahns37waI-j8v2wrXwLNu1FFSUuXbZIsa2w&s=10",
    description: "Toasted bread filled with melted cheese and seasoned herbs.",
    price: 160,
    status: "Active",
    modifierPrices: [
      ...prices("mod_bread", {
        white: 0,
        brown: 10,
        multigrain: 20,
        sourdough: 30,
      }),
      ...prices("mod_serve_style", {
        grilled: 0,
        toasted: 0,
        cold: 0,
      }),
      ...prices("mod_sandwich_addons", {
        extra_veggies: 20,
        cheese_slice: 30,
        grilled_paneer: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 34,
    name: "Chicken Club Sandwich",
    menuSectionId: 7,
    menuName: "Sandwiches",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxhBRDZ3YfumQQF_UyaHqNINBy-jnrKBQm8TZcwidCw&s=10",
    description: "Layered sandwich with grilled chicken, lettuce, tomato, and sauces.",
    price: 250,
    status: "Active",
    modifierPrices: [
      ...prices("mod_bread", {
        white: 0,
        brown: 10,
        multigrain: 20,
        sourdough: 30,
      }),
      ...prices("mod_serve_style", {
        grilled: 0,
        toasted: 0,
        cold: 0,
      }),
      ...prices("mod_sandwich_addons", {
        extra_veggies: 20,
        cheese_slice: 30,
        egg: 40,
        grilled_chicken: 80,
        grilled_paneer: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 35,
    name: "Chicken Cheese Sandwich",
    menuSectionId: 7,
    menuName: "Sandwiches",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTumJ82eKHqERjAkvHku4o9j5QuiXzBB4bfSstCxG_KeQ&s=10",
    description: "Grilled chicken and melted cheese layered between toasted bread.",
    price: 230,
    status: "Active",
    modifierPrices: [
      ...prices("mod_bread", {
        white: 0,
        brown: 10,
        multigrain: 20,
        sourdough: 30,
      }),
      ...prices("mod_serve_style", {
        grilled: 0,
        toasted: 0,
        cold: 0,
      }),
      ...prices("mod_sandwich_addons", {
        extra_veggies: 20,
        cheese_slice: 30,
        egg: 40,
        grilled_chicken: 80,
        grilled_paneer: 50,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  /* ==================== FRIES ==================== */

  {
    id: 36,
    name: "Classic Fries",
    menuSectionId: 8,
    menuName: "Fries",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe9GNWvl73B7rlvLhfPUCAF0wv03Gq54zxiDgr0KGiMw&s=10",
    description: "Crispy golden fries lightly seasoned with salt.",
    price: 100,
    status: "Active",
    modifierPrices: [
      ...prices("mod_fries_size", {
        regular: 0,
        medium: 30,
        large: 60,
      }),
         ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 37,
    name: "Peri Peri Fries",
    menuSectionId: 8,
    menuName: "Fries",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREpOZ_2lChCig2zW0BMVOSxs7vmffCx2jujNNgu0t8wQ&s=10",
    description: "Crispy fries tossed in a spicy and flavorful peri peri seasoning.",
    price: 130,
    status: "Active",
    modifierPrices: [
      ...prices("mod_fries_size", {
        regular: 0,
        medium: 30,
        large: 60,
      }),
         ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 38,
    name: "Cheesy Fries",
    menuSectionId: 8,
    menuName: "Fries",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxECgpvJ7WS5D6JhhUSckO69hVSQDoxCXNtYZHAaxV-g&s=10",
    description: "Golden fries topped with creamy melted cheese.",
    price: 160,
    status: "Active",
    modifierPrices: [
      ...prices("mod_fries_size", {
        regular: 0,
        medium: 30,
        large: 60,
      }),
         ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 39,
    name: "Masala Fries",
    menuSectionId: 8,
    menuName: "Fries",
    isVeg: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Q_aSWUpAO7v7Az9pGSOgMpRlPTrRvj4XYQ-wKtmrOg&s=10",
    description: "Crispy fries tossed with aromatic Indian spices and herbs.",
    price: 130,
    status: "Active",
    modifierPrices: [
      ...prices("mod_fries_size", {
        regular: 0,
        medium: 30,
        large: 60,
      }),
         ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  {
    id: 40,
    name: "Loaded Chicken Fries",
    menuSectionId: 8,
    menuName: "Fries",
    isVeg: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOSh_QIyvxnnzenQ4IgGDmz1btcbC7xONrs5GR7iDZaQ&s=10",
    description: "Crispy fries loaded with chicken, cheese, and smoky sauce.",
    price: 240,
    status: "Active",
    modifierPrices: [
      ...prices("mod_fries_size", {
        regular: 0,
        medium: 30,
        large: 60,
      }),
         ...prices("mod_dips", {
        ketchup: 0,
        cheese_dip: 20,
        mint_mayo: 15,
        honey_mustard: 20,
      }),
    ],
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
];

