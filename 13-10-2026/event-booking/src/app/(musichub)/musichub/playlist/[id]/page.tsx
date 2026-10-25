"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ListMusic,
  Pencil,
  PencilLine,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { CommonDialog } from "@/components/CommonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AddSongDialog } from "../../../components/AddSongDialog";
import TrackTable from "../../../components/TrackTable";
import type { RootState } from "@/Redux/store";
import {
  deletePlaylist,
  removeTrackFromPlaylist,
  reorderPlaylistTracks,
  selectAllTracks,
  selectPlaylistById,
  updatePlaylist,
} from "@/Redux/Slices/musichub/musicslice";
import { playQueue, togglePlay } from "@/Redux/Slices/musichub/playerslice";
import type { Track } from "@/data/musichub/music";

const MUSIC_BASE = "/musichub";

const formatTotal = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  return minutes >= 60
    ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min`
    : `${minutes} min`;
};

const PlaylistContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const playlist = useSelector((state: RootState) =>
    selectPlaylistById(state, id),
  );
  const allTracks = useSelector(selectAllTracks);
  const { currentId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [trackToRemove, setTrackToRemove] = useState<Track | null>(null);

  // edit dialog (name, description, cover)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCover, setEditCover] = useState("");
  const [editSubmitted, setEditSubmitted] = useState(false);
  const [coverKey, setCoverKey] = useState(0);

  // the playlist's own order; ids with no matching track are skipped
  const playlistTracks = useMemo(
    () =>
      (playlist?.trackIds ?? [])
        .map((trackId) => allTracks.find((track) => track.id === trackId))
        .filter((track): track is Track => !!track),
    [playlist, allTracks],
  );

  const visibleTracks = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return playlistTracks;
    return playlistTracks.filter((track) =>
      [track.title, track.artist, track.album].some((field) =>
        field.toLowerCase().includes(text),
      ),
    );
  }, [playlistTracks, search]);

  if (!playlist) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ListMusic className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">
          This playlist doesn't exist, or it was deleted.
        </p>
        <Button variant="outline">
          <Link href={MUSIC_BASE}>Back to home</Link>
        </Button>
      </div>
    );
  }

  const totalSeconds = playlistTracks.reduce(
    (sum, track) => sum + track.duration,
    0,
  );

  const handleDelete = () => {
    dispatch(deletePlaylist(playlist.id));
    router.push(MUSIC_BASE);
  };

  // the queue is the whole playlist in its own order, so Next / Previous follow it
  const playFrom = (track: Track) =>
    dispatch(
      playQueue({
        queue: playlistTracks.map((item) => item.id),
        trackId: track.id,
      }),
    );

  /* ---------- edit playlist ---------- */

  const openEdit = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description);
    setEditCover(playlist.coverUrl);
    setEditSubmitted(false);
    setCoverKey((key) => key + 1);
    setIsEditOpen(true);
  };

  const handleCover = (file: File | null) => {
    if (!file) return setEditCover("");
    const reader = new FileReader();
    reader.onload = () => setEditCover(String(reader.result));
    reader.readAsDataURL(file);
  };

  const editNameError = !editName.trim()
    ? "Playlist name is required"
    : undefined;

  // returning false keeps the dialog open; otherwise CommonDialog closes it
  const handleEditSave = () => {
    setEditSubmitted(true);
    if (editNameError) return false;

    dispatch(
      updatePlaylist({
        id: playlist.id,
        changes: {
          name: editName.trim(),
          description: editDescription.trim(),
          coverUrl:
            editCover || `https://picsum.photos/seed/${playlist.id}/400/400`,
        },
      }),
    );
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <section className="flex flex-col gap-5 rounded-2xl bg-gradient-to-b from-brand/30 to-transparent p-4 sm:flex-row sm:items-end sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="aspect-square w-40 shrink-0 rounded-xl bg-tertiary object-cover shadow-lg sm:w-48"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Playlist
          </p>
          <div className="mt-1 flex items-start gap-3">
            <h1 className="min-w-0 text-3xl font-extrabold tracking-tight break-words sm:text-5xl">
              {playlist.name}
            </h1>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Edit playlist"
              className="mt-1 shrink-0 sm:mt-2"
              onClick={openEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {playlistTracks.length}{" "}
            {playlistTracks.length === 1 ? "track" : "tracks"} •{" "}
            {formatTotal(totalSeconds)}
          </p>
          {playlist.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {playlist.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={playlistTracks.length === 0}
            onClick={() => playFrom(playlistTracks[0])}
          >
            <Play />
            Play
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 />
            Delete Playlist
          </Button>
        </div>
      </section>

      {/* Search row: search on the left, Add song at the end */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1 sm:max-w-sm">
          <FormField
            type="search"
            name="playlist-track-search"
            placeholder="Search in playlist..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <Button
          type="button"
          className="ml-auto"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus />
          Add song
        </Button>
      </div>

      <TrackTable
        tracks={visibleTracks}
        showGenre={false}
        emptyMessage={
          playlistTracks.length === 0
            ? "This playlist is empty. Use Add song to put some tracks here."
            : "No tracks match your search."
        }
        onPlay={playFrom}
        onTogglePlay={() => dispatch(togglePlay())}
        currentId={currentId}
        isPlaying={isPlaying}
        // dragging only makes sense on the full list, not while filtered
        onReorder={
          search.trim()
            ? undefined
            : (trackIds) =>
                dispatch(
                  reorderPlaylistTracks({ playlistId: playlist.id, trackIds }),
                )
        }
        renderAction={(track) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${track.title}`}
            className="text-danger"
            onClick={() => setTrackToRemove(track)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      />

      {/* Edit playlist: name, description, cover image */}
      <CommonDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        icon={<PencilLine />}
        title="Edit Playlist"
        description="Change the name, description or cover image."
        saveLabel="Save changes"
        onSubmit={handleEditSave}
      >
        <div className="flex flex-col gap-5">
          <FormField
            type="text"
            name="playlist-name"
            label="Name"
            placeholder="My Playlist"
            value={editName}
            onChange={setEditName}
            error={editSubmitted ? editNameError : undefined}
            maxLength={40}
            required
          />
          <FormField
            type="textarea"
            name="playlist-description"
            label="Description (Optional)"
            placeholder="Add a short description..."
            value={editDescription}
            onChange={setEditDescription}
          />
          <FormField
            key={coverKey}
            type="file"
            name="playlist-cover"
            label="Cover Image (Optional)"
            value={editCover}
            onFileChange={handleCover}
            maxSizeMB={5}
          />
        </div>
      </CommonDialog>

      <AddSongDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        playlist={playlist}
        allTracks={allTracks}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        icon={Trash2}
        variant="danger"
        title="Delete this playlist?"
        description={
          <>
            <span className="font-medium text-foreground">{playlist.name}</span>{" "}
            will be removed. Your songs stay in the library.
          </>
        }
        confirmLabel="Delete playlist"
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!trackToRemove}
        onOpenChange={(open) => {
          if (!open) setTrackToRemove(null);
        }}
        icon={Trash2}
        variant="danger"
        title="Remove this song?"
        description={
          <>
            <span className="font-medium text-foreground">
              {trackToRemove?.title}
            </span>{" "}
            will be removed from this playlist. The song stays in your library.
          </>
        }
        confirmLabel="Remove song"
        onConfirm={() => {
          if (trackToRemove) {
            dispatch(
              removeTrackFromPlaylist({
                playlistId: playlist.id,
                trackId: trackToRemove.id,
              }),
            );
          }
          setTrackToRemove(null);
        }}
      />
    </div>
  );
};

export default function PlaylistPage() {
  return (
    <Suspense fallback={null}>
      <PlaylistContent />
    </Suspense>
  );
}
