
// import { NavLink } from "react-router-dom";
// import { LogOut, ChevronRight } from "lucide-react";

// import {
//   Sidebar as ShadcnSidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarFooter,
// } from "@/components/ui/sidebar";

// import { NAV_ITEMS } from "@/components/sidebar/config";

// const Sidebar = () => {
//   return (
//     <ShadcnSidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      
//       {/* Logo */}
//       <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
//         <NavLink
//           to="/dashboard"
//           className="flex items-center gap-3 px-1"
//         >
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
//             <span className="text-sm font-bold text-primary-foreground">
//               A
//             </span>
//           </div>

//           <div className="flex min-w-0 flex-col leading-tight">
//             <span className="truncate text-[15px] font-semibold text-sidebar-foreground">
//              Admin Management
//             </span>

//             <span className="truncate text-xs text-muted-foreground">
             
//             </span>
//           </div>
//         </NavLink>
//       </SidebarHeader>

//       {/* Navigation */}
//       <SidebarContent className="px-2 py-4">
//         <SidebarGroup>
//           <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/60">
//             Modules
//           </SidebarGroupLabel>

//           <SidebarGroupContent className="mt-1">
//             <SidebarMenu className="gap-0.5">
//               {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
//                 <SidebarMenuItem key={to}>
//                   <SidebarMenuButton asChild>
//                     <NavLink
//                       to={to}
//                       className={({ isActive }) =>
//                         [
//                           "group relative flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",

//                           isActive
//                             ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
//                             : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//                         ].join(" ")
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           {/* Active indicator */}
//                           {isActive && (
//                             <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
//                           )}

//                           <Icon
//                             className={[
//                               "h-4 w-4 shrink-0",
//                               isActive
//                                 ? "text-primary"
//                                 : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground",
//                             ].join(" ")}
//                           />

//                           <span>{label}</span>
//                         </>
//                       )}
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* Footer */}
//       <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        
//         {/* User */}
//         <div className="flex items-center gap-3 rounded-lg px-2 py-2">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
//             JD
//           </div>

//           <div className="flex min-w-0 flex-1 flex-col">
//             <span className="truncate text-sm font-medium text-sidebar-foreground ">
//               John Doe
//             </span>

//             <span className="truncate text-xs text-muted-foreground">
//               Administrator
//             </span>
//           </div>

//           <ChevronRight className="h-4 w-4 shrink-0 text-sidebar-foreground/40" />
//         </div>

//         {/* Logout */}
//         <SidebarMenu className="mt-1">
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               className="
//                 text-sidebar-foreground/60
//                 hover:bg-red-50
//                 hover:text-red-600
//                 dark:hover:bg-red-950
//                 dark:hover:text-red-400
//               "
//             >
//               <LogOut className="h-4 w-4" />
//               <span>Logout</span>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>

//       </SidebarFooter>
//     </ShadcnSidebar>
//   );
// };

// export default Sidebar;

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
    <ShadcnSidebar className="border-r border-border bg-background text-tertiary">

      {/* Logo */}
      <SidebarHeader className="border-b border-border bg-background px-4 py-5">
        <NavLink
          to="/dashboard"
          className="group flex items-center gap-3"
        >
          {/* Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="text-sm font-bold text-primary">
              A
            </span>
          </div>

          {/* Brand */}
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[15px] font-semibold tracking-tight text-tertiary">
              Admin Management
            </span>

            <span className="mt-0.5 truncate text-xs text-secondary">
              Administration Panel
            </span>
          </div>
        </NavLink>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-background px-3 py-5">
        <SidebarGroup>

          <SidebarGroupLabel className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Modules
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        [
                          "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ",

                          isActive
                            ? "bg-tertiary font-semibold text-tertiary shadow-sm"
                            : "text-secondary hover:bg-secondary hover:text-tertiary",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                          )}

                          {/* Icon */}
                          <Icon
                            className={[
                              "h-[18px] w-[18px]   shrink-0",

                              isActive
                                ? "text-tertiary"
                                : "text-secondary ",
                            ].join(" ")}
                          />

                          {/* Label */}
                          <span className="truncate">
                            {label}
                          </span>
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
      <SidebarFooter className="border-t border-border bg-background px-3 py-4">

        {/* User */}
        <div className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-secondary">

          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary">
            JD
          </div>

          {/* User Info */}
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-tertiary">
              John Doe
            </span>

            <span className="truncate text-xs text-secondary">
              Administrator
            </span>
          </div>

          {/* Arrow */}
          <ChevronRight className="h-4 w-4 shrink-0 text-secondary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-tertiary" />
        </div>

        {/* Logout */}
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="
                rounded-lg
                px-3
                py-2.5
                text-secondary
                transition-colors
                hover:bg-red-50
                hover:text-red-600
                dark:hover:bg-red-950/30
                dark:hover:text-red-400
              "
            >
              <LogOut className="h-4 w-4" />

              <span>
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;