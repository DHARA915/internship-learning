import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import type { AdminLink } from "../../utils/AdminLinks";
import { RESTAURANT_NAME } from "../../utils/restaurantCommon";

interface AppSidebarProps {
  links: AdminLink[];
}

/**
 * Picks the single best-matching link for the current path, so a nested
 * route like /admin/orders/42 highlights "Orders" (and not also "/admin").
 */
const getActiveHref = (links: AdminLink[], pathname: string) =>
  links
    .filter(
      (l) => pathname === l.href || pathname.startsWith(`${l.href.replace(/\/$/, "")}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

const AppSidebar = ({ links }: AppSidebarProps) => {
  const { pathname } = useLocation();
  const activeHref = getActiveHref(links, pathname);

  return (
    <Sidebar className="  bg-gradient-to-br
    from-primary
    via-primary
    to-brand-soft">
      {/* Brand */}
      <SidebarHeader className="border-b border-line p-0">
        <div className="flex items-center gap-3 px-4 py-4">
          {/* Monogram tile with a saffron "pilot light" */}
          <div className="relative shrink-0">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand text-on-brand shadow-sm">
              <span className="text-xl font-semibold leading-none">
                {RESTAURANT_NAME.charAt(0).toUpperCase()}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 size-3 rounded-full bg-accent ring-2 ring-[var(--bg-primary)]"
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold leading-tight tracking-tight text-primary">
              {RESTAURANT_NAME}
            </h2>
            <p className="mt-0.5 text-xs text-tertiary">Restaurant admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className=" bg-gradient-to-br
    from-primary
    via-primary
    to-brand-soft px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-tertiary">
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === activeHref;

                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton 
                    
                      isActive={isActive}
                      className="
                        relative h-10 rounded-lg px-3
                        text-secondary transition-colors
                        hover:bg-tertiary hover:text-primary
                        data-[active=true]:bg-brand-soft
                        data-[active=true]:font-medium
                        data-[active=true]:text-brand
                        data-[active=true]:hover:bg-brand-soft
                        data-[active=true]:hover:text-brand
                        before:absolute before:inset-y-2 before:-left-2 before:w-[3px]
                        before:rounded-full before:bg-brand before:opacity-0
                        data-[active=true]:before:opacity-100
                        hover:bg-brand-soft hover:text-brand 
                      "
                    >
                      <Link
                        to={link.href}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className="flex items-center gap-3 w-full ">
                        <Icon className="size-[18px]" />
                        <div>{link.title}</div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;