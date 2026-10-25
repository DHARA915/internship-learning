"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AudioLines, Menu } from "lucide-react";
import { PlayerBar } from "../layoutcomponents/PlayerBar";
import { Sidebar } from "../layoutcomponents/Sidebar";
import { Button } from "@/components/ui/button";

/**
 * Three zones: sidebar (left), main content (scrolls), player bar (bottom).
 * The shell is exactly one screen tall and never scrolls, only <main> does,
 * so the sidebar and the player bar stay fixed.
 */
export function MusicShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1">
        {/* Sidebar: desktop */}
        <aside className="hidden w-[var(--sidebar-width)] shrink-0 border-r border-line lg:block">
          <Sidebar />
        </aside>

        {/* Sidebar: mobile drawer */}
        {menuOpen && (
          <>
            <Button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] max-w-[85vw] border-r border-line lg:hidden">
              <Sidebar onNavigate={() => setMenuOpen(false)} />
            </aside>
          </>
        )}

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-sidebar px-4 lg:hidden">
            <Button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu className="size-6" />
            </Button>
            <Link href="/musichub" className="flex items-center gap-2 font-bold">
              <AudioLines className="size-5 text-brand" />
              MusicHub
            </Link>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-none">{children}</main>
        </div>
      </div>

      <PlayerBar />
    </div>
  );
}