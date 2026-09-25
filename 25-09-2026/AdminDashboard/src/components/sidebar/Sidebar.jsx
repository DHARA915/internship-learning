
import { NavLink } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";

import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { NAV_ITEMS } from "@/components/sidebar/config";

const Sidebar = () => {
  return (
    <ShadcnSidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      
      {/* Logo */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-1"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              H
            </span>
          </div>

          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[15px] font-semibold text-sidebar-foreground">
              Healthcare
            </span>

            <span className="truncate text-xs text-muted-foreground">
              Clinic Portal
            </span>
          </div>
        </NavLink>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/60">
            Modules
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-1">
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        [
                          "group relative flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",

                          isActive
                            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                          )}

                          <Icon
                            className={[
                              "h-4 w-4 shrink-0",
                              isActive
                                ? "text-primary"
                                : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground",
                            ].join(" ")}
                          />

                          <span>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        
        {/* User */}
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            JD
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-sidebar-foreground ">
              John Doe
            </span>

            <span className="truncate text-xs text-muted-foreground">
              Administrator
            </span>
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-sidebar-foreground/40" />
        </div>

        {/* Logout */}
        <SidebarMenu className="mt-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="
                text-sidebar-foreground/60
                hover:bg-red-50
                hover:text-red-600
                dark:hover:bg-red-950
                dark:hover:text-red-400
              "
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;