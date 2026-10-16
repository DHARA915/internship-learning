
import {
  CalendarDays,
  LayoutGrid,
  Ticket,
  Users,
  Package,
  Tags,
  Boxes,
  Truck,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Admit";

export type Role = "admin" | "user"| "inventory";

export type NavLink = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminLinks: NavLink[] = [
  { title: "Overview", href: "/adminDashboard", icon: LayoutGrid },
  { title: "Registrations", href: "/registeruser", icon: Users },
  { title: "Events", href: "/addevents", icon: CalendarDays },
];

export const userLinks: NavLink[] = [
  { title: "Events", href: "/events", icon: CalendarDays },
  { title: "My bookings", href: "/booking", icon: Ticket },
  // { title: "Register", href: "/register", icon: Ticket },
];

export const inventoryLinks: NavLink[] = [
  {
    title: "Dashboard",
    href: "/inventoryDashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Category",
    href: "/category",
    icon: Tags,
  },
  {
    title: "Stock Management",
    href: "/stockmanagement",
    icon: Boxes,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
];

export const getLinks = (role: Role): NavLink[] => {
  switch (role) {
    case "admin":
      return adminLinks;

    case "inventory":
      return inventoryLinks;

    case "user":
    default:
      return userLinks;
  }
};

const matches = (href: string, pathname: string) =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);

/** Best matching link for the current path (longest href wins). */
export const getActiveLink = (
  links: NavLink[],
  pathname: string,
): NavLink | undefined =>
  links
    .filter((link) => matches(link.href, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0];