// Redux/Slices/categoryslice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { categories, type Category, type CategoryInput } from "@/data/Inventory/categorydata";
import type { RootState } from "@/Redux/store";

type CategoryState = { items: Category[] };

const initialState: CategoryState = { items: categories };

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // the timestamp is made in `prepare`, so the reducer itself stays pure
    categoryAdded: {
      reducer(state, action: PayloadAction<CategoryInput & { created_at: string }>) {
        const nextId = state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        state.items.push({ id: nextId, ...action.payload });
      },
      prepare(input: CategoryInput) {
        return { payload: { ...input, created_at: new Date().toISOString() } };
      },
    },

    categoryUpdated(state, action: PayloadAction<{ id: number; changes: CategoryInput }>) {
      const category = state.items.find((item) => item.id === action.payload.id);
      if (category) Object.assign(category, action.payload.changes);
    },

    // flips active <-> inactive (used by the switch in the table)
    categoryStatusToggled(state, action: PayloadAction<number>) {
      const category = state.items.find((item) => item.id === action.payload);
      if (category) category.status = category.status === "active" ? "inactive" : "active";
    },

    categoryDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { categoryAdded, categoryUpdated, categoryStatusToggled, categoryDeleted } =
  categorySlice.actions;
export default categorySlice.reducer;

/* ---------- selectors ---------- */
export const selectAllCategories = (state: RootState) => state.categories.items;

export const selectActiveCategories = (state: RootState) =>
  state.categories.items.filter((item) => item.status === "active");

export const selectCategoryById = (state: RootState, id: number) =>
  state.categories.items.find((item) => item.id === id);