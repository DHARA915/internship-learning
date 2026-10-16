// components/InvoiceBuilder/templates/shared.tsx
import type { ReactNode } from "react";
import { cn } from "cn";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { lineTotal, money } from "@/data/InvoiceBuilder/Invoicecalc";
import {
  isValidDate,
  type Customer,
  type InvoiceDraft,
  type InvoiceItem,
} from "@/data/InvoiceBuilder/invoicedata";

export const SHEET_WIDTH = 794; // A4 at 96 dpi
export const SHEET_HEIGHT = 1123;

/** Everything a template needs, worked out once by InvoicePreview. */
export type InvoiceViewModel = {
  draft: InvoiceDraft;
  customer: Customer | undefined;
  accent: string;
  /** a pale tint of the accent, for backgrounds */
  soft: string;
  termLabel: string;
  contactLine: string;
  totals: { subtotal: number; discount: number; tax: number; total: number };
};

export type InvoiceTemplateProps = { model: InvoiceViewModel };

// "2026-11-21" -> "21 Nov 2026" ("-" when empty or invalid)
export const formatDate = (iso: string) =>
  isValidDate(iso)
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

export const Muted = ({ children }: { children: ReactNode }) => (
  <span className="text-slate-400">{children}</span>
);

/* ---------- pieces every template reuses ---------- */

export function BusinessBlock({
  model,
  centered = false,
}: InvoiceTemplateProps & { centered?: boolean }) {
  const { draft, contactLine } = model;
  const { design, business } = draft;

  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-4",
        centered && "flex-col items-center text-center",
      )}
    >
      {design.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={design.logo} alt="" className="size-16 shrink-0 object-contain" />
      )}
      <div className="min-w-0">
        <p className="text-2xl font-bold">
          {business.name.trim() || <Muted>Your business name</Muted>}
        </p>
        {design.show_business_info && (
          <div className="mt-1 text-[12px] text-slate-600">
            {business.address.trim() && <p className="whitespace-pre-line">{business.address}</p>}
            {contactLine && <p>{contactLine}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetaRows({
  draft,
  centered = false,
}: {
  draft: InvoiceDraft;
  centered?: boolean;
}) {
  const rows: [string, string][] = [
    ["Invoice #:", draft.invoice_number.trim() || "-"],
    ["Date:", formatDate(draft.invoice_date)],
    ["Due Date:", formatDate(draft.due_date)],
  ];

  return (
    <dl className="space-y-0.5 text-[12px]">
      {rows.map(([label, value]) => (
        <div key={label} className={cn("flex gap-3", centered ? "justify-center" : "justify-end")}>
          <dt className="text-slate-500">{label}</dt>
          <dd className="font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BillTo({ customer }: { customer: Customer | undefined }) {
  return (
    <section>
      <p className="mb-1 text-[12px] font-bold">Bill To</p>
      {customer ? (
        <div className="break-words text-slate-700">
          <p className="font-semibold text-slate-900">{customer.name}</p>
          <p>{customer.address}</p>
          <p>{customer.email}</p>
          <p>{customer.phone}</p>
        </div>
      ) : (
        <Muted>Select a customer</Muted>
      )}
    </section>
  );
}

/** Invoice items table on the common DataTable. Each template passes its own header look. */
export function InvoiceItemsTable({
  items,
  headerClassName,
}: {
  items: InvoiceItem[];
  headerClassName?: string;
}) {
  const columns: DataTableColumn<InvoiceItem>[] = [
    {
      key: "no",
      header: "#",
      headerClassName: cn("w-10", headerClassName),
      cellClassName: "text-slate-500",
      cell: (_item, index) => index + 1,
    },
    {
      key: "description",
      header: "Service / Description",
      headerClassName,
      cell: (item) => item.description.trim() || <Muted>Item description</Muted>,
    },
    {
      key: "quantity",
      header: "Qty",
      align: "right",
      headerClassName,
      cellClassName: "tabular-nums",
      cell: (item) => item.quantity,
    },
    {
      key: "unit_price",
      header: "Unit Price",
      align: "right",
      headerClassName,
      cellClassName: "tabular-nums",
      cell: (item) => money(item.unit_price),
    },
    {
      key: "discount",
      header: "Discount",
      align: "right",
      headerClassName,
      cellClassName: "tabular-nums",
      cell: (item) => money(item.discount),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      headerClassName,
      cellClassName: "font-medium tabular-nums",
      cell: (item) => money(lineTotal(item)),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      getRowKey={(item) => item.id}
      caption="Invoice items"
      emptyMessage="No items added yet"
      className="mt-6 border-0 bg-transparent text-[12px] text-slate-900 shadow-none"
    />
  );
}

/** Subtotal / Discount / Tax rows; each template supplies its own styled Total row. */
export function TotalsRows({ model }: InvoiceTemplateProps) {
  const { draft, totals } = model;

  return (
    <>
      <div className="flex justify-between px-3 py-1">
        <dt className="text-slate-600">Subtotal</dt>
        <dd className="tabular-nums">{money(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between px-3 py-1">
        <dt className="text-slate-600">Discount</dt>
        <dd className="tabular-nums">-{money(totals.discount)}</dd>
      </div>
      <div className="flex justify-between px-3 py-1">
        <dt className="text-slate-600">Tax ({draft.tax_rate}%)</dt>
        <dd className="tabular-nums">{money(totals.tax)}</dd>
      </div>
    </>
  );
}

export function NotesSection({ draft }: { draft: InvoiceDraft }) {
  if (!draft.design.show_notes || !draft.notes.trim()) return null;

  return (
    <section className="mt-8">
      <p className="mb-1 text-[12px] font-bold">Notes</p>
      <p className="whitespace-pre-line text-slate-700">{draft.notes}</p>
    </section>
  );
}

export function PaymentFooter({ model }: InvoiceTemplateProps) {
  const { draft, termLabel } = model;
  if (!draft.design.show_payment_terms) return null;

  return (
    <footer className="mt-auto pt-10">
      <p className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-500">
        Payment terms: {termLabel}. Please make the payment by {formatDate(draft.due_date)}. If you
        have any questions, feel free to contact us.
      </p>
    </footer>
  );
}