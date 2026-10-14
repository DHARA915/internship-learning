import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  events as seedEvents,
  parseAgenda,
  type CreateEventInput,
  type Event,
} from "../../data/events/events";

// ---------- agenda helpers (agenda is stored as one string: "a | b | c") ----------

export const AGENDA_SEPARATOR = " | ";

/** "a | b|c" -> ["a", "b", "c"] (trims and drops empty items) */
export const agendaToList = (agenda: string): string[] =>
  agenda
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

/** ["a", "b"] -> "a | b" (use this when saving from a form with one input per agenda item) */
export const listToAgenda = (items: string[]): string =>
  items
    .map((item) => item.trim().replace(/\|/g, "")) // an item can't contain the separator
    .filter(Boolean)
    .join(AGENDA_SEPARATOR);

// Normalise agenda formatting and keep price consistent with price_type
const normalize = <T extends Partial<CreateEventInput>>(data: T): T => {
  const next = { ...data };
  if (typeof next.agenda === "string") {
    next.agenda = listToAgenda(agendaToList(next.agenda));
  }
  if (next.price_type === "free") next.price = 0;
  return next;
};

interface EventsState {
  items: Event[];
}

const initialState: EventsState = {
  items: seedEvents,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // CREATE – server normally sets id & registered, so we mimic that here
    eventAdded(state, action: PayloadAction<CreateEventInput>) {
      const nextId = state.items.reduce((max, e) => Math.max(max, e.id), 0) + 1;
      state.items.push({
        ...(normalize(action.payload) as CreateEventInput),
        id: nextId,
        registered: 0,
      });
    },

    // UPDATE – partial changes by id
    eventUpdated(
      state,
      action: PayloadAction<{ id: number; changes: Partial<CreateEventInput> }>,
    ) {
      const { id, changes } = action.payload;
      const index = state.items.findIndex((e) => e.id === id);
      if (index === -1) return;

      const merged = { ...state.items[index], ...normalize(changes) };
      // registered can never exceed capacity
      merged.registered = Math.min(merged.registered, merged.capacity);
      state.items[index] = merged;
    },

    // DELETE
    eventDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },

    // Extras that fit this data model
    eventStatusToggled(state, action: PayloadAction<number>) {
      const event = state.items.find((e) => e.id === action.payload);
      if (event)
        event.status = event.status === "draft" ? "published" : "draft";
    },

    eventRegistered(state, action: PayloadAction<number>) {
      const event = state.items.find((e) => e.id === action.payload);
      if (event && event.registered < event.capacity) event.registered += 1;
    },

    // a booking was made: take its seats (never above capacity)
    seatsBooked(state, action: PayloadAction<{ id: number; tickets: number }>) {
      const event = state.items.find((e) => e.id === action.payload.id);
      if (event) {
        event.registered = Math.min(
          event.capacity,
          event.registered + action.payload.tickets,
        );
      }
    },

    // a booking was cancelled: give its seats back (never below 0)
    seatsReleased(
      state,
      action: PayloadAction<{ id: number; tickets: number }>,
    ) {
      const event = state.items.find((e) => e.id === action.payload.id);
      if (event) {
        event.registered = Math.max(
          0,
          event.registered - action.payload.tickets,
        );
      }
    },
  },
});

export const {
  eventAdded,
  eventUpdated,
  eventDeleted,
  eventStatusToggled,
  eventRegistered,
  seatsBooked,
  seatsReleased
} = eventsSlice.actions;

export default eventsSlice.reducer;

// ---------- selectors ----------

export const selectAllEvents = (state: RootState) => state.events.items;

export const selectEventById = (state: RootState, id: number) =>
  state.events.items.find((e) => e.id === id);

export const selectPublishedEvents = createSelector(
  [selectAllEvents],
  (items) => items.filter((e) => e.status === "published"),
);

/** Agenda of one event as a string[] (memoised, split on " | ") */
export const selectAgendaByEventId = createSelector(
  [selectEventById],
  (event) => (event ? parseAgenda(event) : []),
);
