export interface Customer {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export type PaymentTerm =
  | "due_on_receipt"
  | "net_7"
  | "net_15"
  | "net_30"
  | "net_45"
  | "net_60"
  | "custom";

export type InvoiceTemplate = "modern" | "minimal" | "elegant";
export type InvoiceTheme = "blue" | "purple" | "green" | "orange" | "slate";
export type InvoiceFont = "inter" | "serif" | "mono";

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number; // amount taken off this line, not a percentage
}

export interface BusinessInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface InvoiceDesign {
  template: InvoiceTemplate;
  theme: InvoiceTheme;
  font: InvoiceFont;
  logo: string; // image URL or data URL, "" = no logo
  show_notes: boolean;
  show_payment_terms: boolean;
  show_business_info: boolean;
}

export interface InvoiceDraft {
  customer_id: number | null;
  invoice_number: string;
  invoice_date: string; // yyyy-mm-dd
  due_date: string; // yyyy-mm-dd
  payment_term: PaymentTerm;
  business: BusinessInfo;
  notes: string;
  tax_rate: number; // percent, e.g. 8
  items: InvoiceItem[];
  design: InvoiceDesign;
}

export interface SavedInvoice extends InvoiceDraft {
  id: number;
  status: "draft" | "final";
  saved_at: string; 
}

// Customers
export const customers: Customer[] = [
  {
    id: 1,
    name: "Rahul Patel",
    address: "12, Satellite Road, Ahmedabad, Gujarat",
    email: "rahul.patel@example.com",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Priya Shah",
    address: "45, Alkapuri, Vadodara, Gujarat",
    email: "priya.shah@example.com",
    phone: "9876501234",
  },
  {
    id: 3,
    name: "Amit Desai",
    address: "23, Vesu, Surat, Gujarat",
    email: "amit.desai@example.com",
    phone: "9876512345",
  },
  {
    id: 4,
    name: "Neha Mehta",
    address: "18, Navrangpura, Ahmedabad, Gujarat",
    email: "neha.mehta@example.com",
    phone: "9876523456",
  },
  {
    id: 5,
    name: "Karan Joshi",
    address: "67, Gotri Road, Vadodara, Gujarat",
    email: "karan.joshi@example.com",
    phone: "9876534567",
  },
  {
    id: 6,
    name: "Anjali Trivedi",
    address: "34, Adajan, Surat, Gujarat",
    email: "anjali.trivedi@example.com",
    phone: "9876545678",
  },
  {
    id: 7,
    name: "Vivek Parmar",
    address: "56, Maninagar, Ahmedabad, Gujarat",
    email: "vivek.parmar@example.com",
    phone: "9876556789",
  },
  {
    id: 8,
    name: "Sneha Patel",
    address: "29, Karelibaug, Vadodara, Gujarat",
    email: "sneha.patel@example.com",
    phone: "9876567890",
  },
  {
    id: 9,
    name: "Rohan Shah",
    address: "81, Piplod, Surat, Gujarat",
    email: "rohan.shah@example.com",
    phone: "9876578901",
  },
];

/** days = null means the user picks the due date themselves */
export const PAYMENT_TERMS: { label: string; value: PaymentTerm; days: number | null }[] = [
  { label: "Due on receipt", value: "due_on_receipt", days: 0 },
  { label: "Net 7", value: "net_7", days: 7 },
  { label: "Net 15", value: "net_15", days: 15 },
  { label: "Net 30", value: "net_30", days: 30 },
  { label: "Net 45", value: "net_45", days: 45 },
  { label: "Net 60", value: "net_60", days: 60 },
  { label: "Custom", value: "custom", days: null },
];

/** Valid tax rates (percent). Edit this list to change what the dropdown offers. */
export const TAX_RATES: { label: string; value: number }[] = [
  { label: "No tax (0%)", value: 0 },
  { label: "GST 5%", value: 5 },
  { label: "GST 12%", value: 12 },
  { label: "GST 18%", value: 18 },
  { label: "GST 28%", value: 28 },
];


/* ---------- date helpers (yyyy-mm-dd strings, no timezone surprises) ---------- */

const DAY_MS = 24 * 60 * 60 * 1000;

const toUtc = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

export const isValidDate = (iso: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(toUtc(iso));

export const addDays = (iso: string, days: number): string =>
  new Date(toUtc(iso) + days * DAY_MS).toISOString().slice(0, 10);

export const daysBetween = (from: string, to: string): number =>
  Math.round((toUtc(to) - toUtc(from)) / DAY_MS);

export const todayIso = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

export const isValidTaxRate = (rate: number) =>
  TAX_RATES.some((option) => option.value === rate);

/* ---------- starting values ---------- */

export const createEmptyDraft = (): InvoiceDraft => {
  const today = todayIso();
  return {
    customer_id: null,
    invoice_number: `INV-${today.slice(0, 4)}-001`,
    invoice_date: today,
    due_date: addDays(today, 30),
    payment_term: "net_30",
    business: { name: "", address: "", email: "", phone: "" },
    notes: "Thank you for your business!",
    tax_rate: 5,
    items: [{ id: 1, description: "", quantity: 1, unit_price: 0, discount: 0 }],
    design: {
      template: "modern",
      theme: "blue",
      font: "inter",
      logo: "",
      show_notes: true,
      show_payment_terms: true,
      show_business_info: true,
    },
  };
};


