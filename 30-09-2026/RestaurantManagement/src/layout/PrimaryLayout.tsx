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
      <AppSidebar links={adminLinks} />

      <SidebarInset className="bg-primary">
        <AppHeader />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrimaryLayout;