import { needsOptions } from "../utils/fieldTypes";
import Input from "../components/Input";

// props:
//   field       — the field config object
//   value       — current form value for this field
//   onChange(value) — called when the user types/selects a new value
//   isSelected  — whether this field's settings panel is open
//   onSelect()  — called when the field wrapper is clicked
//   error       — validation error string, or null
export function PreviewField({ field, value, onChange, isSelected, onSelect, error }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-lg border p-3 transition-colors
        ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"}`}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      <FieldInput field={field} value={value} onChange={onChange} error={error} />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Maps field.type to the right HTML input, keeping the switch isolated
// from the selection/wrapper logic above.
function FieldInput({ field, value, onChange }) {
  const baseClasses =
    "w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const stop = (e) => e.stopPropagation(); // typing shouldn't re-trigger onSelect

  if (field.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        placeholder={field.placeholder}
        onClick={stop}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} min-h-[80px] resize-y`}
      />
    );
  }

  if (needsOptions(field.type) && field.type === "select") {
    return (
      <select
        value={value || ""}
        onClick={stop}
        onChange={(e) => onChange(e.target.value)}
        className={baseClasses}
      >
        <option value="" disabled>
          {field.placeholder || "Select an option"}
        </option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-col gap-1.5" onClick={stop}>
        {field.options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
            <Input
              type="radio"
              name={field.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
            
            />
            {option}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (option) => {
      onChange(
        selected.includes(option)
          ? selected.filter((v) => v !== option)
          : [...selected, option]
      );
    };
    return (
      <div className="flex flex-col gap-1.5" onClick={stop}>
        {field.options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
            <Input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              
            />
            {option}
          </label>
        ))}
      </div>
    );
  }

  // text, email, number, password, date all fall through to a plain input
  return (
    <Input
      type={field.type}
      value={value || ""}
      placeholder={field.placeholder}
      onClick={stop}
      onChange={(e) => onChange(e.target.value)}
      className={baseClasses}
    />
  );
}