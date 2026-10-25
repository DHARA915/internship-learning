import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { act } from "react";

type PlayerState = {
  queue: string[]; // track ids, in the order prev/next should follow
  currentId: string | null;
  isPlaying: boolean;
  progress: number; // seconds played, reported by the <audio> element
  session: number; // goes up whenever a song must start again from 0
};

const initialState: PlayerState = {
  queue: [],
  currentId: null,
  isPlaying: false,
  progress: 0,
  session: 0,
};

const move = (state: PlayerState, step: 1 | -1) => {
  const index = state.currentId ? state.queue.indexOf(state.currentId) : -1;

  if (index === -1) return;

  state.currentId =
    state.queue[(index + step + state.queue.length) % state.queue.length];
  state.progress = 0;
  state.isPlaying = true;
  state.session += 1;
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playQueue(
      state,
      action: PayloadAction<{ queue: string[]; trackId: string }>,
    ) {
      state.queue = action.payload.queue;
      state.currentId = action.payload.trackId;
      state.progress = 0;
      state.isPlaying = true;
      state.session += 1;
    },

    togglePlay(state) {
      if (state.currentId) state.isPlaying = !state.isPlaying;
    },

    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    nextTrack(state) {
      move(state, 1);
    },
    prevTrack(state) {
      if (state.progress > 3) {
        state.progress = 0;
        state.isPlaying = true;
        state.session += 1;
      } else {
        move(state, -1);
      }
    },
  },
});

export const { playQueue,togglePlay,setProgress,nextTrack,prevTrack } = playerSlice.actions;

export default playerSlice.reducer