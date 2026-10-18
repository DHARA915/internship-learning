// data/Inventory/productdata.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  sku: string;
  unitPrice: number;
  quantity: number;
  supplierId: number;
  image: string | null;
  created_at: string;
}

/** What the "add" form produces (no id / created_at). */
export type ProductInput = Omit<Product, "id" | "created_at">;

/** What "edit" may change: SKU and quantity are locked after creation. */
export type ProductChanges = Omit<ProductInput, "sku" | "quantity">;

/** The app starts with no products. */
export const products: Product[] = [];

/* ---------- form values (FormField gives strings) ---------- */

export type ProductFormValues = {
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  unitPrice: string;
  quantity: string;
  image: string; 
};

export type ProductErrors = Partial<Record<keyof ProductFormValues, string>>;

export const EMPTY_PRODUCT_VALUES: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "",
  supplierId: "",
  unitPrice: "",
  quantity: "",
  image: "",
};

export const productToValues = (product: Product): ProductFormValues => ({
  name: product.name,
  description: product.description,
  categoryId: String(product.categoryId),
  supplierId: String(product.supplierId),
  unitPrice: String(product.unitPrice),
  quantity: String(product.quantity),
  image: product.image ?? "",
});

/* ---------- image upload ---------- */

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

/** Returns an error message, or null when the file is fine. */
export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) return "Choose an image file (PNG, JPG, WEBP)";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 2 MB or smaller";
  return null;
};

/* ---------- SKU ---------- */

const skuPrefix = (categoryName: string) =>
  categoryName
    .replace(/[^a-z]/gi, "")
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, "X");

/**
 * Autogenerates a unique SKU like `PRD-ELE-0001`:
 * PRD + first 3 letters of the category + a running number per category prefix.
 */
export const generateSku = (categoryName: string, existing: Product[]): string => {
  const prefix = `PRD-${skuPrefix(categoryName)}-`;
  const used = new Set(existing.map((product) => product.sku));
  const format = (n: number) => `${prefix}${String(n).padStart(4, "0")}`;

  let highest = 0;
  for (const sku of used) {
    if (!sku.startsWith(prefix)) continue;
    const n = Number(sku.slice(prefix.length));
    if (Number.isInteger(n) && n > highest) highest = n;
  }

  let next = highest + 1;
  while (used.has(format(next))) next += 1;
  return format(next);
};

/* ---------- validation ---------- */

export const validateProduct = (
  values: ProductFormValues,
  mode: "add" | "edit",
  valid: { categoryIds: number[]; supplierIds: number[] },
): ProductErrors => {
  const errors: ProductErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Product name is required";
  else if (name.length < 2) errors.name = "Use at least 2 characters";
  else if (name.length > 60) errors.name = "Keep the name under 60 characters";

  if (values.description.trim().length > 300)
    errors.description = "Keep the description under 300 characters";

  if (!values.categoryId) errors.categoryId = "Choose a category";
  else if (!valid.categoryIds.includes(Number(values.categoryId)))
    errors.categoryId = "This category no longer exists";

  if (!values.supplierId) errors.supplierId = "Choose a supplier";
  else if (!valid.supplierIds.includes(Number(values.supplierId)))
    errors.supplierId = "This supplier no longer exists";

  const price = values.unitPrice.trim();
  if (!price) errors.unitPrice = "Unit price is required";
  else if (!/^\d+(\.\d{1,2})?$/.test(price)) errors.unitPrice = "Enter a valid price (up to 2 decimals)";
  else if (Number(price) <= 0) errors.unitPrice = "Price must be greater than 0";
  else if (Number(price) > 10_000_000) errors.unitPrice = "Price is too high";

  // quantity is only entered when adding; edit mode doesn't show it
  if (mode === "add") {
    const quantity = values.quantity.trim();
    if (!quantity) errors.quantity = "Quantity is required";
    else if (!/^\d+$/.test(quantity)) errors.quantity = "Enter a whole number";
    else if (Number(quantity) > 1_000_000) errors.quantity = "Quantity is too high";
  }

  return errors;
};