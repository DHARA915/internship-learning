import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    to: "/Registration",
    label: "Registration",
    icon: LayoutDashboard,
  },
  {
    to: "/product-management",
    label: "Product Management",
    icon: Users,
    actionLabel: 'Manage Products'
  },
  {
    to: "/cart",
    label: "Cart",
    icon: Calendar,
    actionLabel: 'Manage Cart'

  },
];