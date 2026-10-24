"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AudioLines, Home, ListPlus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { CommonDialog } from "@/components/CommonDialog";
import { fileToDataUrl } from "@/app/(Blogs)/components/RichTextEditor";
import {
  addPlaylist,
  selectAllPlaylists,
  selectAllTracks,
} from "@/Redux/Slices/musichub/musicslice";
const MUSIC_BASE = "/musichub";

const NAV = [
  { href: MUSIC_BASE, label: "Home", icon: Home, exact: true },
  { href: `${MUSIC_BASE}/search`, label: "Search", icon: Search, exact: false },
];

type SidebarProps = {
  /** called after a link is clicked (the mobile drawer uses it to close itself) */
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const playlists = useSelector(selectAllPlaylists);
  const tracks = useSelector(selectAllTracks);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // count only tracks that really exist
  const trackIds = new Set(tracks.map((track) => track.id));

  const isActive = (href: string, exact: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const openCreate = () => {
    setName("");
    setDescription("");
    setSubmitted(false);
    setIsCreateOpen(true);
  };

  const nameError = !name.trim() ? "Playlist name is required" : undefined;

  //convert file intol Url
  const handleCover = async (file: File | null) => {
    if (!file) {
      setCoverImage("");
      return;
    }

    const dataUrl = await fileToDataUrl(file, 1400, 0.8);
    setCoverImage(dataUrl);
  };

  // returning false keeps the dialog open
  const handleCreate = () => {
    setSubmitted(true);
    if (nameError) return false;

    dispatch(
      addPlaylist({
        name: name.trim(),
        description: description.trim(),
        trackIds: [],
        coverUrl:
          coverImage ||
          `https://picsum.photos/seed/${encodeURIComponent(name.trim())}/300/300`,
      }),
    );
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 bg-sidebar p-4">
      {/* Logo */}
      <Link
        href={MUSIC_BASE}
        onClick={onNavigate}
        className="flex items-center gap-2 px-2 text-lg font-bold"
      >
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

      {/* Playlists: one link per playlist in Redux */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Your Playlists
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Create playlist"
            onClick={openCreate}
          >
            <Plus />
          </Button>
        </div>

        <ul className="-mx-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1">
          {playlists.length === 0 && (
            <li className="px-2 py-3 text-xs text-muted-foreground">
              No playlists yet.
            </li>
          )}

          {playlists.map((playlist) => {
            const href = `${MUSIC_BASE}/playlist/${playlist.id}`;
            const active = pathname === href;
            const count = playlist.trackIds.filter((id) =>
              trackIds.has(id),
            ).length;

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={playlist.coverUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-md bg-tertiary object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {count} {count === 1 ? "track" : "tracks"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={openCreate}
      >
        <Plus /> Create Playlist
      </Button>

      {/* Create playlist */}
      <CommonDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        icon={<ListPlus />}
        title="Create New Playlist"
        description="Give your playlist a name. You can add songs from Search."
        saveLabel="Create Playlist"
        saveClassName="bg-brand text-brand-foreground hover:bg-brand/90"
        onSubmit={handleCreate}
      >
        <div className="flex flex-col gap-5">
          <FormField
            type="text"
            name="playlist-name"
            label="Name"
            placeholder="My Playlist"
            value={name}
            onChange={setName}
            error={submitted ? nameError : undefined}
            maxLength={40}
            required
          />
          <FormField
            type="textarea"
            name="playlist-description"
            label="Description (Optional)"
            placeholder="Add a short description..."
            value={description}
            onChange={setDescription}
          />
          <FormField
            type="file"
            name="playlist-cover"
            label="Cover Image (Optional)"
            value={coverImage}
            onFileChange={handleCover}
            maxSizeMB={5}
          />
        </div>
      </CommonDialog>
    </div>
  );
}
