// data/InvoiceBuilder/invoicecalc.ts
import type { InvoiceDraft, InvoiceItem } from "./invoicedata";

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** quantity x price, before the line discount */
export const lineGross = (item: InvoiceItem) => item.quantity * item.unit_price;

/** what the customer pays for this line (never below 0) */
export const lineTotal = (item: InvoiceItem) =>
  round2(Math.max(0, lineGross(item) - item.discount));

export const calcTotals = (draft: Pick<InvoiceDraft, "items" | "tax_rate">) => {
  const gross = round2(draft.items.reduce((sum, item) => sum + lineGross(item), 0));
  const subtotal = round2(draft.items.reduce((sum, item) => sum + lineTotal(item), 0));
  const discount = round2(gross - subtotal);
  const tax = round2((subtotal * draft.tax_rate) / 100);

  return { gross, discount, subtotal, tax, total: round2(subtotal + tax) };
};

export type InvoiceTotalsData = ReturnType<typeof calcTotals>;

export const money = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;