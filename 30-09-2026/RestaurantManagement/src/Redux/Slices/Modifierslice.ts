import {
  createSlice,
  createSelector,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  modifierSeed,
  type ModifierGroup,
} from "../../utils/Modifierdata";

export type NewModifier = Omit<ModifierGroup, "id">;

interface ModifierState {
  modifiers: ModifierGroup[];
}

const initialState: ModifierState = { modifiers: modifierSeed };

const modifierSlice = createSlice({
  name: "modifiers",
  initialState,
  reducers: {
    addModifier: {
      reducer(state, action: PayloadAction<ModifierGroup>) {
        state.modifiers.push(action.payload);
      },
      // always issue fresh ids so two groups never share option ids
      prepare(data: NewModifier) {
        return {
          payload: {
            id: nanoid(),
            ...data,
            options: data.options.map((o) => ({ ...o, id: nanoid() })),
          },
        };
      },
    },
    updateModifier(
      state,
      action: PayloadAction<{ id: string; data: NewModifier }>,
    ) {
      const { id, data } = action.payload;
      const i = state.modifiers.findIndex((m) => m.id === id);
      if (i !== -1) state.modifiers[i] = { id, ...data };
    },
    deleteModifier(state, action: PayloadAction<string>) {
      state.modifiers = state.modifiers.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addModifier, updateModifier, deleteModifier } =
  modifierSlice.actions;

/* selectors */
const selectAll = (s: RootState) => s.modifiers.modifiers;
export const selectActiveModifiers = createSelector([selectAll], (all) =>
  all.filter((m) => m.status === "Active"),
);

export const selectModifiersForSection = createSelector(
  [selectActiveModifiers, (_s: RootState, menuSectionId?: number) => menuSectionId],
  (active, menuSectionId) =>
    menuSectionId == null
      ? active
      : active.filter((m) => m.menuSectionIds.includes(menuSectionId)),
);

export default modifierSlice.reducer;