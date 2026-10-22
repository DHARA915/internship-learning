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
        state.items.unshift(action.payload); // newest first
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
  },
});

export const { postAdded } = postSlice.actions;
export const selectAllPosts = (state: RootState) => state.blogs.items;
export default postSlice.reducer;