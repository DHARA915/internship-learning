import { useState } from "react";
import { PreviewField } from "./PreviewField";
import { validateForm } from "../utils/validateForm";
import { Button } from "../components/Button";

// props:
//   fields             — the field configs from useFormBuilderState
//   selectedFieldId    — currently selected field id (for the settings panel outline)
//   onSelectField(id)  — called when a field is clicked
//   onSubmit(data)     — called with formValues once validation passes
export function LiveFormPreview({ fields, selectedFieldId, onSelectField, onSubmit }) {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  function handleChange(fieldId, value) {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    // Clear that field's error as soon as the user edits it
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function toLabelledData(fields, formValues) {
  const labelled = {};
  for (const field of fields) {
    labelled[field.label] = formValues[field.id] ?? null;
  }
  return labelled;
}

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(fields, formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(toLabelledData(fields, formValues));
    }

  }

  function handleReset() {
    setFormValues({});
    setErrors({});
    onSubmit(null); // clears the submitted-data view too
  }

  if (fields.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
        Add a field from the palette to get started
      </div>
    );
  }

  console.log("Fields:" , fields)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {fields.map((field) => (
        <PreviewField
          key={field.id}
          field={field}
          value={formValues[field.id]}
          onChange={(value) => handleChange(field.id, value)}
          isSelected={field.id === selectedFieldId}
          onSelect={() => onSelectField(field.id)}
          error={errors[field.id]}
        />
      ))}

      <div className="mt-2 flex gap-2">

        <Button  type="submit" variant="primary" size="md" >
          Submit
        </Button>

        <Button  type="button" onClick={handleReset} variant="secondary" size="md" >
          Reset
        </Button>

    
      </div>
    </form>
  );
}