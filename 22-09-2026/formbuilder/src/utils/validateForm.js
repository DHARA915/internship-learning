import { needsLengthValidation, needsRangeValidation } from "./fieldTypes";

// Returns an errors object keyed by field id, e.g. { "abc-123": "This field is required" }
// An empty object means the form is valid.
export function validateForm(fields, formValues) {
  const errors = {};

  for (const field of fields) {
    const value = formValues[field.id];
    const error = validateSingleField(field, value);
    if (error) errors[field.id] = error;
  }

  return errors;
}

function validateSingleField(field, value) {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return "This field is required.";
  }

  // Skip further checks on empty, non-required fields
  if (isEmpty) return null;

  if (field.type === "email" && !isValidEmail(value)) {
    return "Enter a valid email address.";
  }

  if (needsLengthValidation(field.type) && typeof value === "string") {
    if (field.minLength != null && value.length < field.minLength) {
      return `Must be at least ${field.minLength} characters.`;
    }
    if (field.maxLength != null && value.length > field.maxLength) {
      return `Must be no more than ${field.maxLength} characters.`;
    }
  }

  if (needsRangeValidation(field.type)) {
    const numericValue = Number(value);
    if (field.min != null && numericValue < field.min) {
      return `Must be at least ${field.min}.`;
    }
    if (field.max != null && numericValue > field.max) {
      return `Must be no more than ${field.max}.`;
    }
  }

  return null;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}