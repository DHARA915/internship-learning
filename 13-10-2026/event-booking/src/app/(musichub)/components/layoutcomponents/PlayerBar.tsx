import { Music, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Placeholder for the bottom zone. The real player replaces the inside in a later step. */
export function PlayerBar() {
  return (
    <footer className="flex h-[var(--player-height)] shrink-0 items-center justify-between gap-4 border-t border-line bg-player px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-tertiary text-muted-foreground">
          <Music className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Nothing playing</p>
          <p className="truncate text-xs text-muted-foreground">Pick a track to start</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Previous" disabled>
          <SkipBack />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Play" disabled>
          <Pause />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Next" disabled>
          <SkipForward />
        </Button>
      </div>

      <div className="hidden flex-1 sm:block" />
    </footer>
  );
}