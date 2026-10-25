import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/Redux/store";

import {
  tracks as initialTracks,
  playlists as initialPlaylists,
} from "@/data/musichub/music";
import type {
  Track,
  Playlist,
  MusicState,
  CreateTrackInput,
  CreatePlaylistInput,
} from "@/data/musichub/music";

const initialState: MusicState = {
  tracks: initialTracks,
  playlists: initialPlaylists,
  likedTrackIds: [],
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    //  For Track.........................................................................................

    addTrack: (state, action: PayloadAction<CreateTrackInput>) => {
      const newTrack: Track = {
        id: `track-${crypto.randomUUID()}`,
        ...action.payload,
      };
      state.tracks.push(newTrack);
    },

    updateTrack: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Track, "id">>;
      }>,
    ) => {
      const { id, changes } = action.payload;

      const track = state.tracks.find((track) => track.id === id);
      if (!track) return;
      Object.assign(track, changes);
    },

    deleteTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;

      // Remove track
      state.tracks = state.tracks.filter((track) => track.id !== trackId);

      // Remove track from all playlists
      state.playlists.forEach((playlist) => {
        playlist.trackIds = playlist.trackIds.filter((id) => id !== trackId);
      });
    },

    // For Playlist...................................................................................
    addPlaylist: (state, action: PayloadAction<CreatePlaylistInput>) => {
      const newPlaylist: Playlist = {
        id: `playlist-${crypto.randomUUID()}`,
        ...action.payload,
      };

      state.playlists.push(newPlaylist);
    },

    updatePlaylist: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Playlist, "id">>;
      }>,
    ) => {
      const { id, changes } = action.payload;

      const playlist = state.playlists.find((playlist) => playlist.id === id);

      if (!playlist) return;

      Object.assign(playlist, changes);
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      const playlistId = action.payload;

      state.playlists = state.playlists.filter(
        (playlist) => playlist.id !== playlistId,
      );
    },

    // playlist tracks.........................................................................
    addTrackToPlaylist: (
      state,
      action: PayloadAction<{
        playlistId: string;
        trackId: string;
      }>,
    ) => {
      const { playlistId, trackId } = action.payload;

      const playlist = state.playlists.find(
        (playlist) => playlist.id === playlistId,
      );

      if (!playlist) return;

      // Check whether track exists
      const trackExists = state.tracks.some((track) => track.id === trackId);

      if (!trackExists) return;

      // Don't add duplicate track
      if (playlist.trackIds.includes(trackId)) {
        return;
      }

      playlist.trackIds.push(trackId);
    },

    removeTrackFromPlaylist: (
      state,
      action: PayloadAction<{
        playlistId: string;
        trackId: string;
      }>,
    ) => {
      const { playlistId, trackId } = action.payload;

      const playlist = state.playlists.find(
        (playlist) => playlist.id === playlistId,
      );

      if (!playlist) return;

      playlist.trackIds = playlist.trackIds.filter((id) => id !== trackId);
    },

    // For Reordering...............................................
    reorderPlaylistTracks: (
      state,
      action: PayloadAction<{
        playlistId: string;
        trackIds: string[];
      }>,
    ) => {
      const { playlistId, trackIds } = action.payload;

      const playlist = state.playlists.find(
        (playlist) => playlist.id === playlistId,
      );

      if (!playlist) return;

      playlist.trackIds = trackIds;
    },

    // ToggleLikedTrack
    toggleLikedTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;

      if (!state.likedTrackIds) {
        state.likedTrackIds = [];
      }

      if (state.likedTrackIds.includes(trackId)) {
        state.likedTrackIds = state.likedTrackIds.filter(
          (id) => id !== trackId,
        );
      } else {
        state.likedTrackIds.push(trackId);
      }
    },

    clearLikedTracks:(state)=>{
      state.likedTrackIds = [];
    }

  },
});

export const {
  addTrack,
  updateTrack,
  deleteTrack,

  addPlaylist,
  updatePlaylist,
  deletePlaylist,

  addTrackToPlaylist,
  removeTrackFromPlaylist,
  reorderPlaylistTracks,

  toggleLikedTrack,
  clearLikedTracks
} = musicSlice.actions;

export default musicSlice.reducer;

export const selectAllTracks = (state: RootState) => state.music.tracks;
export const selectAllPlaylists = (state: RootState) => state.music.playlists;
export const selectTrackById = (state: RootState, id: string) =>
  state.music.tracks.find((track) => track.id === id);
export const selectPlaylistById = (state: RootState, id: string) =>
  state.music.playlists.find((playlist) => playlist.id === id);

export const selectLikedTrackIds = (state: RootState) =>
  state.music.likedTrackIds;

export const selectLikedTracks = (state: RootState) => {
  const likedIds = new Set(state.music.likedTrackIds);

  return state.music.tracks.filter((track) => likedIds.has(track.id));
};
