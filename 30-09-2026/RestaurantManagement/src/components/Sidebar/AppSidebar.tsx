import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { logout } from "../../Redux/Slices/authSlice";
import type { AppDispatch } from "../../Redux/store";
import {
  getUserLinks,
  type UserLink,
} from "../../utils/UserLinks";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuItem,
} from "../ui/sidebar";

import { adminLinks, type AdminLink } from "../../utils/AdminLinks";
import { RESTAURANT_NAME } from "../../utils/restaurantCommon";
import type { RootState } from "../../Redux/store";

// interface AppSidebarProps {
//   links: AdminLink[];
// }

/**
 * Picks the single best-matching link for the current path, so a nested
 * route like /admin/orders/42 highlights "Orders" (and not also "/admin").
 */
type NavigationLink = {
  href: string;
};

const getActiveHref = (
  links: NavigationLink[],
  pathname: string
) =>
  links
    .filter(
      (link) =>
        pathname === link.href ||
        pathname.startsWith(
          `${link.href.replace(/\/$/, "")}/`
        )
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

const AppSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((s: RootState) => s.auth.currentUser?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const isAdmin = role === "admin";
  const menuSections = useSelector(
  (state: RootState) =>
    state.menuSections.menuSections
);

const links = isAdmin
  ? adminLinks
  : getUserLinks(menuSections);
  const activeHref = getActiveHref(links, pathname);

  return (
    <Sidebar className="bg-primary">
      {/* Brand */}
      <SidebarHeader className="border-b border-line p-0">
        <div className="flex items-center gap-3 px-4 py-4">
          {/* Monogram tile with a saffron "pilot light" */}
          <div className="relative shrink-0">
            <div className="flex size-11 items-center justify-center rounded-xl bg-button-primary text-on-brand shadow-sm">
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
            <p className="mt-0.5 text-xs text-tertiary">
              {isAdmin ? "Restaurant admin" : "Restaurant menu"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className=" bg-primary  px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-tertiary">
            {isAdmin ? "Management" : "Menu"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === activeHref;

                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      className={`
      relative h-10 rounded-lg p-4 
      transition-colors duration-55
      ${
        isActive
          ? "bg-button-primary text-hover font-medium hover:bg-button-primary hover:text-hover"
          : "text-secondary hover:bg-button-primary hover:text-hover"
      }

      before:absolute
      before:inset-y-2
      before:-left-2
      before:w-[3px]
      before:rounded-full
      before:bg-brand
      ${isActive ? "before:opacity-100" : "before:opacity-0"}
    `}
                    >
                      <Link
                        to={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className="w-full"
                      >
                        <div className="flex items-center justify-start gap-5">
                          {/* <Icon className="size-[18px]" /> */}
                          {Icon ? (
  <Icon className="size-[18px]" />
) : link.image ? (
  <img
    src={link.image}
    alt=""
    className="size-6 rounded object-cover"
  />
) : (
  <span className="size-[18px]" />
)}
                          <span>{link.title}</span>
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

      <SidebarFooter className="border-t border-line p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              onClick={handleLogout}
              className="h-10 rounded-lg px-3 text-secondary transition-colors bg-brand-soft text-brand hover:bg-brand hover:text-hover"
            >
              <LogOut className="size-[18px]" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
