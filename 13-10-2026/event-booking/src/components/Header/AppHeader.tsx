// components/layout/AppHeader.tsx
"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { APP_NAME, getActiveLink, getLinks, type Role } from "../../data/navlink";

type AppHeaderProps = {
  role: Role;
  onMenuClick: () => void;
};

// Placeholder until real auth is added
const DISPLAY_NAME = "Aarav Mehta";

const AppHeader = ({ role, onMenuClick }: AppHeaderProps) => {
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const currentPage = getActiveLink(getLinks(role), pathname);
  const initial = DISPLAY_NAME.charAt(0).toUpperCase();

  return (

    <header className="sticky top-0 z-20 flex h-18 shrink-0 items-center justify-between border-b border-line bg-card px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <PanelLeft />
        </Button>

        <div className="hidden h-6 w-px bg-line lg:hidden sm:block" />

        <h1 className="text-base font-bold sm:text-lg">
          {currentPage?.title ?? APP_NAME}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Attendee / Organizer switch */}
        <div className="flex rounded-lg bg-muted p-1">
          <Link
            href="/event"
            className={cn(
              buttonVariants({
                variant: isAdmin ? "ghost" : "outline",
                size: "sm",
              }),
              !isAdmin && "shadow-sm",
            )}
          >
            Attendee
          </Link>
          <Link
            href="/adminDashboard"
            className={cn(
              buttonVariants({
                variant: isAdmin ? "outline" : "ghost",
                size: "sm",
              }),
              isAdmin && "shadow-sm",
            )}
          >
            Organizer
          </Link>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{DISPLAY_NAME}</p>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Organizer" : "Attendee"}
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
            {initial}
          </div>
        </div>
      </div>
    </header>
     

  );
};

export default AppHeader;