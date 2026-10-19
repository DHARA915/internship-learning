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
/** Seed data: 10 Electronics (categoryId 1) + 10 Furniture (categoryId 2). */
export const products: Product[] = [
  /* ---------- Electronics ---------- */
  {
    id: 1,
    name: "Wireless Mouse",
    description: "2.4 GHz wireless optical mouse with silent clicks.",
    categoryId: 1,
    sku: "PRD-ELE-0001",
    unitPrice: 799,
    quantity: 120,
    supplierId: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4mqMgqNZWJUbkMrSfR6xJ9j-Jube1Ig-zls8TqOuXDg&s=10",
    created_at: "2026-09-01T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    description: "87-key mechanical keyboard with blue switches and backlight.",
    categoryId: 1,
    sku: "PRD-ELE-0002",
    unitPrice: 3499,
    quantity: 45,
    supplierId: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0MtFdceTNcLdgAEr6_t8fwtcBzS4wlXjQ5uEMH7dbdQ&s=10",
    created_at: "2026-09-01T09:05:00.000Z",
  },
  {
    id: 3,
    name: "27-inch LED Monitor",
    description: "Full HD IPS monitor with 75 Hz refresh rate.",
    categoryId: 1,
    sku: "PRD-ELE-0003",
    unitPrice: 12999,
    quantity: 18,
    supplierId: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsXUMo8TgdKvtL9XrTzcLtR46CqzSV-BeaTydcD2ZWWQ&s=10",
    created_at: "2026-09-02T10:00:00.000Z",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    description: "Portable waterproof speaker with 12 hours of battery life.",
    categoryId: 1,
    sku: "PRD-ELE-0004",
    unitPrice: 2499,
    quantity: 60,
    supplierId: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5JJ-aaiWBz9qnVi0J0HTyZ8mxGutW18fOmY1b2gi6DA&s=10",
    created_at: "2026-09-02T10:10:00.000Z",
  },
  {
    id: 5,
    name: "USB-C Fast Charger 65W",
    description: "GaN wall charger for laptops, tablets and phones.",
    categoryId: 1,
    sku: "PRD-ELE-0005",
    unitPrice: 1899,
    quantity: 150,
    supplierId: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqZNHYe0UX2Kv3CwlGXeb3ZlimTtad-hVkUPB4QBTPFQ&s=10",
    created_at: "2026-09-03T11:00:00.000Z",
  },
  {
    id: 6,
    name: "Noise Cancelling Headphones",
    description: "Over-ear wireless headphones with active noise cancellation.",
    categoryId: 1,
    sku: "PRD-ELE-0006",
    unitPrice: 7999,
    quantity: 32,
    supplierId: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP7MLNGU_EEgP_rz7sqw8eKVj6rQUWITNGC6pmbz20Dg&s=10",
    created_at: "2026-09-03T11:15:00.000Z",
  },
  {
    id: 7,
    name: "1080p Webcam",
    description: "Full HD webcam with built-in microphone and privacy cover.",
    categoryId: 1,
    sku: "PRD-ELE-0007",
    unitPrice: 2199,
    quantity: 75,
    supplierId: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDhrLMmk9zg39G66UUV737-KLlc0Htr1JB43cKia3hkA&s=10",
    created_at: "2026-09-04T09:30:00.000Z",
  },
  {
    id: 8,
    name: "Power Bank 20000mAh",
    description: "Dual-port power bank with 22.5W fast charging.",
    categoryId: 1,
    sku: "PRD-ELE-0008",
    unitPrice: 1999,
    quantity: 90,
    supplierId: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc9ChAHAdCIB-EXBf5ygZ0qf7Hxp6UtsXhdGOcAyje-g&s=10",
    created_at: "2026-09-04T09:45:00.000Z",
  },
  {
    id: 9,
    name: "Smart LED Bulb",
    description: "9W Wi-Fi color bulb, works with voice assistants.",
    categoryId: 1,
    sku: "PRD-ELE-0009",
    unitPrice: 599,
    quantity: 200,
    supplierId: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSePhcU98LMCNnVoEwZtc9wfElnIqyMwhuJqoSknJQViQ&s=10",
    created_at: "2026-09-05T08:00:00.000Z",
  },
  {
    id: 10,
    name: "External SSD 1TB",
    description: "Portable USB 3.2 solid state drive, up to 1000 MB/s.",
    categoryId: 1,
    sku: "PRD-ELE-0010",
    unitPrice: 8499,
    quantity: 25,
    supplierId: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSps47VAxPuJbqxE2QbWh7jGPsDnyJmdKBC2x5LrvIQBA&s=10",
    created_at: "2026-09-05T08:20:00.000Z",
  },

  /* ---------- Furniture ---------- */
  {
    id: 11,
    name: "Ergonomic Office Chair",
    description: "Mesh back chair with lumbar support and adjustable armrests.",
    categoryId: 2,
    sku: "PRD-FUR-0001",
    unitPrice: 8999,
    quantity: 28,
    supplierId: 4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGmrUW62RHADEjO2vhG9fMFjgl0yaN6eRnnFhq1uwSAg&s=10",
    created_at: "2026-09-06T09:00:00.000Z",
  },
  {
    id: 12,
    name: "Standing Desk",
    description: "Electric height-adjustable desk, 140 x 70 cm top.",
    categoryId: 2,
    sku: "PRD-FUR-0002",
    unitPrice: 21999,
    quantity: 12,
    supplierId: 4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLined8k0-PjjHesbi-XFTboNMM8-U1tAuDb_JM2BurQ&s=10",
    created_at: "2026-09-06T09:10:00.000Z",
  },
  {
    id: 13,
    name: "Bookshelf 5-Tier",
    description: "Engineered wood bookshelf with five open shelves.",
    categoryId: 2,
    sku: "PRD-FUR-0003",
    unitPrice: 4599,
    quantity: 20,
    supplierId: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzxFXgu4mm85Ea3_bcq4bCqO8A9IrwOoP_RGJT8C_C9Q&s=10",
    created_at: "2026-09-07T10:00:00.000Z",
  },
  {
    id: 14,
    name: "Wooden Dining Table",
    description: "Six-seater solid sheesham wood dining table.",
    categoryId: 2,
    sku: "PRD-FUR-0004",
    unitPrice: 32999,
    quantity: 6,
    supplierId: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXqH7bOaq4SXGC-el3Zfw-XRdyfyB8qfd8ukc05pjo6w&s=10",
    created_at: "2026-09-07T10:30:00.000Z",
  },
  {
    id: 15,
    name: "3-Seater Fabric Sofa",
    description: "Comfortable sofa with removable cushion covers.",
    categoryId: 2,
    sku: "PRD-FUR-0005",
    unitPrice: 27999,
    quantity: 8,
    supplierId: 4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkMnQNe90FmTtsZ8dsPEWcKZtaTcpldIUq2gQEpRQHlg&s=10",
    created_at: "2026-09-08T11:00:00.000Z",
  },
  {
    id: 16,
    name: "Queen Size Bed Frame",
    description: "Sturdy wooden bed frame with a padded headboard.",
    categoryId: 2,
    sku: "PRD-FUR-0006",
    unitPrice: 24999,
    quantity: 9,
    supplierId: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4HOx2K3DtHiDdrCazpTk_vDd_aoyY-jFxBS0_TM-1Kg&s=10",
    created_at: "2026-09-08T11:20:00.000Z",
  },
  {
    id: 17,
    name: "TV Unit with Storage",
    description: "Wall-mounted TV cabinet with two drawers and open shelves.",
    categoryId: 2,
    sku: "PRD-FUR-0007",
    unitPrice: 9499,
    quantity: 15,
    supplierId: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc8dXqWVEODBu5QHN_cODTFtigoVe7r1L6bV5dSPdvQg&s=10",
    created_at: "2026-09-09T09:15:00.000Z",
  },
  {
    id: 18,
    name: "Study Table with Drawer",
    description: "Compact study desk with one drawer and cable hole.",
    categoryId: 2,
    sku: "PRD-FUR-0008",
    unitPrice: 5999,
    quantity: 35,
    supplierId: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-mDeuIF9d91d26z6fJZ81iivmJURG4CcTRvpGZwUsQ&s=10",
    created_at: "2026-09-09T09:40:00.000Z",
  },
  {
    id: 19,
    name: "Shoe Rack 4-Layer",
    description: "Metal and wood shoe rack, holds up to 12 pairs.",
    categoryId: 2,
    sku: "PRD-FUR-0009",
    unitPrice: 1799,
    quantity: 55,
    supplierId: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDruZ3PBbl4i5hhi0I21XHN-OwzVqYhbm6AbFo0PQXgQ&s=10",
    created_at: "2026-09-10T08:30:00.000Z",
  },
  {
    id: 20,
    name: "Bedside Table",
    description: "Two-drawer nightstand with a matte finish.",
    categoryId: 2,
    sku: "PRD-FUR-0010",
    unitPrice: 3299,
    quantity: 0,
    supplierId: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMTqN4o7K-c_mlKZ5rgZunnTIWvBn9e1OPPekfP0BDCA&s=10",
    created_at: "2026-09-10T08:50:00.000Z",
  },
];
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
    if (!quantity) errors.quantity = "Total Quantity is required";
    else if (!/^\d+$/.test(quantity)) errors.quantity = "Enter a whole number";
    else if (Number(quantity) > 1_000_000) errors.quantity = "Total Quantity is too high";
  }

  return errors;
};