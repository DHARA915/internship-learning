import { Suspense } from "react";
import AppShell from "@/layout/Appshell";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-background" />}
    >
      <AppShell role="inventory">
        {children}
      </AppShell>
    </Suspense>
  );
}