// components/InvoiceBuilder/templates/MinimalTemplate.tsx
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

export function MinimalTemplate({ model }: InvoiceTemplateProps) {
  const { draft, customer, accent, totals } = model;

  return (
    <div className="flex flex-col px-12 py-12" style={{ minHeight: SHEET_HEIGHT }}>
      <header className="flex items-start justify-between gap-8 border-b-2 border-slate-300 pb-6">
        <BusinessBlock model={model} />
        <div className="shrink-0 text-right">
          <p className="text-2xl font-semibold tracking-[0.3em] text-slate-700">INVOICE</p>
          <div className="mt-3">
            <MetaRows draft={draft} />
          </div>
        </div>
      </header>

      <div className="mt-8">
        <BillTo customer={customer} />
      </div>

      <InvoiceItemsTable
        items={draft.items}
        headerClassName="border-b-2 border-slate-300 text-slate-700"
      />

      <dl className="mt-6 ml-auto w-72 text-[12px]">
        <TotalsRows model={model} />
        <div
          className="mt-2 flex justify-between border-t-2 border-slate-300 px-3 py-2.5 text-sm font-bold"
          style={{ color: accent }}
        >
          <dt>Total</dt>
          <dd className="tabular-nums">{money(totals.total)}</dd>
        </div>
      </dl>

      <NotesSection draft={draft} />
      <PaymentFooter model={model} />
    </div>
  );
}