import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  Menusectiondata,
  type MenuSection,
} from "../../utils/Menusectiondata";

interface MenuSectionState {
  menuSections: MenuSection[];
}

const initialState: MenuSectionState = {
  menuSections: Menusectiondata,
};

const menuSectionSlice = createSlice({
  name: "menuSections",

  initialState,

  reducers: {
    addMenuSection: (
      state,
      action: PayloadAction<
        Omit<MenuSection, "id" | "createdAt" | "updatedAt">
      >
    ) => {
      const now = new Date().toISOString();

      state.menuSections.push({
        id: Date.now(),
        ...action.payload,
        createdAt: now,
        updatedAt: now,
      });
    },

    updateMenuSection: (
      state,
      action: PayloadAction<{
        id: number;
        data: Partial<Omit<MenuSection, "id" | "createdAt">>;
      }>
    ) => {
      const section = state.menuSections.find(
        (section) => section.id === action.payload.id
      );

      if (section) {
        Object.assign(section, action.payload.data);
        section.updatedAt = new Date().toISOString();
      }
    },

    deleteMenuSection: (
      state,
      action: PayloadAction<number>
    ) => {
      state.menuSections = state.menuSections.filter(
        (section) => section.id !== action.payload
      );
    },
  },
});

export const {
  addMenuSection,
  updateMenuSection,
  deleteMenuSection,
} = menuSectionSlice.actions;

export default menuSectionSlice.reducer;