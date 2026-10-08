import {
  createSlice,
  createSelector,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { menuSeed, type Menu } from "../../utils/Menusectiondata";

export type NewMenu = Omit<Menu, "id" | "createdAt" | "updatedAt">;

interface MenuState {
  menus: Menu[];
}

const initialState: MenuState = { menus: menuSeed };

const today = () => new Date().toISOString().slice(0, 10);

const menuSectionSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    addMenu: {
      reducer(state, action: PayloadAction<Menu>) {
        state.menus.push(action.payload);
      },
      // id + dates are generated here so the reducer stays pure
      prepare(data: NewMenu) {
        return {
          payload: {
            id: nanoid(),
            ...data,
            createdAt: today(),
            updatedAt: today(),
          } as Menu,
        };
      },
    },
    updateMenu: {
      reducer(
        state,
        action: PayloadAction<{ id: string; data: NewMenu; updatedAt: string }>,
      ) {
        const { id, data, updatedAt } = action.payload;
        const i = state.menus.findIndex((m) => m.id === id);
        if (i !== -1)
          state.menus[i] = {
            id,
            ...data,
            createdAt: state.menus[i].createdAt,
            updatedAt,
          };
      },
      prepare(payload: { id: string; data: NewMenu }) {
        return { payload: { ...payload, updatedAt: today() } };
      },
    },
    deleteMenu(state, action: PayloadAction<string>) {
      state.menus = state.menus.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMenu, updateMenu, deleteMenu } = menuSectionSlice.actions;

/* selectors */
export const selectActiveMenus = createSelector(
  [(s: RootState) => s.menus.menus],
  (all) => all.filter((m) => m.status === "Active"),
);

export default menuSectionSlice.reducer;