import { LayoutDashboard,Home, type LucideIcon } from "lucide-react";
import type { MenuSection } from "./Menusectiondata";

export interface UserLink {
  title: string;
  href: string;
  icon?: LucideIcon;
  image?: string;
}

export const getUserLinks = (
  menuSections: MenuSection[]
): UserLink[] => {
  const dashboard: UserLink = {
    title: "Home",
    href: "/user/home",
    icon: Home,
  };

  const menuLinks: UserLink[] = menuSections
    .filter((section) => section.status === "Active")
    .map((section) => ({
      title: section.name,
      href: `/user/menu/${section.id}`,
      image: section.icon,
    }));

  return [
    dashboard,
    ...menuLinks,
  ];
};