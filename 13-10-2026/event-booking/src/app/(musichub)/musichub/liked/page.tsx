"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Play, Trash2, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import TrackTable from "../../components/TrackTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { RootState } from "@/Redux/store";
import {
  selectAllTracks,
  selectLikedTrackIds,
  toggleLikedTrack,
  clearLikedTracks,
} from "@/Redux/Slices/musichub/musicslice";
import { playQueue, togglePlay } from "@/Redux/Slices/musichub/playerslice";
import type { Track } from "@/data/musichub/music";
import GenreFilter, {
  type GenreFilterValue,
} from "../../components/GenreFilter";

const MUSIC_BASE = "/musichub";

const formatTotal = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  return minutes >= 60
    ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min`
    : `${minutes} min`;
};

export default function LikedSongsPage() {
  const dispatch = useDispatch();

  const likedIds = useSelector(selectLikedTrackIds);
  const allTracks = useSelector(selectAllTracks);
  const { currentId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<GenreFilterValue>("All");
  const [isClearOpen, setIsClearOpen] = useState(false);


  // newest like first; ids with no matching track are skipped
  const likedTracks = useMemo(
    () =>
      [...(likedIds ?? [])]
        .reverse()
        .map((trackId) => allTracks.find((track) => track.id === trackId))
        .filter((track): track is Track => !!track),
    [likedIds, allTracks],
  );

  const isListCurrent = likedTracks.some((track)=>track.id===currentId)
  const isListPlaying = isListCurrent && isPlaying


  // only genres that exist among the liked songs
  const availableGenres = useMemo(
    () => Array.from(new Set(likedTracks.map((track) => track.genre))),
    [likedTracks],
  );
  // if the selected genre no longer has any liked song, fall back to All
  const activeGenre: GenreFilterValue =
    genre === "All" || availableGenres.includes(genre) ? genre : "All";

  const visibleTracks = useMemo(() => {
    const text = search.trim().toLowerCase();
    return likedTracks.filter(
      (track) =>
        (activeGenre === "All" || track.genre === activeGenre) &&
        (!text ||
          [track.title, track.artist, track.album].some((field) =>
            field.toLowerCase().includes(text),
          )),
    );
  }, [likedTracks, search, activeGenre]);

  const totalSeconds = likedTracks.reduce(
    (sum, track) => sum + track.duration,
    0,
  );

  // genre selected: Next / Previous follow the filtered list; All: the whole liked list
  const playFrom = (track: Track) =>
    dispatch(
      playQueue({
        queue: (activeGenre === "All" ? likedTracks : visibleTracks).map(
          (item) => item.id,
        ),
        trackId: track.id,
      }),
    );
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <section className="flex flex-col gap-5 rounded-2xl bg-gradient-to-b from-brand/30 to-transparent p-4 sm:flex-row sm:items-end sm:p-6">
        <div className="flex aspect-square w-40 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 shadow-lg sm:w-48">
          <Heart className="size-16 fill-white text-white sm:size-20" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Playlist
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight break-words sm:text-5xl">
            Liked Songs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {likedTracks.length} {likedTracks.length === 1 ? "song" : "songs"}
            {likedTracks.length > 0 && <> • {formatTotal(totalSeconds)}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
        <Button
  type="button"
  size="sm"
  disabled={likedTracks.length === 0}
  onClick={() => (isListCurrent ? dispatch(togglePlay()) : playFrom(likedTracks[0]))}
>
  {isListPlaying ? <Pause /> : <Play />}
  {isListPlaying ? "Pause" : "Play"}
</Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setIsClearOpen(true)}
          >
            <Trash2 />
            Clear all
          </Button>
        </div>
      </section>

      {likedTracks.length === 0 ? (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-16 text-center">
          <Heart className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            You haven't liked any songs yet. Tap the heart on a song to save it
            here.
          </p>
          <Button variant="outline">
            <Link href={`${MUSIC_BASE}/search`}>Find songs</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Search inside liked songs */}
          <div className="max-w-sm">
            <FormField
              type="search"
              name="liked-track-search"
              placeholder="Search in liked songs..."
              value={search}
              onChange={setSearch}
            />
          </div>

          <GenreFilter
            genres={availableGenres}
            value={activeGenre}
            onChange={setGenre}
            resultCount={visibleTracks.length}
          />

          <ConfirmDialog
            open={isClearOpen}
            onOpenChange={setIsClearOpen}
            icon={Trash2}
            variant="danger"
            title="Clear all liked songs?"
            description={
              <>
                All{" "}
                <span className="font-medium text-foreground">
                  {likedTracks.length}
                </span>{" "}
                songs will be removed from Liked Songs. The songs stay in your
                library.
              </>
            }
            confirmLabel="Clear all"
            onConfirm={() => {
              dispatch(clearLikedTracks());
              setIsClearOpen(false);
            }}
          />

          <TrackTable
            tracks={visibleTracks}
            showLike
            emptyMessage="No liked songs match your search."
            onPlay={playFrom}
            onTogglePlay={() => dispatch(togglePlay())}
            currentId={currentId}
            isPlaying={isPlaying}
            likedTrackIds={likedIds ?? []}
            onToggleLike={(track) => dispatch(toggleLikedTrack(track.id))}
          />
        </>
      )}
    </div>
  );
}
