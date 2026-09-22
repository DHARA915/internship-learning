import { FIELD_TYPES } from "../utils/fieldTypes";
import { Button } from "../components/Button";

// props:
//   onAddField(type) — called with the field type string when a palette item is clicked
export function FieldPalette({ onAddField }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        Field types
      </p>
      <ul className="flex flex-col gap-1">
        {FIELD_TYPES?.map((fieldType) => (
          <li key={fieldType.type}>
            <Button type="button" onClick={() => onAddField(fieldType.type)}
 key={fieldType.value} 
             variant="list" size="list">
              {fieldType.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}