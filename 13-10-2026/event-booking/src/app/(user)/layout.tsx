import AppShell from "../../layout/Appshell";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="user">{children}</AppShell>;
}