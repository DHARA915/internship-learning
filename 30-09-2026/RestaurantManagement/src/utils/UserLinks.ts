import { LayoutDashboard,Home, type LucideIcon } from "lucide-react";
import type { Menu } from "./Menusectiondata";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
export interface UserLink {
  title: string;
  href: string;
  icon?: LucideIcon;
  image?: string;
}


export const getUserLinks = (
  menus: Menu[]
): UserLink[] => {
  const dashboard: UserLink = {
    title: "Home",
    href: "/user/home",
    icon: Home,
  };

  const menuLinks: UserLink[] = menus
    .filter((menu) => menu.status === "Active")
    .map((menu) => ({
      title: menu.name,
      href: `/user/menu/${menu.id}`,
      image: menu.icon,
    }));

  return [
    dashboard,
    ...menuLinks,
  ];
};