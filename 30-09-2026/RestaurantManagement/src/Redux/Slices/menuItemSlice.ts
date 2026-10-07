import {
  createSlice,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
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
      reducer(state, action: PayloadAction<MenuItem>) {
        state.menuItems.push(action.payload);
      },
      // id + dates are generated here so the reducer stays pure
      prepare(data: NewMenuItem) {
        return {
          payload: {
            id: nanoid(),
            ...data,
            createdAt: today(),
            updatedAt: today(),
          } as MenuItem,
        };
      },
    },
    updateMenuItem: {
      reducer(
        state,
        action: PayloadAction<{ id: string; data: NewMenuItem; updatedAt: string }>,
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
      prepare(payload: { id: string; data: NewMenuItem }) {
        return { payload: { ...payload, updatedAt: today() } };
      },
    },
    deleteMenuItem(state, action: PayloadAction<string>) {
      state.menuItems = state.menuItems.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMenuItem, updateMenuItem, deleteMenuItem } =
  menuItemSlice.actions;

export default menuItemSlice.reducer;