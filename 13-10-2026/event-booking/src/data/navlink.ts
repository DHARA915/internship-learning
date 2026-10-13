
import {
  CalendarDays,
  LayoutGrid,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Admit";

export type Role = "admin" | "user";

export type NavLink = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminLinks: NavLink[] = [
  { title: "Overview", href: "/adminDashboard", icon: LayoutGrid },
  { title: "Registrations", href: "/registration", icon: Users },
  { title: "Events", href: "/addevents", icon: CalendarDays },
];

export const userLinks: NavLink[] = [
  { title: "Events", href: "/events", icon: CalendarDays },
  { title: "My bookings", href: "/booking", icon: Ticket },
];

export const getLinks = (role: Role): NavLink[] =>
  role === "admin" ? adminLinks : userLinks;

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