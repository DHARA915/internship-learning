// data/supplier/supplierdata.ts

export type SupplierStatus = "active" | "inactive";

export interface Supplier {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  status: SupplierStatus;
}

/** What the form edits (no id). */
export type SupplierInput = Omit<Supplier, "id">;

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Reliance Electronics",
    email: "sales@relianceelectronics.com",
    contact_number: "9876543210",
    status: "active",
  },
  {
    id: 2,
    name: "Urban Furnishings",
    email: "orders@urbanfurnishings.com",
    contact_number: "9876501234",
    status: "active",
  },
  {
    id: 3,
    name: "Sharma Traders",
    email: "contact@sharmatraders.com",
    contact_number: "9876512345",
    status: "active",
  },
  {
    id: 4,
    name: "TechWorld Distributors",
    email: "sales@techworlddistributors.com",
    contact_number: "9876523456",
    status: "active",
  },
  {
    id: 5,
    name: "Modern Home Supplies",
    email: "orders@modernhomesupplies.com",
    contact_number: "9876534567",
    status: "active",
  },
  {
    id: 6,
    name: "Galaxy Electronics",
    email: "sales@galaxyelectronics.com",
    contact_number: "9876545678",
    status: "active",
  },
  {
    id: 7,
    name: "Royal Furniture House",
    email: "info@royalfurniturehouse.com",
    contact_number: "9876556789",
    status: "active",
  },
  {
    id: 8,
    name: "Apex Electricals",
    email: "sales@apexelectricals.com",
    contact_number: "9876567890",
    status: "active",
  },
  {
    id: 9,
    name: "Comfort Furniture Works",
    email: "orders@comfortfurnitureworks.com",
    contact_number: "9876578901",
    status: "active",
  },
  {
    id: 10,
    name: "Digital Hub Distributors",
    email: "contact@digitalhubdistributors.com",
    contact_number: "9876589012",
    status: "active",
  },
  {
    id: 11,
    name: "Classic Furniture Mart",
    email: "sales@classicfurnituremart.com",
    contact_number: "9876590123",
    status: "active",
  },
  {
    id: 12,
    name: "ElectroMart India",
    email: "orders@electromartindia.com",
    contact_number: "9876601234",
    status: "active",
  },
  {
    id: 13,
    name: "Prime Office Furniture",
    email: "sales@primeofficefurniture.com",
    contact_number: "9876612345",
    status: "active",
  },
  {
    id: 14,
    name: "Bright Star Electronics",
    email: "info@brightstarelectronics.com",
    contact_number: "9876623456",
    status: "active",
  },
  {
    id: 15,
    name: "HomeStyle Suppliers",
    email: "orders@homestylesuppliers.com",
    contact_number: "9876634567",
    status: "active",
  },
  {
    id: 16,
    name: "Metro Electronics",
    email: "sales@metroelectronics.com",
    contact_number: "9876645678",
    status: "active",
  },
  {
    id: 17,
    name: "WoodCraft Furnishings",
    email: "contact@woodcraftfurnishings.com",
    contact_number: "9876656789",
    status: "active",
  },
  {
    id: 18,
    name: "NextGen Technology Supplies",
    email: "sales@nextgentechnologysupplies.com",
    contact_number: "9876667890",
    status: "active",
  },
  {
    id: 19,
    name: "Elegant Living Furniture",
    email: "orders@elegantlivingfurniture.com",
    contact_number: "9876678901",
    status: "active",
  },
  {
    id: 20,
    name: "National Electronics Supply",
    email: "sales@nationalsupply.com",
    contact_number: "9876689012",
    status: "active",
  },
  {
    id: 21,
    name: "Value Furniture Traders",
    email: "contact@valuefurnituretraders.com",
    contact_number: "9876690123",
    status: "active",
  },
  {
    id: 22,
    name: "SmartTech Solutions",
    email: "orders@smarttechsolutions.com",
    contact_number: "9876701234",
    status: "active",
  },
  {
    id: 23,
    name: "Heritage Furniture Co",
    email: "sales@heritagefurnitureco.com",
    contact_number: "9876712345",
    status: "active",
  },
  {
    id: 24,
    name: "Vertex Electronics",
    email: "info@vertexelectronics.com",
    contact_number: "9876723456",
    status: "active",
  },
  {
    id: 25,
    name: "Greenwood Home Supplies",
    email: "orders@greenwoodhomesupplies.com",
    contact_number: "9876734567",
    status: "active",
  },
];

/* ---------- form values (FormField gives strings) ---------- */

export type SupplierFormValues = SupplierInput;

export type SupplierErrors = Partial<
  Record<keyof SupplierFormValues, string>
>;

export const EMPTY_SUPPLIER_VALUES: SupplierFormValues = {
  name: "",
  email: "",
  contact_number: "",
  status: "active",
};

export const supplierToValues = (
  supplier: Supplier,
): SupplierFormValues => ({
  name: supplier.name,
  email: supplier.email,
  contact_number: supplier.contact_number,
  status: supplier.status,
});

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

/** `editingId` is the supplier being edited (null when adding), so it doesn't clash with itself. */
export const validateSupplier = (
  values: SupplierFormValues,
  existing: Supplier[],
  editingId: number | null,
): SupplierErrors => {
  const errors: SupplierErrors = {};
  const others = existing.filter((item) => item.id !== editingId);

  const name = values.name.trim();

  if (!name) errors.name = "Supplier name is required";
  else if (name.length < 2) errors.name = "Use at least 2 characters";
  else if (name.length > 60)
    errors.name = "Keep the name under 60 characters";
  else if (
    others.some(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    errors.name = "A supplier with this name already exists";
  }

  const email = values.email.trim();

  if (!email) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email))
    errors.email = "Enter a valid email address";
  else if (
    others.some(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    )
  ) {
    errors.email = "This email is already used by another supplier";
  }

  const contact = values.contact_number.trim();

  if (!contact) errors.contact_number = "Contact number is required";
  else if (!PHONE_PATTERN.test(contact))
    errors.contact_number = "Enter a valid 10-digit mobile number";
  else if (
    others.some((item) => item.contact_number === contact)
  ) {
    errors.contact_number =
      "This number is already used by another supplier";
  }

  return errors;
};