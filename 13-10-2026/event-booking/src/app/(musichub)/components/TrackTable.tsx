"use client";

import { useState, type ReactNode } from "react";
import { Clock, GripVertical, Pause, Play } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Track } from "@/data/musichub/music";

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

type TrackTableProps = {
  tracks: Track[];
  /** Last column (Add button, Delete button...). Leave out for no action column. */
  renderAction?: (track: Track) => ReactNode;
  actionLabel?: string;
  showGenre?: boolean;
  /** Shows a play button on each row. */
  onPlay?: (track: Track) => void;
  /** Called when the button of the song that is already current is pressed (pause / resume). */
  onTogglePlay?: () => void;
  /** The song loaded in the player bar; its row is highlighted. */
  currentId?: string | null;
  /** Whether the current song is playing right now (shows Pause instead of Play). */
  isPlaying?: boolean;
  /** Shows a drag handle; called with the new order of track ids. */
  onReorder?: (trackIds: string[]) => void;
  emptyMessage?: string;
};

export default function TrackTable({
  tracks,
  renderAction,
  actionLabel = "",
  showGenre = true,
  onPlay,
  onTogglePlay,
  currentId = null,
  isPlaying = false,
  onReorder,
  emptyMessage = "No tracks found.",
}: TrackTableProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const showNumber = !!onReorder;

  const drop = (target: number) => {
    if (dragIndex === null || dragIndex === target || !onReorder) return;
    const ids = tracks.map((track) => track.id);
    const [moved] = ids.splice(dragIndex, 1);
    ids.splice(target, 0, moved);
    onReorder(ids);
    setDragIndex(null);
  };

  if (tracks.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="[&>div]:overflow-visible">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {/* <TableHead className="w-14 text-xs font-semibold">#</TableHead> */}
            {showNumber && (
              <TableHead className="w-16 text-xs font-semibold">#</TableHead>
            )}
            <TableHead className="text-xs font-semibold">Title</TableHead>
            <TableHead className="hidden text-xs font-semibold sm:table-cell">
              Artist
            </TableHead>
            <TableHead className="hidden text-xs font-semibold md:table-cell">
              Album
            </TableHead>
            {showGenre && (
              <TableHead className="hidden text-xs font-semibold md:table-cell">
                Genre
              </TableHead>
            )}
            <TableHead className="w-16">
              <Clock className="size-4" aria-label="Duration" />
            </TableHead>
            {renderAction && (
              <TableHead className="w-16 text-center text-xs font-semibold">
                {actionLabel}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tracks.map((track, index) => {
            const isCurrent = track.id === currentId;
            const showPause = isCurrent && isPlaying;

            return (
              <TableRow
                key={track.id}
                draggable={!!onReorder}
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => onReorder && event.preventDefault()}
                onDrop={() => drop(index)}
                onDragEnd={() => setDragIndex(null)}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "border-line",
                  isCurrent && "bg-hover",
                  dragIndex === index && "opacity-40",
                )}
              >
                {showNumber && (
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {onReorder && (
                        <GripVertical
                          className="size-4 cursor-grab"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </TableCell>
                )}

                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.coverUrl}
                      alt=""
                      loading="lazy"
                      className="size-10 shrink-0 rounded-md bg-tertiary object-cover"
                    />
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "truncate text-sm font-semibold",
                          isCurrent && "text-brand",
                        )}
                      >
                        {track.title}
                      </p>
                      {/* artist moves under the title on phones */}
                      <p className="truncate text-xs text-muted-foreground sm:hidden">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden max-w-40 truncate text-sm text-muted-foreground sm:table-cell">
                  {track.artist}
                </TableCell>
                <TableCell className="hidden max-w-40 truncate text-sm text-muted-foreground md:table-cell">
                  {track.album}
                </TableCell>
                {showGenre && (
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="option">{track.genre}</Badge>
                  </TableCell>
                )}

                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {formatDuration(track.duration)}
                </TableCell>

                {renderAction && (
                  <TableCell>
                    <div className="flex justify-center">
                      {renderAction(track)}
                    </div>
                  </TableCell>
                )}
                {onPlay ? (
                  <TableCell>
                    <Button
                      type="button"
                      aria-label={`${showPause ? "Pause" : "Play"} ${track.title}`}
                      onClick={() =>
                        isCurrent && onTogglePlay
                          ? onTogglePlay()
                          : onPlay(track)
                      }
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105",
                        isCurrent
                          ? "bg-brand text-black"
                          : "bg-tertiary text-foreground hover:bg-brand hover:text-black",
                      )}
                    >
                      {showPause ? (
                        <Pause className="size-4 fill-current" />
                      ) : (
                        <Play className="size-4 fill-current" />
                      )}
                    </Button>
                  </TableCell>
                ) : (
                  index + 1
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
