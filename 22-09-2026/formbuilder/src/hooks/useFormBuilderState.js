
import { useReducer, useState, useEffect } from "react";
import { formReducer, initialFieldsState } from "../reducer/formReducer";
import {
  addField,
  updateField,
  deleteField,
  moveField,
  duplicateField,
  loadFields,
  resetFields,
} from "../reducer/action";
import { createField } from "../utils/fieldTypes";

const STORAGE_KEY = "form-builder:fields";

function readStoredFields() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialFieldsState;
  } catch {
    return initialFieldsState;
  }
}

export function useFormBuilderState() {
  const [fields, dispatch] = useReducer(
    formReducer,
    initialFieldsState,
    readStoredFields // lazy initializer — runs once, reads localStorage on mount
  );

  const [selectedFieldId, setSelectedFieldId] = useState(null);

  // Persist to localStorage whenever fields change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {
      // storage full or unavailable — fail silently, not fatal to the app
    }
  }, [fields]);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  // Adds a field AND selects it in one call, so the settings panel
  // opens immediately for whatever was just added.
  function addAndSelectField(type) {
    const field = createField(type);
    dispatch(addField(field));
    setSelectedFieldId(field.id);
  }

  function editField(id, changes) {
    dispatch(updateField(id, changes));
  }

  function removeField(id) {
    dispatch(deleteField(id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }

  function reorderField(id, direction) {
    dispatch(moveField(id, direction));
  }

  function copyField(id) {
    dispatch(duplicateField(id));
  }

  function replaceAllFields(newFields) {
    dispatch(loadFields(newFields));
    setSelectedFieldId(null);
  }

  function clearAllFields() {
    dispatch(resetFields());
    setSelectedFieldId(null);
  }

  return {
    fields,
    selectedFieldId,
    selectedField,
    selectField: setSelectedFieldId,
    addAndSelectField,
    editField,
    removeField,
    reorderField,
    copyField,
    replaceAllFields,
    clearAllFields,
  };
}