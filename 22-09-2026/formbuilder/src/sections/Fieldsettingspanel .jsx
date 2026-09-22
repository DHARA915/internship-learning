import { needsOptions, needsLengthValidation, needsRangeValidation } from "../utils/fieldTypes";
import { OptionsEditor } from "./Optionseditor ";
import { Button } from "../components/Button";

// props:
//   field           — the currently selected field object, or null
//   onUpdateField(changes) — called with a partial object to merge into the field
//   onDeleteField() — removes this field entirely
//   onDuplicateField() — clones this field
//   onClose()       — closes the panel (deselects)
export function FieldSettingsPanel({ field, onUpdateField, onDeleteField, onDuplicateField, onClose }) {
  if (!field) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
        Select a field to edit its settings
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">Field settings</p>
        <Button onClick={onClose} type="button" variant="list" size="sm">
            ✕
        </Button>
        
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-gray-500">Label</span>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdateField({ label: e.target.value })}
          className={inputClasses}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-gray-500">Placeholder</span>
        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => onUpdateField({ placeholder: e.target.value })}
          className={inputClasses}
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onUpdateField({ required: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Required</span>
      </label>

      {needsLengthValidation(field.type) && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Min length</span>
            <input
              type="number"
              min="0"
              value={field.minLength ?? ""}
              onChange={(e) =>
                onUpdateField({ minLength: e.target.value === "" ? null : Number(e.target.value) })
              }
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Max length</span>
            <input
              type="number"
              min="0"
              value={field.maxLength ?? ""}
              onChange={(e) =>
                onUpdateField({ maxLength: e.target.value === "" ? null : Number(e.target.value) })
              }
              className={inputClasses}
            />
          </label>
        </div>
      )}

      {needsRangeValidation(field.type) && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Min value</span>
            <input
              type="number"
              value={field.min ?? ""}
              onChange={(e) =>
                onUpdateField({ min: e.target.value === "" ? null : Number(e.target.value) })
              }
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Max value</span>
            <input
              type="number"
              value={field.max ?? ""}
              onChange={(e) =>
                onUpdateField({ max: e.target.value === "" ? null : Number(e.target.value) })
              }
              className={inputClasses}
            />
          </label>
        </div>
      )}

      {needsOptions(field.type) && (
        <OptionsEditor
          options={field.options}
          onChange={(options) => onUpdateField({ options })}
        />
      )}

      <div className="flex gap-2 border-t border-gray-100 pt-3">

        <Button  type="button" variant="secondary" size="md"
          onClick={onDuplicateField} className="flex-1" >
          Duplicate
         </Button>
        <Button  type="button" variant="danger" className="flex-1" size="md"
          onClick={onDeleteField}>
          Delete
         </Button>

   
      </div>
    </div>
  );
}