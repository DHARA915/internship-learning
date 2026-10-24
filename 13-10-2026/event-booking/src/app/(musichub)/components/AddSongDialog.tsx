"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ListPlus } from "lucide-react";
import FormField from "@/components/form-field/FormField";
import { CommonDialog } from "@/components/CommonDialog";
import { updatePlaylist } from "@/Redux/Slices/musichub/musicslice";
import type { Playlist, Track } from "@/data/musichub/music";

type AddSongDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: Playlist;
  allTracks: Track[];
};

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function AddSongDialog({ open, onOpenChange, playlist, allTracks }: AddSongDialogProps) {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wasOpen, setWasOpen] = useState(false);

  // every time the dialog opens, start with nothing searched or ticked
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSearch("");
      setSelectedIds([]);
    }
  }

  // songs that can still be added: everything that is not in this playlist
  const availableTracks = useMemo(() => {
    const inPlaylist = new Set(playlist.trackIds);
    const text = search.trim().toLowerCase();
    return allTracks.filter(
      (track) =>
        !inPlaylist.has(track.id) &&
        (!text ||
          [track.title, track.artist, track.album].some((field) =>
            field.toLowerCase().includes(text),
          )),
    );
  }, [allTracks, playlist.trackIds, search]);

  const toggleSelected = (trackId: string) =>
    setSelectedIds((previous) =>
      previous.includes(trackId)
        ? previous.filter((item) => item !== trackId)
        : [...previous, trackId],
    );

  // returning false keeps the dialog open; otherwise CommonDialog closes it
  const handleSave = () => {
    if (selectedIds.length === 0) return false;

    dispatch(
      updatePlaylist({
        id: playlist.id,
        changes: { trackIds: [...playlist.trackIds, ...selectedIds] }, // new songs go to the end
      }),
    );
  };

  const count = selectedIds.length;

  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={<ListPlus />}
      title="Add songs"
      description={`Tick the songs to add to "${playlist.name}". Songs already in it are not listed.`}
      saveLabel={count > 0 ? `Add ${count} song${count === 1 ? "" : "s"}` : "Add songs"}
        saveClassName="bg-brand text-brand-foreground hover:bg-brand/90"
      onSubmit={handleSave}
    >
      <div className="flex flex-col gap-3">
        {/* Enter in the search box must not submit the dialog */}
        <div
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
        >
          <FormField
            type="search"
            name="add-song-search"
            placeholder="Search songs..."
            value={search}
            onChange={setSearch}
          />
        </div>

        <ul className="max-h-72 overflow-y-auto rounded-xl border border-line">
          {availableTracks.length === 0 ? (
            <li className="p-6 text-center text-sm text-muted-foreground">
              {search.trim() ? "No songs match your search." : "Every song is already in this playlist."}
            </li>
          ) : (
            availableTracks.map((track) => {
              const checked = selectedIds.includes(track.id);
              return (
                <li key={track.id} className="border-b border-line last:border-b-0">
                  <label
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-tertiary ${
                      checked ? "bg-brand-soft" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelected(track.id)}
                      className="size-4 shrink-0 accent-brand"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.coverUrl}
                      alt=""
                      loading="lazy"
                      className="size-9 shrink-0 rounded bg-tertiary object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{track.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatDuration(track.duration)}
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </CommonDialog>
  );
}