// app/page.tsx  (route: "/")
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  LayoutGrid,
  Ticket,
  FileText,
  Boxes,
  Check,
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
};

const roles: RoleCard[] = [
  {
    title: "Attendee",
    description: "Find events, book your seat and keep your passes in one place.",
    points: [
      "Browse events by category",
      "Register in a couple of taps",
      "See all your bookings",
    ],
    href: "/events",
    cta: "Continue as attendee",
    icon: Ticket,
  },
  {
    title: "Organizer",
    description: "Create events, set ticket prices and track registrations.",
    points: [
      "Add and publish events",
      "Set free or paid tickets",
      "Watch seats fill up live",
    ],
    href: "/adminDashboard",
    cta: "Continue as organizer",
    icon: LayoutGrid,
  },
  {
    title: "Invoice Builder",
    description: "Create, customize and manage invoices.",
    points: [
      "Customize invoice templates",
      "Calculate taxes, discounts and totals",
      "Preview, save and download as PDF",
    ],
    href: "/invoiceBuilder",
    cta: "Create an invoice",
    icon: FileText,
  },
  {
    title: "Inventory",
    description: "Add products and keep stock levels up to date.",
    points: [
      "Add products with stock details",
      "Track quantities and movements",
      "Monitor low-stock items",
    ],
    href: "/inventory/dashboard",
    cta: "Manage inventory",
    icon: Boxes,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">
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
            Choose where to start. You can switch any time from the header.
          </p>
        </div>

        {/* Cards: identical structure, spacing and colors */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(({ title, description, points, href, cta, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-line bg-card p-6",
                "transition-colors hover:border-line-strong",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              )}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="size-5" />
              </div>

              <h2 className="mt-5 text-lg font-bold">{title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {description}
              </p>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <span
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "mt-8 w-full",
                )}
              >
                {cta}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}