// app/page.tsx  (route: "/")
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  LayoutGrid,
  Ticket,
  FileText,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { APP_NAME } from "../data/navlink";

type RoleCard = {
  title: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
  icon: LucideIcon;
  iconClass: string;
  ctaVariant: "primary" | "accent";
};

const roles: RoleCard[] = [
  {
    title: "I'm an attendee",
    description:
      "Find events, book your seat and keep your passes in one place.",
    points: [
      "Browse events by category",
      "Register in a couple of taps",
      "See all your bookings",
    ],
    href: "/events",
    cta: "Continue as attendee",
    icon: Ticket,
    iconClass: "bg-brand-soft text-brand",
    ctaVariant: "primary",
  },
  {
    title: "I'm an organizer",
    description: "Create events, set ticket prices and track registrations.",
    points: [
      "Add and publish events",
      "Set free or paid tickets",
      "Watch seats fill up live",
    ],
    href: "/adminDashboard",
    cta: "Continue as organizer",
    icon: LayoutGrid,
    iconClass: "bg-warning-soft text-accent-foreground",
    ctaVariant: "accent",
  },
  {
    title: "Invoice Builder",
    description: "Create and Manage Invoices",
    points: [
      "Create and customize invoices",
      "Calculate taxes, discounts, and totals",
      "Preview, save, and download invoices as PDF",
    ],
    href: "/invoiceBuilder",
    cta: "Create an invoice",
    icon: FileText,
    iconClass: "bg-brand-soft text-brand",
    ctaVariant: "primary",
  },
    {
    title: "Inventory Management",
    description: "Create and Manage Inventory",
    points: [
      "Add and manage products with stock details",
      "Track stock levels, quantities, and inventory movements",
      "Monitor low-stock items and keep inventory up to date",
    ],
    href: "/inventory/dashboard",
    cta: "Manage inventory",
    icon: Boxes,
    iconClass: "bg-brand-soft text-brand",
    ctaVariant: "primary",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-button-primary text-primary-foreground">
            <CalendarDays className="size-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            {APP_NAME}
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            How would you like to continue?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Choose your role to open the right dashboard. You can switch any
            time from the header.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {roles.map(
            ({
              title,
              description,
              points,
              href,
              cta,
              icon: Icon,
              iconClass,
              ctaVariant,
            }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
              >
                <div
                  className={cn(
                    "mb-5 flex size-12 items-center justify-center rounded-xl",
                    iconClass,
                  )}
                >
                  <Icon className="size-6" />
                </div>

                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {description}
                </p>

                <ul className="mt-5 flex flex-col gap-2 text-sm">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-brand" />
                      {point}
                    </li>
                  ))}
                </ul>

                <span
                  className={cn(
                    buttonVariants({ variant: ctaVariant, size: "lg" }),
                    "mt-8 w-full",
                  )}
                >
                  {cta}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
