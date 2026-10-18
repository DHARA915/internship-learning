// components/layout/AppSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import {
  APP_NAME,
  getActiveLink,
  getLinks,
  type Role,
} from "../../data/navlink";

type AppSidebarProps = {
  role: Role;
  open: boolean;
  onClose: () => void;
};

const AppSidebar = ({ role, open, onClose }: AppSidebarProps) => {
  const pathname = usePathname();
  const links = getLinks(role);
  const activeHref = getActiveLink(links, pathname)?.href;


  const roleLabel = {
    admin: "Organizer",
    inventory: "Inventory",
    attendee: "Attendee",
    user: "User",
  }[role];

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-[var(--overlay)] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-card transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex h-18 items-center justify-between border-b border-line px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-button-primary text-lg font-bold text-primary-foreground">
              {APP_NAME.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold leading-tight">
                {APP_NAME}
              </h2>
              
               <p className="text-xs text-muted-foreground">{roleLabel}</p>
              
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close menu"
            onClick={onClose}
            className="lg:hidden"
          >
            <X />
          </Button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-xs text-muted-foreground">{roleLabel}</p>

          <ul className="flex flex-col gap-1">
            {links.map(({ href, title, icon: Icon }) => {
              const isActive = href === activeHref;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      buttonVariants({
                        variant: isActive ? "primary" : "ghost",
                        size: "lg",
                      }),
                      "md:w-full justify-start gap-3",
                      !isActive && "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-[18px]" />
                    <span>{title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
