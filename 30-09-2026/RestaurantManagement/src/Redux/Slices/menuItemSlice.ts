import {
  createSlice,
  createSelector,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { menuItemSeed, type MenuItem } from "../../utils/MenuItemdata";

export type NewMenuItem = Omit<MenuItem, "id" | "createdAt" | "updatedAt">;

interface MenuItemState {
  menuItems: MenuItem[];
}

const initialState: MenuItemState = { menuItems: menuItemSeed };

const today = () => new Date().toISOString().slice(0, 10);

const menuItemSlice = createSlice({
  name: "menuItems",
  initialState,
  reducers: {
    addMenuItem: {
      reducer(state, action: PayloadAction<NewMenuItem & { createdAt: string; updatedAt: string }>) {
        const id = Math.max(0, ...state.menuItems.map((m) => m.id)) + 1;
        state.menuItems.push({ id, ...action.payload });
      },
      // dates are added here so the reducer stays pure
      prepare(data: NewMenuItem) {
        return { payload: { ...data, createdAt: today(), updatedAt: today() } };
      },
    },
    updateMenuItem: {
      reducer(
        state,
        action: PayloadAction<{ id: number; data: NewMenuItem; updatedAt: string }>,
      ) {
        const { id, data, updatedAt } = action.payload;
        const i = state.menuItems.findIndex((m) => m.id === id);
        if (i !== -1)
          state.menuItems[i] = {
            id,
            ...data,
            createdAt: state.menuItems[i].createdAt,
            updatedAt,
          };
      },
      prepare(payload: { id: number; data: NewMenuItem }) {
        return { payload: { ...payload, updatedAt: today() } };
      },
    },
    deleteMenuItem(state, action: PayloadAction<number>) {
      state.menuItems = state.menuItems.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMenuItem, updateMenuItem, deleteMenuItem } =
  menuItemSlice.actions;

// /* selectors */
// const selectAll = (s: RootState) => s.menuItems.menuItems;
// export const selectActiveMenuItems = createSelector([selectAll], (all) =>
//   all.filter((m) => m.status === "Active"),
// );

export default menuItemSlice.reducer;