"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { Headphones, Heart } from "lucide-react";
import { selectAllPlaylists, selectAllTracks } from "@/Redux/Slices/musichub/musicslice"; 

// your data has no "liked songs" yet, so set this from wherever you store likes
const LIKED_COUNT = 24;

export default function MusicHomePage() {
  const playlists = useSelector(selectAllPlaylists);
  const tracks = useSelector(selectAllTracks);

  // count only tracks that really exist
  const ids = new Set(tracks.map((track) => track.id));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Hero: sunset sky with a mountain silhouette */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950 via-purple-800 to-orange-400 px-6 py-8 text-white sm:px-8 sm:py-10">
        <svg
          aria-hidden="true"
          viewBox="0 0 800 160"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 w-full text-slate-950/80"
        >
          <path
            fill="currentColor"
            d="M0 160V110l90-45 70 40 110-80 90 70 80-40 100 60 90-50 90 50 70-30v75z"
          />
        </svg>

        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">Good Evening</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-white/85 sm:text-base">
            Let&apos;s play some music <Headphones className="size-5" />
          </p>
        </div>
      </section>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Playlists</h2>
        <Link href="/music/playlists" className="text-sm text-muted-foreground hover:text-foreground">
          See all
        </Link>
      </div>

      {/* Playlist grid */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Liked Songs */}
        <li className="group cursor-pointer">
          <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 transition group-hover:brightness-110">
            <Heart className="size-9 fill-white text-white" />
          </div>
          <p className="mt-2 truncate text-sm font-semibold">Liked Songs</p>
          <p className="text-xs text-muted-foreground">{LIKED_COUNT} tracks</p>
        </li>

        {playlists.map((playlist) => (
          <li key={playlist.id} className="group cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-lg bg-tertiary object-cover transition group-hover:brightness-110"
            />
            <p className="mt-2 truncate text-sm font-semibold">{playlist.name}</p>
            <p className="text-xs text-muted-foreground">
              {playlist.trackIds.filter((id) => ids.has(id)).length} tracks
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}