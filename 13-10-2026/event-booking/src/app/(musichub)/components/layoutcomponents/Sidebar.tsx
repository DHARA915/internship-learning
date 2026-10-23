"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, Heart, Home, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const MUSIC_BASE = "/musichub";

const NAV = [
  { href: MUSIC_BASE, label: "Home", icon: Home, exact: true },
  { href: `${MUSIC_BASE}/search`, label: "Search", icon: Search, exact: false },
];

// static for now: replaced by real playlists in a later step
const PLAYLISTS = [
  { id: "liked", name: "Liked Songs", tracks: 24, cover: null },
  { id: "chill-vibes", name: "Chill Vibes", tracks: 18, cover: "https://picsum.photos/seed/chill-vibes/80/80" },
  { id: "workout", name: "Workout", tracks: 22, cover: "https://picsum.photos/seed/workout/80/80" },
  { id: "indie-mix", name: "Indie Mix", tracks: 16, cover: "https://picsum.photos/seed/indie-mix/80/80" },
];

type SidebarProps = {
  /** called after a link is clicked (the mobile drawer uses it to close itself) */
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex h-full w-full flex-col gap-5 bg-sidebar p-4">
      {/* Logo */}
      <Link href={MUSIC_BASE} onClick={onNavigate} className="flex items-center gap-2 px-2 text-lg font-bold">
        <AudioLines className="size-6 text-brand" />
        MusicHub
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={isActive(href, exact) ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "border-brand bg-hover text-foreground"
                : "border-transparent text-muted-foreground hover:bg-hover hover:text-foreground"
            }`}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Playlists */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Your Playlists</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="Create playlist">
            <Plus />
          </Button>
        </div>

        <ul className="-mx-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1">
          {PLAYLISTS.map((playlist) => {
            const href = `${MUSIC_BASE}/playlist/${playlist.id}`;
            const active = pathname === href;

            return (
              <li key={playlist.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                    active ? "bg-hover" : "hover:bg-hover"
                  }`}
                >
                  {playlist.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={playlist.cover} alt="" className="size-10 shrink-0 rounded-md bg-tertiary object-cover" />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                      <Heart className="size-5 fill-current" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground">{playlist.tracks} tracks</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Button type="button" variant="outline" className="w-full">
        <Plus /> Create Playlist
      </Button>
    </div>
  );
}