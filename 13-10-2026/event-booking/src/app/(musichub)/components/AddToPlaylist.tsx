"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import FormField from "@/components/form-field/FormField";
import { Button } from "@/components/ui/button";
import type { Playlist, Track } from "@/data/musichub/music";

type Props = {
  track: Track;
  playlists: Playlist[];
  onAdd: (playlistId: string) => void;
};

export default function AddToPlaylist({ track, playlists, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);


  // close on outside click or Escape
  useEffect(() => { 
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div ref={boxRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Add ${track.title} to a playlist`}
        aria-expanded={open}
        className="size-8 rounded-full bg-tertiary hover:bg-brand hover:text-white"
        onClick={() => {
          setOpen((value) => !value);
          setQuery("");
        }}
      >
        <Plus className="size-4" />
      </Button>

      {open && (
        <div className="absolute top-full right-0 z-30 mt-2 w-64 rounded-xl border border-line bg-card p-3 text-left shadow-xl">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Add to playlist</p>

          <FormField
            type="search"
            name={`playlist-search-${track.id}`}
            placeholder="Search playlists..."
            value={query}
            onChange={setQuery}
          />

          <ul className="mt-2 max-h-52 space-y-0.5 overflow-y-auto">
            {shown.length === 0 && (
              <li className="px-2 py-3 text-center text-xs text-muted-foreground">
                No playlists found
              </li>
            )}
            {shown.map((playlist) => {
              const added = playlist.trackIds.includes(track.id);
              return (
                <li key={playlist.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={added}
                    onClick={() => onAdd(playlist.id)}
                    className="h-auto w-full justify-start gap-3 px-2 py-1.5 text-left text-sm font-normal"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={playlist.coverUrl}
                      alt=""
                      className="size-8 shrink-0 rounded-md bg-tertiary object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate">{playlist.name}</span>
                    {added && <Check className="size-4 shrink-0 text-brand" />}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}