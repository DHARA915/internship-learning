import { useMemo, useState } from "react";
import type { InvoiceDraft } from "@/data/InvoiceBuilder/invoicedata";
import {
  hasItemsErrors,
  validateDetails,
  validateItems,
  type DetailsErrors,
  type DetailsField,
  type ItemsErrors,
} from "@/data/InvoiceBuilder/invoicevalidation";

const NO_ITEM_ERRORS: ItemsErrors = { items: {} };

export function useInvoiceValidation(draft: InvoiceDraft) {
  // every error that exists right now
  const detailsErrors = useMemo(() => validateDetails(draft), [draft]);
  const itemsErrors = useMemo(() => validateItems(draft), [draft]);

  const [touched, setTouched] = useState<Partial<Record<DetailsField, boolean>>>({});
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [itemsSubmitted, setItemsSubmitted] = useState(false);

  /* ---------- details ---------- */

  // call this when the user changes a field
  const touch = (...fields: DetailsField[]) =>
    setTouched((previous) => {
      const next = { ...previous };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });

  // touched fields only, or everything after clicking Next
  const visibleDetailsErrors = useMemo(() => {
    const visible: DetailsErrors = {};
    (Object.keys(detailsErrors) as DetailsField[]).forEach((field) => {
      if (detailsSubmitted || touched[field]) visible[field] = detailsErrors[field];
    });
    return visible;
  }, [detailsErrors, touched, detailsSubmitted]);

  const checkDetails = () => {
    setDetailsSubmitted(true);
    return Object.keys(detailsErrors).length === 0;
  };

  /* ---------- items ---------- */

  // nothing is shown until the user clicks Next, then it stays live
  const visibleItemsErrors = itemsSubmitted ? itemsErrors : NO_ITEM_ERRORS;

  const checkItems = () => {
    setItemsSubmitted(true);
    return !hasItemsErrors(itemsErrors);
  };

  /* ---------- all tabs ---------- */

  // checks every tab and returns the first tab with a problem, or null when all is valid
  const checkAll = (): "details" | "items" | null => {
    const detailsOk = checkDetails();
    const itemsOk = checkItems();
    if (!detailsOk) return "details";
    if (!itemsOk) return "items";
    return null;
  };

  return {
    details: { visibleErrors: visibleDetailsErrors, touch, check: checkDetails },
    items: {
      visibleErrors: visibleItemsErrors,
      hasVisibleErrors: hasItemsErrors(visibleItemsErrors),
      check: checkItems,
    },
    checkAll,
  };
}