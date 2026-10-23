"use client";

import { useState, type ReactNode } from "react";
import { Clock, GripVertical, Play } from "lucide-react";
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
  onReorder,
  emptyMessage = "No tracks found.",
}: TrackTableProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const drop = (target: number) => {
    if (dragIndex === null || dragIndex === target || !onReorder) return;
    const ids = tracks.map((track) => track.id);
    const [moved] = ids.splice(dragIndex, 1);
    ids.splice(target, 0, moved);
    onReorder(ids);
    setDragIndex(null);
  };

  if (tracks.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="[&>div]:overflow-visible">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 text-xs font-semibold">#</TableHead>
            <TableHead className="text-xs font-semibold">Title</TableHead>
            <TableHead className="hidden text-xs font-semibold sm:table-cell">Artist</TableHead>
            <TableHead className="hidden text-xs font-semibold md:table-cell">Album</TableHead>
            {showGenre && (
              <TableHead className="hidden text-xs font-semibold md:table-cell">Genre</TableHead>
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
          {tracks.map((track, index) => (
            <TableRow
              key={track.id}
              draggable={!!onReorder}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => onReorder && event.preventDefault()}
              onDrop={() => drop(index)}
              onDragEnd={() => setDragIndex(null)}
              className={cn("border-line", dragIndex === index && "opacity-40")}
            >
              <TableCell className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {onReorder && (
                    <GripVertical className="size-4 cursor-grab" aria-hidden="true" />
                  )}
                  {onPlay ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-full"
                      aria-label={`Play ${track.title}`}
                      onClick={() => onPlay(track)}
                    >
                      <Play className="size-3.5 fill-current" />
                    </Button>
                  ) : (
                    index + 1
                  )}
                </div>
              </TableCell>

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
                    <p className="truncate text-sm font-semibold">{track.title}</p>
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
                  <div className="flex justify-center">{renderAction(track)}</div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}