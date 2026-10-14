import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { registrations, type NewRegistration } from "@/data/registration/registrationdata";

const registrationsSlice = createSlice({
  name: "registrations",
  initialState: { items: registrations },
  reducers: {
    registrationAdded(state, action: PayloadAction<NewRegistration>) {
      const nextId = state.items.reduce((max, r) => Math.max(max, r.id), 0) + 1;
      state.items.push({ ...action.payload, id: nextId });
    },
    // cancel = remove the booking from the list
    registrationRemoved(state, action: PayloadAction<number>) {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
  },
});

export const { registrationAdded, registrationRemoved } = registrationsSlice.actions;
export default registrationsSlice.reducer;

export const selectAllRegistrations = (state: RootState) => state.registrations.items;