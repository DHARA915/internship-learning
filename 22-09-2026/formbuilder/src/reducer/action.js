// Action type constants — using these instead of raw strings means a typo
// like "ADD_FEILD" throws at import time instead of silently doing nothing.

export const ADD_FIELD = "ADD_FIELD";
export const UPDATE_FIELD = "UPDATE_FIELD";
export const DELETE_FIELD = "DELETE_FIELD";
export const MOVE_FIELD = "MOVE_FIELD";
export const DUPLICATE_FIELD = "DUPLICATE_FIELD";
export const LOAD_FIELDS = "LOAD_FIELDS";
export const RESET_FIELDS = "RESET_FIELDS";

// Action creators — components dispatch these instead of building
// action objects by hand, so the shape stays consistent everywhere.

export const addField = (field) => ({
  type: ADD_FIELD,
  payload: { field },
});

export const updateField = (id, changes) => ({
  type: UPDATE_FIELD,
  payload: { id, changes },
});

export const deleteField = (id) => ({
  type: DELETE_FIELD,
  payload: { id },
});

export const moveField = (id, direction) => ({
  type: MOVE_FIELD,
  payload: { id, direction }, // direction: "up" | "down"
});

export const duplicateField = (id) => ({
  type: DUPLICATE_FIELD,
  payload: { id },
});

export const loadFields = (fields) => ({
  type: LOAD_FIELDS,
  payload: { fields },
});

export const resetFields = () => ({
  type: RESET_FIELDS,
});