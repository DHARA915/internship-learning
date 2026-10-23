import type { ReactNode } from "react";
import { MusicShell } from "../components/layoutcomponents/MusicShell";
import { MusicThemeScope } from "../components/MusicThemeScope";

export default function MusicHubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="music-theme bg-background text-foreground">
      <MusicThemeScope />
      <MusicShell>{children}</MusicShell>
    </div>
  );
}