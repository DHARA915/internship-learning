import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar";

import AppSidebar from "../components/Sidebar/AppSidebar";
import AppHeader from "../components/Header/AppHeader";
import { adminLinks } from "../utils/AdminLinks";

const PrimaryLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="bg-secondary h-svh overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrimaryLayout;