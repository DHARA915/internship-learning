import {
  PAYMENT_TERMS,
  daysBetween,
  isValidDate,
  type InvoiceDraft,
  type PaymentTerm,
} from "./invoicedata";

export type DetailsField =
  | "customer_id"
  | "invoice_number"
  | "invoice_date"
  | "payment_term"
  | "due_date"
  | "business_name"
  | "business_address"
  | "business_email"
  | "business_phone"
  | "notes";

export type DetailsErrors = Partial<Record<DetailsField, string>>;

export const isPaymentTerm = (value: string): value is PaymentTerm =>
  PAYMENT_TERMS.some((option) => option.value === value);

export const validateDetails = (draft: InvoiceDraft): DetailsErrors => {
  const errors: DetailsErrors = {};

  /* ---------- customer ---------- */
  if (draft.customer_id === null) errors.customer_id = "Select a customer";

  /* ---------- invoice number ---------- */
  const invoiceNumber = draft.invoice_number.trim();
  if (!invoiceNumber) errors.invoice_number = "Invoice number is required";
  else if (invoiceNumber.length > 30) errors.invoice_number = "Invoice number is too long";
  else if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(invoiceNumber))
    errors.invoice_number = "Use letters, numbers and dashes only";

  /* ---------- invoice date ---------- */
  if (!draft.invoice_date) errors.invoice_date = "Invoice date is required";
  else if (!isValidDate(draft.invoice_date)) errors.invoice_date = "Enter a valid date";

  /* ---------- payment term ---------- */
  if (!isPaymentTerm(draft.payment_term)) errors.payment_term = "Select payment terms";

  /* ---------- due date ---------- */
  if (!draft.due_date) errors.due_date = "Due date is required";
  else if (!isValidDate(draft.due_date)) errors.due_date = "Enter a valid date";
  else if (!errors.invoice_date && daysBetween(draft.invoice_date, draft.due_date) < 0)
    errors.due_date = "Due date can't be before the invoice date";

  /* ---------- business ---------- */
  const { name, address, email, phone } = draft.business;
  if (!name.trim()) errors.business_name = "Business name is required";
  if (!address.trim()) errors.business_address = "Address is required";

  if (!email.trim()) errors.business_email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.business_email = "Enter a valid email";

  if (!/^[6-9]\d{9}$/.test(phone.trim()))
    errors.business_phone = "Enter a valid 10-digit mobile number";

  /* ---------- notes ---------- */
  if (draft.notes.length > 500) errors.notes = "Notes can be at most 500 characters";

  return errors;
};

/* =====================================================================
   Items step (used by ItemsPanel)
   ===================================================================== */

type ItemId = InvoiceDraft["items"][number]["id"];

export type ItemField = "description" | "quantity" | "unit_price" | "discount";

export type ItemErrors = Partial<Record<ItemField, string>>;

export type ItemsErrors = {
  /** Problem with the list as a whole, e.g. no items. */
  general?: string;
  /** Errors for each line item, keyed by item id. */
  items: Record<ItemId, ItemErrors>;
};

export const validateItems = (draft: InvoiceDraft): ItemsErrors => {
  const errors: ItemsErrors = { items: {} };

  if (draft.items.length === 0) errors.general = "Add at least one item";

  draft.items.forEach((item) => {
    const itemErrors: ItemErrors = {};

    /* ---------- description ---------- */
    const description = item.description.trim();
    if (!description) itemErrors.description = "Description is required";
    else if (description.length > 200)
      itemErrors.description = "Description can be at most 200 characters";

    /* ---------- quantity ---------- */
    if (!(item.quantity > 0)) itemErrors.quantity = "Quantity must be at least 1";
    else if (!Number.isInteger(item.quantity))
      itemErrors.quantity = "Quantity must be a whole number";

    /* ---------- unit price ---------- */
    if (!(item.unit_price > 0)) itemErrors.unit_price = "Enter a price greater than 0";

    /* ---------- discount ---------- */
    if (item.discount < 0) itemErrors.discount = "Discount can't be negative";
    else if (item.discount > item.quantity * item.unit_price)
      itemErrors.discount = "Discount can't be more than the line amount";

    if (Object.keys(itemErrors).length > 0) errors.items[item.id] = itemErrors;
  });

  return errors;
};

/** true when validateItems found any problem */
export const hasItemsErrors = (errors: ItemsErrors): boolean =>
  !!errors.general || Object.keys(errors.items).length > 0;