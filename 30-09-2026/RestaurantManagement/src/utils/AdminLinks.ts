import {
    LayoutDashboard,
    List,
    SlidersHorizontal,
    PanelsTopLeft,
    UtensilsCrossed,
    
    type LucideIcon,
} from "lucide-react";

export interface AdminLink {
    title: string;
    href: string;
    icon: LucideIcon;
    image?: string;
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
        icon: PanelsTopLeft,
    },
    {
        title: "Modifiers",
        href: "/admin/menu-modifiers",
        icon: SlidersHorizontal,
    },
    {
        title: "Menu Items",
        href: "/admin/menu-items",
        icon: UtensilsCrossed,
    },

]