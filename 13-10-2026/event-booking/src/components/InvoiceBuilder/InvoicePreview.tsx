"use client "

import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { cn } from "cn";
import { lineTotal, money } from "@/data/InvoiceBuilder/Invoicecalc";
import { selectAllCustomers } from "@/Redux/Slices/InvoiceBuilder/customerslice";
import { selectInvoiceDraft } from "@/Redux/Slices/InvoiceBuilder/invoiceslice";
import {
  PAYMENT_TERMS,
  isValidDate,
  type InvoiceFont,
  type InvoiceTheme,
} from "@/data/InvoiceBuilder/invoicedata";
import { THEME_COLORS } from "@/data/InvoiceBuilder/invoicedata";

type InvoicePreviewProps = { className?: string };



const FONT_FAMILY: Record<InvoiceFont, string> = {
  inter: "Inter, ui-sans-serif, system-ui, sans-serif",
  serif: 'Georgia, "Times New Roman", serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

const SHEET_WIDTH = 794; // A4 at 96 dpi
const SHEET_HEIGHT = 1123;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;
// "2026-11-21" -> "21 Nov 2026" ("-" when empty or invalid)
const formatDate = (iso: string) =>
  isValidDate(iso)
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const Muted = ({ children }: { children: ReactNode }) => (
  <span className="text-slate-400">{children}</span>
);

export  const InvoicePreview = ({ className }: InvoicePreviewProps) => {
  const draft = useSelector(selectInvoiceDraft);
  const customers = useSelector(selectAllCustomers);

  const { design, business, items } = draft;
  const accent = THEME_COLORS[design.theme];
  const soft = `color-mix(in srgb, ${accent} 12%, white)`;
  const customer = customers.find((item) => item.id === draft.customer_id);
  const term = PAYMENT_TERMS.find((option) => option.value === draft.payment_term);

  /* ---------- totals: subtotal - discount, then tax on that ---------- */
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxable = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const discountTotal = subtotal - taxable;
  const tax = (taxable * draft.tax_rate) / 100;
  const total = taxable + tax;

  const isModern = design.template === "modern";
  const isMinimal = design.template === "minimal";
  const isElegant = design.template === "elegant";

  const contactLine = [business.email.trim(), business.phone.trim()].filter(Boolean).join("  |  ");

  const metaRow = (label: string, value: string) => (
    <div className={cn("flex gap-3", isElegant ? "justify-center" : "justify-end")}>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );

  const headStyle = isModern
    ? { background: soft }
    : isElegant
      ? { borderTop: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` }
      : { borderBottom: "2px solid #cbd5e1" };

  return (
    <div
      className={cn(
        // always a white "paper", even in dark mode
        "relative overflow-hidden bg-white text-[13px] leading-relaxed text-slate-900 shadow-md",
        className,
      )}
      style={{ width: SHEET_WIDTH, minHeight: SHEET_HEIGHT, fontFamily: FONT_FAMILY[design.font] }}
    >
      {isModern && (
        <>
          <span
            aria-hidden="true"
            className="absolute -top-20 -right-16 size-56 rounded-full"
            style={{ background: accent, opacity: 0.14 }}
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-24 -left-20 size-64 rounded-full"
            style={{ background: accent, opacity: 0.1 }}
          />
        </>
      )}

      <div
        className="relative flex flex-col px-12 py-12"
        style={{ minHeight: SHEET_HEIGHT }}
      >
        {/* ---------- header ---------- */}
        <header
          className={cn(
            "flex items-start justify-between gap-8",
            isElegant && "flex-col items-center text-center",
          )}
        >
          <div className={cn("flex min-w-0 items-start gap-4", isElegant && "flex-col items-center")}>
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
                  {business.address.trim() && (
                    <p className="whitespace-pre-line">{business.address}</p>
                  )}
                  {contactLine && <p>{contactLine}</p>}
                </div>
              )}
            </div>
          </div>

          <div className={cn("shrink-0", !isElegant && "text-right")}>
            <p
              className={cn(
                "font-extrabold",
                isMinimal ? "text-2xl tracking-[0.3em] text-slate-700" : "text-4xl tracking-tight",
              )}
              style={isMinimal ? undefined : { color: accent }}
            >
              INVOICE
            </p>
            <dl className="mt-3 space-y-0.5 text-[12px]">
              {metaRow("Invoice #:", draft.invoice_number.trim() || "-")}
              {metaRow("Date:", formatDate(draft.invoice_date))}
              {metaRow("Due Date:", formatDate(draft.due_date))}
            </dl>
          </div>
        </header>

        {/* ---------- bill to ---------- */}
        <section className="mt-8">
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

        {/* ---------- items ---------- */}
        <table className="mt-6 w-full border-separate border-spacing-0 text-left text-[12px]">
          <thead>
            <tr className="font-semibold" style={headStyle}>
              <th className={cn("w-10 px-3 py-2.5", isModern && "rounded-l-md")}>#</th>
              <th className="px-3 py-2.5">Service / Description</th>
              <th className="px-3 py-2.5 text-right">Qty</th>
              <th className="px-3 py-2.5 text-right">Unit Price</th>
              <th className="px-3 py-2.5 text-right">Discount</th>
              <th className={cn("px-3 py-2.5 text-right", isModern && "rounded-r-md")}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center">
                  <Muted>No items added yet</Muted>
                </td>
              </tr>
            )}
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="border-b border-slate-100 px-3 py-2.5 text-slate-500">
                  {index + 1}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5">
                  {item.description.trim() || <Muted>Item description</Muted>}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-right tabular-nums">
                  {money(item.unit_price)}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-right tabular-nums">
                  {money(item.discount)}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-right font-medium tabular-nums">
                  {money(lineTotal(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- totals ---------- */}
        <dl className="mt-6 ml-auto w-72 text-[12px]">
          <div className="flex justify-between px-3 py-1">
            <dt className="text-slate-600">Subtotal</dt>
            <dd className="tabular-nums">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between px-3 py-1">
            <dt className="text-slate-600">Discount</dt>
            <dd className="tabular-nums">-{money(discountTotal)}</dd>
          </div>
          <div className="flex justify-between px-3 py-1">
            <dt className="text-slate-600">Tax ({draft.tax_rate}%)</dt>
            <dd className="tabular-nums">{money(tax)}</dd>
          </div>
          <div
            className="mt-2 flex justify-between rounded-md px-3 py-2.5 text-sm font-bold"
            style={
              isElegant
                ? { borderTop: `2px solid ${accent}`, borderBottom: `2px solid ${accent}`, color: accent }
                : { background: soft, color: accent }
            }
          >
            <dt>Total</dt>
            <dd className="tabular-nums">{money(total)}</dd>
          </div>
        </dl>

        {/* ---------- notes ---------- */}
        {design.show_notes && draft.notes.trim() && (
          <section className="mt-8">
            <p className="mb-1 text-[12px] font-bold">Notes</p>
            <p className="whitespace-pre-line text-slate-700">{draft.notes}</p>
          </section>
        )}

        {/* ---------- footer ---------- */}
        {design.show_payment_terms && (
          <footer className="mt-auto pt-10">
            <p className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-500">
              Payment terms: {term?.label ?? "-"}. Please make the payment by{" "}
              {formatDate(draft.due_date)}. If you have any questions, feel free to contact us.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

