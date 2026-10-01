export interface MenuSection {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export const Menusectiondata: MenuSection[] = [
  {
    id: 1,
    name: "Drinks",
    description: "Refreshing beverages, juices, and mocktails",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: 2,
    name: "Pizza",
    description: "Freshly baked pizzas with delicious toppings",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: 3,
    name: "Burgers",
    description: "Juicy burgers with fresh ingredients",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: 4,
    name: "Desserts",
    description: "Sweet treats and delicious desserts",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: 5,
    name: "Starters",
    description: "Tasty appetizers and snacks to start your meal",
    status: "Active",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
];