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
  },
});

export const { registrationAdded } = registrationsSlice.actions;
export default registrationsSlice.reducer;

// export const selectAllRegistrations = (state: RootState) => state.registrations.items;
// export const selectRegistrationsByEvent = (state: RootState, eventId: number) =>
//   state.registrations.items.filter((r) => r.event_id === eventId);