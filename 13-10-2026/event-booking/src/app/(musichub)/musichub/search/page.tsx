"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import FormField from "@/components/form-field/FormField";
import { Button } from "@/components/ui/button";
import TrackTable from "../../components/TrackTable";
import AddToPlaylist from "../../components/AddToPlaylist";
import {
  addTrackToPlaylist,
  selectAllPlaylists,
  selectAllTracks,
} from "@/Redux/Slices/musichub/musicslice";
import { GENRES, type Genre } from "@/data/musichub/music";

type GenreFilter = "All" | Genre;
const GENRE_FILTERS: GenreFilter[] = ["All", ...GENRES];
const isGenre = (value: string): value is Genre =>
  (GENRES as readonly string[]).includes(value);

const SearchContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tracks = useSelector(selectAllTracks);
  const playlists = useSelector(selectAllPlaylists);

  const query = searchParams.get("q") ?? "";
  const genreParam = searchParams.get("genre") ?? "";
  const genre: GenreFilter = isGenre(genreParam) ? genreParam : "All";

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

      {/* Genre chips + result count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter by genre"
        >
          {GENRE_FILTERS.map((item) => {
            const isActive = genre === item;
            return (
              <Button
                key={item}
                type="button"
                role="tab"
                size="sm"
                aria-selected={genre === item}
                className={`shrink-0 rounded-full ${
                  isActive
                    ? "bg-brand text-foreground"
                    : "bg-hover text-muted-foreground hover:bg-hover"
                }`}
                onClick={() => updateParams({ genre: item })}
              >
                {item}
              </Button>
            );
          })}
        </div>
        <span className="text-sm text-muted-foreground">
          {results.length} results
        </span>
      </div>

      {/* Track table with an Add-to-playlist button on each row */}
      <TrackTable
        tracks={results}
        actionLabel="Add"
        emptyMessage="No tracks match your search."
        renderAction={(track) => (
          <AddToPlaylist
            track={track}
            playlists={playlists}
            onAdd={(playlistId) =>
              dispatch(addTrackToPlaylist({ playlistId, trackId: track.id }))
            }
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
