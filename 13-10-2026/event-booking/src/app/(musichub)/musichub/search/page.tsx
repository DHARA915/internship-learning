"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import FormField from "@/components/form-field/FormField";
import TrackTable from "../../components/TrackTable";
import AddToPlaylist from "../../components/AddToPlaylist";
import type { RootState } from "@/Redux/store";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  selectAllPlaylists,
  selectAllTracks,
  selectLikedTrackIds,
  toggleLikedTrack,
} from "@/Redux/Slices/musichub/musicslice";
import { playQueue, togglePlay } from "@/Redux/Slices/musichub/playerslice";
import { GENRES, type Genre, type Track } from "@/data/musichub/music";
import GenreFilter,{type GenreFilterValue} from "../../components/GenreFilter";


const isGenre = (value: string): value is Genre =>
  (GENRES as readonly string[]).includes(value);

// the clicked song first, then the same artist, then the same genre
const buildRelatedQueue = (selected: Track, all: Track[]) => {
  const sameArtist = all.filter(
    (track) => track.id !== selected.id && track.artist === selected.artist,
  );
  const sameGenre = all.filter(
    (track) =>
      track.id !== selected.id &&
      track.artist !== selected.artist &&
      track.genre === selected.genre,
  );
  return [selected, ...sameArtist, ...sameGenre].map((track) => track.id);
};

const SearchContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tracks = useSelector(selectAllTracks);
  const playlists = useSelector(selectAllPlaylists);
  const likedTrackIds = useSelector(selectLikedTrackIds);
  const { currentId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  const query = searchParams.get("q") ?? "";
  const genreParam = searchParams.get("genre") ?? "";
  const genre: GenreFilterValue  = isGenre(genreParam) ? genreParam : "All";

  // typing stays instant in the input; the URL updates a moment later
  const [input, setInput] = useState(query);
  useEffect(() => setInput(query), [query]);

  const updateParams = (changes: { q?: string; genre?: string }) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === "All") next.delete(key);
      else next.set(key, value);
    });
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // debounce typing so the URL doesn't change on every keystroke
  useEffect(() => {
    if (input === query) return;
    const timer = setTimeout(() => updateParams({ q: input.trim() }), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    return tracks.filter(
      (track) =>
        (genre === "All" || track.genre === genre) &&
        (!text ||
          [track.title, track.artist, track.album].some((field) =>
            field.toLowerCase().includes(text),
          )),
    );
  }, [tracks, query, genre]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-5 p-4 sm:p-6">
      <FormField
        type="search"
        name="track-search"
        placeholder="What do you want to play?"
        value={input}
        onChange={setInput}
      />


      <GenreFilter
  genres={GENRES}
  value={genre}
  onChange={(item) => updateParams({ genre: item })}
  resultCount={results.length}
/>

      <TrackTable
        tracks={results}
        actionLabel="Add"
        emptyMessage="No tracks match your search."
        showLike
         likedTrackIds={likedTrackIds}
  onToggleLike={(track) => {
    dispatch(toggleLikedTrack(track.id));
  }}

        onPlay={(track) =>
          dispatch(
            playQueue({
              // genre chip selected: follow the table order; All: related songs (artist, then genre)
              queue:
                genre === "All"
                  ? buildRelatedQueue(track, tracks)
                  : results.map((item) => item.id),
              trackId: track.id,
            }),
          )
        }
        onTogglePlay={() => dispatch(togglePlay())}
        currentId={currentId}
        isPlaying={isPlaying}
        renderAction={(track) => (
          <AddToPlaylist
            track={track}
            playlists={playlists}
            onAdd={(playlistId) =>
              dispatch(addTrackToPlaylist({ playlistId, trackId: track.id }))
            }
            onRemove={(playlistId)=>dispatch(removeTrackFromPlaylist({ playlistId, trackId:track.id }))}
          />
        )}
      />
    </div>
  );
};

// useSearchParams needs a Suspense boundary or the production build fails
export default function MusicSearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
