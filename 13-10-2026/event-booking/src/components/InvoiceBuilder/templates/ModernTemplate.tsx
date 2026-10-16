// components/InvoiceBuilder/templates/ModernTemplate.tsx
import { money } from "@/data/InvoiceBuilder/Invoicecalc";
import {
  BillTo,
  BusinessBlock,
  InvoiceItemsTable,
  MetaRows,
  NotesSection,
  PaymentFooter,
  SHEET_HEIGHT,
  TotalsRows,
  type InvoiceTemplateProps,
} from "./shared";

export function ModernTemplate({ model }: InvoiceTemplateProps) {
  const { draft, customer, accent, soft, totals } = model;

  return (
    <div className="relative overflow-hidden" style={{ minHeight: SHEET_HEIGHT }}>
      {/* decorative corners */}
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

      <div className="relative flex flex-col px-12 py-12" style={{ minHeight: SHEET_HEIGHT }}>
        <header className="flex items-start justify-between gap-8">
          <BusinessBlock model={model} />
          <div className="shrink-0 text-right">
            <p className="text-4xl font-extrabold tracking-tight" style={{ color: accent }}>
              INVOICE
            </p>
            <div className="mt-3">
              <MetaRows draft={draft} />
            </div>
          </div>
        </header>

        <div className="mt-8">
          <BillTo customer={customer} />
        </div>

        <InvoiceItemsTable items={draft.items} headerClassName="bg-(--inv-soft) text-slate-900" />

        <dl className="mt-6 ml-auto w-72 text-[12px]">
          <TotalsRows model={model} />
          <div
            className="mt-2 flex justify-between rounded-md px-3 py-2.5 text-sm font-bold"
            style={{ background: soft, color: accent }}
          >
            <dt>Total</dt>
            <dd className="tabular-nums">{money(totals.total)}</dd>
          </div>
        </dl>

        <NotesSection draft={draft} />
        <PaymentFooter model={model} />
      </div>
    </div>
  );
}