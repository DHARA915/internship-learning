import {
  ADD_FIELD,
  UPDATE_FIELD,
  DELETE_FIELD,
  MOVE_FIELD,
  DUPLICATE_FIELD,
  LOAD_FIELDS,
  RESET_FIELDS,
} from "./action";
import { cloneField } from "../utils/fieldTypes";

export const initialFieldsState = [];

export function formReducer(state, action) {
  switch (action.type) {
    case ADD_FIELD: {
      return [...state, action.payload.field];
    }

    case UPDATE_FIELD: {
      const { id, changes } = action.payload;
      return state.map((field) =>
        field.id === id ? { ...field, ...changes } : field
      );
    }

    case DELETE_FIELD: {
      return state.filter((field) => field.id !== action.payload.id);
    }

    case MOVE_FIELD: {
      const { id, direction } = action.payload;
      const index = state.findIndex((field) => field.id === id);
      if (index === -1) return state;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.length) return state;

      const next = [...state];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    }

    case DUPLICATE_FIELD: {
      const index = state.findIndex((field) => field.id === action.payload.id);
      if (index === -1) return state;

      const copy = cloneField(state[index]);
      const next = [...state];
      next.splice(index + 1, 0, copy);
      return next;
    }

    case LOAD_FIELDS: {
      return action.payload.fields;
    }

    case RESET_FIELDS: {
      return initialFieldsState;
    }

    default: {
      return state;
    }
  }
}