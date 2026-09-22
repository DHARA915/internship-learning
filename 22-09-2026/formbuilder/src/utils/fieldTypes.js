// The list of field types available in the palette, each with
// sensible defaults for a newly added field of that type.

export const FIELD_TYPES = [
  { type: "text", label: "Text input" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "password", label: "Password" },
  { type: "textarea", label: "Textarea" },
  { type: "select", label: "Select" },
  { type: "radio", label: "Radio" },
  { type: "checkbox", label: "Checkbox" },
  { type: "date", label: "Date" },
];

// Types that need an options list (select / radio / checkbox groups)
const OPTION_TYPES = ["select", "radio", "checkbox"];

// Types where min/max LENGTH makes sense (text-like inputs)
const LENGTH_TYPES = ["text", "email", "password", "textarea"];

// Types where min/max VALUE makes sense
const RANGE_TYPES = ["number"];

export function needsOptions(type) {
  return OPTION_TYPES.includes(type);
}

export function needsLengthValidation(type) {
  return LENGTH_TYPES.includes(type);
}

export function needsRangeValidation(type) {
  return RANGE_TYPES.includes(type);
}

// Builds a brand-new field object when the user clicks a palette item.
// Called as: createField("select")
export function createField(type) {
  const meta = FIELD_TYPES.find((f) => f.type === type);

  return {
    id: crypto.randomUUID(),
    type,
    label: meta ? meta.label : "Untitled field",
    placeholder: "",
    required: false,
    options: needsOptions(type) ? ["Option 1", "Option 2"] : [],
    // Only meaningful for text-like types; stays null otherwise
    minLength: null,
    maxLength: null,
    // Only meaningful for number type; stays null otherwise
    min: null,
    max: null,
  };
}

// Used by DUPLICATE_FIELD — same config, new identity.
export function cloneField(field) {
  return {
    ...field,
    id: crypto.randomUUID(),
    label: field.label,
    options: [...field.options],
  };
}