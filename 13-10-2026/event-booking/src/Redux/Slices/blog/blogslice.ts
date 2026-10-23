import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/Redux/store";
import type { Post, PostInput } from "@/data/Blog/blogdata";

type PostState = { items: Post[] };
const initialState: PostState = { items: [] };

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.items.unshift(action.payload);
      },
      prepare(input: PostInput) {
        return {
          payload: {
            ...input,
            id: Date.now() + Math.floor(Math.random() * 1000),
            created_at: new Date().toISOString(),
          } satisfies Post,
        };
      },
    },
    postUpdated(state, action: PayloadAction<{ id: number; changes: PostInput }>) {
      const post = state.items.find((item) => item.id === action.payload.id);
      if (post) Object.assign(post, action.payload.changes);
    },

    postDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { postAdded,postUpdated,postDeleted } = postSlice.actions;
export const selectAllPosts = (state: RootState) => state.blogs.items;
export const selectPostById = (state: RootState, id: number) => state.blogs.items.find((item) => item.id === id);
export default postSlice.reducer;