import React, { useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/Header'
import { Outlet,useLocation } from 'react-router-dom'

const PrimaryLayout = () => {

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Header />
       
        <main className="min-h-0 flex-1 overflow-auto ml-2 mt-2 bg-background text-foreground">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
 export default PrimaryLayout