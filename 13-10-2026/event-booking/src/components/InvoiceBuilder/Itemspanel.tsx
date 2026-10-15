// components/invoice/ItemsPanel.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { TAX_RATES } from "@/data/InvoiceBuilder/invoicedata";
import { calcTotals, lineTotal, money } from "@/data/InvoiceBuilder/Invoicecalc";
import type { ItemsErrors } from "@/data/InvoiceBuilder/invoicevalidation";
import {
  itemAdded,
  itemRemoved,
  itemUpdated,
  selectInvoiceDraft,
  taxRateChanged,
} from "@/Redux/Slices/InvoiceBuilder/invoiceslice";
// import { InvoiceTotals } from "./InvoicePreview";

const TAX_OPTIONS = TAX_RATES.map(({ label, value }) => ({ label, value: String(value) }));

// "" or text that isn't a number becomes 0
const toNumber = (value: unknown) => Number(value) || 0;

// show an empty box instead of "0", so the field can be cleared and retyped
const show = (n: number) => (n === 0 ? "" : String(n));

type ItemsPanelProps = {
  visibleErrors: ItemsErrors;
  onBack: () => void;
  onNext: () => void;
};



export function ItemsPanel({ visibleErrors, onBack, onNext }: ItemsPanelProps) {
  const dispatch = useDispatch();
  const draft = useSelector(selectInvoiceDraft);
  const totals = calcTotals(draft);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold">Line items</h3>

      {visibleErrors.general && (
        <p className="text-sm text-danger" role="alert">
          {visibleErrors.general}
        </p>
      )}

      {draft.items.map((item, index) => {
        const errors = visibleErrors.items[item.id] ?? {};

        return (
          <div key={item.id} className="rounded-xl border border-line p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Item {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove item ${index + 1}`}
                disabled={draft.items.length === 1}
                onClick={() => dispatch(itemRemoved(item.id))}
                className="text-danger hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 />
                Remove
              </Button>
            </div>

            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-3">
              <FormField
                type="text"
                name={`item_${item.id}_description`}
                label="Description"
                placeholder="e.g. Website design"
                value={item.description}
                onChange={(value) =>
                  dispatch(itemUpdated({ id: item.id, changes: { description: String(value) } }))
                }
                error={errors.description}
                required
                className="sm:col-span-3"
              />

              <FormField
                type="number"
                name={`item_${item.id}_quantity`}
                label="Quantity"
                placeholder="1"
                value={show(item.quantity)}
                onChange={(value) =>
                  dispatch(itemUpdated({ id: item.id, changes: { quantity: toNumber(value) } }))
                }
                error={errors.quantity}
                required
              />

              <FormField
                type="number"
                name={`item_${item.id}_unit_price`}
                label="Unit price (₹)"
                placeholder="0"
                value={show(item.unit_price)}
                onChange={(value) =>
                  dispatch(itemUpdated({ id: item.id, changes: { unit_price: toNumber(value) } }))
                }
                error={errors.unit_price}
                required
              />

              <FormField
                type="number"
                name={`item_${item.id}_discount`}
                label="Discount (₹)"
                placeholder="0"
                value={show(item.discount)}
                onChange={(value) =>
                  dispatch(itemUpdated({ id: item.id, changes: { discount: toNumber(value) } }))
                }
                error={errors.discount}
              />

              <p className="text-right text-sm text-muted-foreground sm:col-span-3">
                Line total{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {money(lineTotal(item))}
                </span>
              </p>
            </div>
          </div>
        );
      })}

      <div>
        <Button type="button" variant="outline" onClick={() => dispatch(itemAdded())}>
          <Plus />
          Add item
        </Button>
      </div>

      {/* Tax + totals */}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          type="select"
          name="tax_rate"
          label="Tax rate"
          options={TAX_OPTIONS}
          value={String(draft.tax_rate)}
          onChange={(value) => dispatch(taxRateChanged(Number(value)))}
        />

        {/* <div className="rounded-xl border border-line bg-muted px-4 py-3 sm:col-start-2">
          <InvoiceTotals totals={totals} taxRate={draft.tax_rate} />
        </div> */}
      </div>

      {/* <div className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={onNext}>
          Next: Design
        </Button>
      </div> */}
    </div>
  );
}