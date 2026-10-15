import { createSlice, current, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/Redux/store";
import {
  PAYMENT_TERMS,
  addDays,
  createEmptyDraft,
  daysBetween,
  isValidDate,
  type BusinessInfo,
  type InvoiceDesign,
  type InvoiceDraft,
  type InvoiceItem,
  type PaymentTerm,
  type SavedInvoice,
} from "@/data/InvoiceBuilder/invoicedata";

interface InvoiceState {
  draft: InvoiceDraft; // the invoice being built right now
  saved: SavedInvoice[]; // invoices the user saved
}

const initialState: InvoiceState = {
  draft: createEmptyDraft(),
  saved: [],
};

const termDays = (term: PaymentTerm) =>
  PAYMENT_TERMS.find((option) => option.value === term)?.days ?? null;

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    customerSelected(state, action: PayloadAction<number | null>) {
      state.draft.customer_id = action.payload;
    },

    invoiceNumberChanged(state, action: PayloadAction<string>) {
      state.draft.invoice_number = action.payload;
    },

    // moving the invoice date moves the due date too, unless the term is Custom
    invoiceDateChanged(state, action: PayloadAction<string>) {
      state.draft.invoice_date = action.payload;
      const days = termDays(state.draft.payment_term);
      if (days !== null && isValidDate(action.payload)) {
        state.draft.due_date = addDays(action.payload, days);
      }
    },

    // picking a term sets the due date from the invoice date
    paymentTermChanged(state, action: PayloadAction<PaymentTerm>) {
      state.draft.payment_term = action.payload;
      const days = termDays(action.payload);
      if (days !== null && isValidDate(state.draft.invoice_date)) {
        state.draft.due_date = addDays(state.draft.invoice_date, days);
      }
    },

    // typing a due date switches the term to the matching Net X, or to Custom
    dueDateChanged(state, action: PayloadAction<string>) {
      state.draft.due_date = action.payload;
      if (isValidDate(action.payload) && isValidDate(state.draft.invoice_date)) {
        const gap = daysBetween(state.draft.invoice_date, action.payload);
        const match = PAYMENT_TERMS.find((option) => option.days === gap);
        state.draft.payment_term = match ? match.value : "custom";
      } else {
        state.draft.payment_term = "custom";
      }
    },

    businessChanged(
      state,
      action: PayloadAction<{ field: keyof BusinessInfo; value: string }>,
    ) {
      state.draft.business[action.payload.field] = action.payload.value;
    },

    notesChanged(state, action: PayloadAction<string>) {
      state.draft.notes = action.payload;
    },

    /* ---------- Items tab ---------- */
    itemAdded(state) {
      const nextId = state.draft.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      state.draft.items.push({
        id: nextId,
        description: "",
        quantity: 1,
        unit_price: 0,
        discount: 0,
      });
    },

    itemUpdated(
      state,
      action: PayloadAction<{ id: number; changes: Partial<Omit<InvoiceItem, "id">> }>,
    ) {
      const item = state.draft.items.find((entry) => entry.id === action.payload.id);
      if (item) Object.assign(item, action.payload.changes);
    },

    itemRemoved(state, action: PayloadAction<number>) {
      state.draft.items = state.draft.items.filter((item) => item.id !== action.payload);
    },

    taxRateChanged(state, action: PayloadAction<number>) {
      state.draft.tax_rate = action.payload;
    },

    /* ---------- Design tab ---------- */
    designChanged(state, action: PayloadAction<Partial<InvoiceDesign>>) {
      Object.assign(state.draft.design, action.payload);
    },

    /* ---------- Whole invoice ---------- */
    draftReset(state) {
      state.draft = createEmptyDraft();
    },

    // copies the draft into the saved list (a clone, so later edits don't touch it)
    draftSaved(state, action: PayloadAction<{ status: "draft" | "final" }>) {
      const nextId = state.saved.reduce((max, invoice) => Math.max(max, invoice.id), 0) + 1;
      state.saved.push({
        ...structuredClone(current(state.draft)),
        id: nextId,
        status: action.payload.status,
        saved_at: new Date().toISOString(),
      });
    },
  },
});

export const {
  customerSelected,
  invoiceNumberChanged,
  invoiceDateChanged,
  paymentTermChanged,
  dueDateChanged,
  businessChanged,
  notesChanged,
  itemAdded,
  itemUpdated,
  itemRemoved,
  taxRateChanged,
  designChanged,
  draftReset,
  draftSaved,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;

/* ---------- selectors: use these anywhere in the app ---------- */
export const selectInvoiceDraft = (state: RootState) => state.invoice.draft;
export const selectSavedInvoices = (state: RootState) => state.invoice.saved;