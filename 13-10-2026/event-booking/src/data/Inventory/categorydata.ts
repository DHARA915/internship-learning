// data/category/categorydata.ts
export type CategoryStatus = "active" | "inactive";

export interface Category {
  id: number;
  name: string;
  status: CategoryStatus;
  created_at: string; 
}

/** What the form edits (no id / created_at). */
export type CategoryInput = Pick<Category, "name" | "status">;

export const isCategoryStatus = (value: string): value is CategoryStatus =>
  value === "active" || value === "inactive";

/** The two categories the app starts with. */
export const categories: Category[] = [
  { id: 1, name: "Electronics", status: "active", created_at: "2026-01-10T09:00:00.000Z" },
  { id: 2, name: "Furniture", status: "active", created_at: "2026-01-10T09:05:00.000Z" },
];

/* ---------- form values (FormField gives strings) ---------- */

export type CategoryFormValues = {
  name: string;
  status: string;
};

export type CategoryErrors = Partial<Record<keyof CategoryFormValues, string>>;

export const EMPTY_CATEGORY_VALUES: CategoryFormValues = {
  name: "",
  status: "active",
};

export const categoryToValues = (category: Category): CategoryFormValues => ({
  name: category.name,
  status: category.status,
});

/** `editingId` is the category being edited (null when adding), so it doesn't clash with itself. */
export const validateCategory = (
  values: CategoryFormValues,
  existing: Category[],
  editingId: number | null,
): CategoryErrors => {
  const errors: CategoryErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Category name is required";
  else if (name.length < 2) errors.name = "Use at least 2 characters";
  else if (name.length > 40) errors.name = "Keep the name under 40 characters";
  else if (
    existing.some((item) => item.id !== editingId && item.name.toLowerCase() === name.toLowerCase())
  )
    errors.name = "A category with this name already exists";

  if (!isCategoryStatus(values.status)) errors.status = "Choose a status";

  return errors;
};