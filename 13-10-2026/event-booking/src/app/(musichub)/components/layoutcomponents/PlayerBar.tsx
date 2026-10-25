"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Music, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/Redux/store";
import { selectTrackById } from "@/Redux/Slices/musichub/musicslice";
import { nextTrack,prevTrack,setProgress,togglePlay } from "@/Redux/Slices/musichub/playerslice";

// one sample file plays for every song until tracks get their own audio
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function PlayerBar() {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0); // length of the real audio file

  const { currentId, isPlaying, progress, session } = useSelector(
    (state: RootState) => state.player,
  );
  const track = useSelector((state: RootState) =>
    currentId ? selectTrackById(state, currentId) : undefined,
  );

  // a new song was picked (or Previous/Next pressed): start the audio from 0
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || session === 0) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [session]);

  // play / pause button
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  const handleSeek = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    dispatch(setProgress(seconds));
  };

  const total = duration || track?.duration || 0;

  return (
    <>
      {/* always mounted, so playback is not cut when the bar re-renders */}
      <audio
        ref={audioRef}
        src={SAMPLE_AUDIO}
        preload="auto"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => dispatch(setProgress(Math.floor(event.currentTarget.currentTime)))}
        onEnded={() => dispatch(nextTrack())}
      />

      {track && (
        <footer className="flex h-[var(--player-height)] shrink-0 items-center gap-4 border-t border-line bg-player px-4">
          {/* current song */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {track.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={track.coverUrl}
                alt=""
                className="size-12 shrink-0 rounded-md bg-tertiary object-cover"
              />
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-tertiary text-muted-foreground">
                <Music className="size-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{track.title}</p>
              <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          {/* controls + progress */}
          <div className="flex w-full max-w-md flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous"
                onClick={() => dispatch(prevTrack())}
              >
                <SkipBack />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={() => dispatch(togglePlay())}
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next"
                onClick={() => dispatch(nextTrack())}
              >
                <SkipForward />
              </Button>
            </div>
            <div className="hidden w-full items-center gap-2 text-xs text-muted-foreground tabular-nums sm:flex">
              <span>{formatTime(progress)}</span>
              <input
                type="range"
                aria-label="Seek"
                min={0}
                max={total}
                value={Math.min(progress, total)}
                onChange={(event) => handleSeek(Number(event.target.value))}
                className="h-1 w-full accent-brand"
              />
              <span>{formatTime(total)}</span>
            </div>
          </div>

          <div className="hidden flex-1 lg:block" />
        </footer>
      )}
    </>
  );
}