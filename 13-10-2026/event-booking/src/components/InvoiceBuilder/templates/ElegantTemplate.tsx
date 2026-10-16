// components/InvoiceBuilder/templates/ElegantTemplate.tsx
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

export function ElegantTemplate({ model }: InvoiceTemplateProps) {
  const { draft, customer, accent, totals } = model;

  return (
    <div className="flex flex-col px-12 py-12" style={{ minHeight: SHEET_HEIGHT }}>
      <header className="flex flex-col items-center text-center">
        <BusinessBlock model={model} centered />

        <div className="mt-6 w-full border-y-4 border-double py-4" style={{ borderColor: accent }}>
          <p className="text-3xl font-semibold tracking-[0.35em]" style={{ color: accent }}>
            INVOICE
          </p>
          <div className="mt-3">
            <MetaRows draft={draft} centered />
          </div>
        </div>
      </header>

      <div className="mt-8">
        <BillTo customer={customer} />
      </div>

      <InvoiceItemsTable
        items={draft.items}
        headerClassName="border-y-2 border-(--inv-accent) text-(--inv-accent)"
      />

      <dl className="mt-6 ml-auto w-72 text-[12px]">
        <TotalsRows model={model} />
        <div
          className="mt-2 flex justify-between border-y-2 px-3 py-2.5 text-sm font-bold"
          style={{ borderColor: accent, color: accent }}
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