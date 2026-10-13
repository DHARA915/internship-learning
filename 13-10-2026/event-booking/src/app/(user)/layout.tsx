import { Suspense } from "react";
import AppShell from "../../layout/Appshell";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-background" />}
    >
      <AppShell role="user">{children}</AppShell>
    </Suspense>
  );
}