"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { Headphones, Heart } from "lucide-react";
import {
  selectAllPlaylists,
  selectAllTracks,
} from "@/Redux/Slices/musichub/musicslice";

const LIKED_COUNT = 24;

export default function MusicHomePage() {
  const playlists = useSelector(selectAllPlaylists);
  const tracks = useSelector(selectAllTracks);

  const ids = new Set(tracks.map((track) => track.id));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 bg-background p-4 text-foreground sm:p-6">
      {/* Hero */}
      <section className="music-hero relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
        <svg
          aria-hidden="true"
          viewBox="0 0 800 160"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 w-full text-sidebar opacity-80"
        >
          <path
            fill="currentColor"
            d="M0 160V110l90-45 70 40 110-80 90 70 80-40 100 60 90-50 90 50 70-30v75z"
          />
        </svg>

        <div className="relative">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Good Evening
          </h1>

          <p className="mt-1 flex items-center gap-2 text-sm text-white/80 sm:text-base">
            Let&apos;s play some music
            <Headphones className="size-5" />
          </p>
        </div>
      </section>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Your Playlists
        </h2>

        <Link
          href="/music/playlists"
          className="text-sm text-muted-foreground transition-colors hover:text-brand"
        >
          See all
        </Link>
      </div>

      {/* Playlist grid */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Liked Songs */}
        <li className="group cursor-pointer">
          <Link href="/music/liked" className="block">
            <div className="flex aspect-[16/10] w-full bg-gradient-to-br from-violet-500 to-fuchsia items-center justify-center rounded-lg bg-brand-soft transition group-hover:brightness-110">
              <Heart className="size-9 fill-brand text-brand" />
            </div>

            <p className="mt-2 truncate text-sm font-semibold text-foreground">
              Liked Songs
            </p>

            <p className="text-xs text-muted-foreground">
              {LIKED_COUNT} tracks
            </p>
          </Link>
        </li>

        {/* Playlists */}
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            className="group cursor-pointer"
          >
            <Link
              href={`/music/playlists/${playlist.id}`}
              className="block"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-tertiary transition group-hover:brightness-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mt-2 truncate text-sm font-semibold text-foreground">
                {playlist.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {
                  playlist.trackIds.filter((id) =>
                    ids.has(id)
                  ).length
                }{" "}
                tracks
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}