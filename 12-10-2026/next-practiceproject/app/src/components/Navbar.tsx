"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  X,
  Notebook,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "@/app/src/context/auth-context";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/products", label: "Products", icon: Package },
  { href: "/blog", label: "Blog", icon: Notebook },
];

function NavbarContent() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();

  // Links are only for logged-in users
  const loggedIn = ready && !!user;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout(); 
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href={loggedIn ? "/" : "/login"}
          onClick={closeMenu}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-primary text-lg font-bold text-foreground-on-primary!">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground!">
            MyApp
          </span>
        </Link>

        {/* Desktop links (hidden on mobile, hidden when logged out) */}
        {loggedIn && (
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-background-primary-soft text-foreground-primary!"
                      : "text-foreground-secondary! hover:bg-background-primary-soft hover:text-foreground-primary!"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg bg-background-primary px-4 py-2 text-sm font-semibold text-foreground-on-primary! shadow-sm transition-colors hover:bg-background-primary-hover"
              >
                <LayoutDashboard size={18} />
                Admin
              </Link>
            </li>
            <li className="ml-1">
              <Button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground-secondary! transition-colors hover:bg-background-primary-soft hover:text-foreground-primary!"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </li>
          </ul>
        )}

        {/* Hamburger button (mobile only, logged in only) */}
        {loggedIn && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </nav>

      {/* Mobile vertical menu */}
      {loggedIn && open && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive(href)
                      ? "bg-background-primary-soft text-foreground-primary!"
                      : "text-foreground-secondary! hover:bg-background-secondary"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-lg bg-background-primary px-4 py-3 text-base font-semibold text-foreground-on-primary!"
              >
                <LayoutDashboard size={20} />
                Admin
              </Link>
            </li>
            <li>
              <Button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground-secondary! transition-colors hover:bg-background-secondary"
              >
                <LogOut size={20} />
                Logout
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

// Shown while usePathname() resolves (no hooks here, so it can prerender)
function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-primary text-lg font-bold text-foreground-on-primary!">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground!">
            MyApp
          </span>
        </Link>
      </nav>
    </header>
  );
}

// Suspense lives here, so the layout can just render <Navbar />
export default function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  );
}