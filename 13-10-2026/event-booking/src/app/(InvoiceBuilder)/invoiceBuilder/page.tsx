"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { DetailsPanel } from "@/components/InvoiceBuilder/Detailspanel";
import { ItemsPanel } from "@/components/InvoiceBuilder/Itemspanel";
import { DesignPanel } from "@/components/InvoiceBuilder/DesignPanel";
import { InvoicePreviewPanel } from "@/components/InvoiceBuilder/Invoicepreviewpanel";
import { useInvoiceValidation } from "@/Hooks/InvoiceBuilder/useInvoiceValidation";
import {
  draftReset,
  draftSaved,
  selectInvoiceDraft,
  selectSavedInvoices,
} from "@/Redux/Slices/InvoiceBuilder/invoiceslice";

type TabValue = "details" | "items" | "design";

function InvoiceBuilder({ onReset }: { onReset: () => void }) {
  const dispatch = useDispatch();
  const draft = useSelector(selectInvoiceDraft);
  const saved = useSelector(selectSavedInvoices);

  const [tab, setTab] = useState<TabValue>("details");
  const [notice, setNotice] = useState("");

  const { details, items, checkAll } = useInvoiceValidation(draft);

  const tabs: TabItem<TabValue>[] = [
    {
      value: "details",
      label: "Invoice Details",
      hasError: Object.keys(details.visibleErrors).length > 0,
    },
    { value: "items", label: "Items", hasError: items.hasVisibleErrors },
    { value: "design", label: "Design" },
  ];

  const goTo = (next: TabValue) => {
    setNotice("");
    setTab(next);
  };

  // Next only moves on when the current tab is valid
  const nextFromDetails = () => {
    if (details.check()) goTo("items");
  };
  const nextFromItems = () => {
    if (items.check()) goTo("design");
  };

  const save = (status: "draft" | "final") => {
    // a draft can be saved half-filled; a final invoice must be valid
    if (status === "final") {
      const invalidTab = checkAll();
      if (invalidTab) return goTo(invalidTab);
    }

    dispatch(draftSaved({ status }));
    setNotice(
      status === "final"
        ? `Invoice ${draft.invoice_number} saved.`
        : `Draft ${draft.invoice_number} saved.`,
    );
  };

  const reset = () => {
    dispatch(draftReset());
    onReset(); // remounts the form so old error messages clear too
  };

  return (

    <div className="w-full mx-auto">
    <div className="mx-auto w-full max-w-[80%]">


      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Create invoice
          </h1>
        </div>

        {/* <Button type="button" variant="outline" onClick={reset}>
          <RotateCcw />
          Reset
        </Button> */}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
        {/* ---------- left: the three-tab form ---------- */}
        <div className="min-w-0 max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-none  rounded-2xl border border-line bg-card">
          <Tabs
            tabs={tabs}
            value={tab}
            onChange={goTo}
            className="px-2 sm:px-4"
          />

          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="p-4 sm:p-6"
          >
            {tab === "details" && (
              <DetailsPanel
                visibleErrors={details.visibleErrors}
                onTouch={details.touch}
                onNext={nextFromDetails}
              />
            )}

            {tab === "items" && (
              <ItemsPanel
                visibleErrors={items.visibleErrors}
                onBack={() => goTo("details")}
                onNext={nextFromItems}
              />
            )}

            {tab === "design" && (
              <DesignPanel
                notice={notice}
                onBack={() => goTo("items")}
                onSave={save}
              />
            )}
          </div>
        </div>

        {/* ---------- right: live preview with zoom bar ---------- */}
       <div className="h-full max-h-[80vh] overflow-y-auto  overflow-x-hidden scrollbar-none">
  <InvoicePreviewPanel />
</div>
      </div>
    </div>
    </div>
  );
}

export default function InvoiceBuilderPage() {
  // changing the key remounts the builder, which clears the validation state
  const [formKey, setFormKey] = useState(0);
  return (
    <InvoiceBuilder
      key={formKey}
      onReset={() => setFormKey((key) => key + 1)}
    />
  );
}
