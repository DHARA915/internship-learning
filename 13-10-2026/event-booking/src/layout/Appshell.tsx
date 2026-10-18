
"use client";

import { useState } from "react";
import AppSidebar from "../components/Sidebar/AppSidebar";
import AppHeader from "../components/Header/AppHeader";
import type { Role } from "../data/navlink";


type AppShellProps = {
  role: Role;
  children: React.ReactNode;
};

const AppShell = ({ role, children }: AppShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full lg:pl-64">

      <AppSidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen w-full min-w-0 flex-col">
        <AppHeader
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;