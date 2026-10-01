import {
    LayoutDashboard,
    List,
    UtensilsCrossed,
    type LucideIcon,
} from "lucide-react";

export interface AdminLink {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const adminLinks: AdminLink[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Menu Sections",
        href: "/admin/menu-sections",
        icon: List,
    },
    {
        title: "Menu Items",
        href: "/admin/menu-items",
        icon: UtensilsCrossed,
    },

]