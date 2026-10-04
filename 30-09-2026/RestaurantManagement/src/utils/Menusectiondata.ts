export interface MenuSection {
  id: number;
  name: string;
  description: string;
  icon: string; // Image URL
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export const Menusectiondata: MenuSection[] = [
  {
    id: 1,
    name: "Drinks",
    description: "Refreshing beverages, juices, and mocktails",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd0A-soElVsX1T1QIUk3Dshd_S-rgnvAn_-3ZaFNfGUQ&s=10",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 2,
    name: "Pizza",
    description: "Freshly baked pizzas with delicious toppings",
    icon: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 3,
    name: "Burgers",
    description: "Juicy burgers with fresh ingredients",
    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 4,
    name: "Desserts",
    description: "Sweet treats and delicious desserts",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OjO3oUziQa0CdQWNNhsWX8lq2arzGCqmHdJw-ckiCQ&s=10",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 5,
    name: "Starters",
    description: "Tasty appetizers and snacks to start your meal",
    icon:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ8RbuCnFpzn-3aDUT97CzPisJ6CyCRhYgxCaffyLQ2g&s=10",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 6,
    name: "Pasta",
    description:
      "Delicious pasta dishes prepared with rich sauces and fresh ingredients",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThU5cTL05KP5EjTMjH6-c8ea047-MPUoGdCVW5gog_uA&s=10",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 7,
    name: "Sandwiches",
    description:
      "Freshly prepared sandwiches filled with delicious ingredients and flavorful sauces",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiy8ew9KbZGvS3uxeHEf7SJK83H6bbrnnFGVJHAPq1kA&s=10",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },

  {
    id: 8,
    name: "Fries",
    description:
      "Crispy golden fries seasoned to perfection and served as a delicious side",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxEOGmNdz954dtenRkIU-nC7QArMpE6D_XKoDZZ8whMg&s=10",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
];