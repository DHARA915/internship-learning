// components/invoice/DetailsPanel.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { PAYMENT_TERMS } from "@/data/InvoiceBuilder/invoicedata";
import {
  isPaymentTerm,
  type DetailsErrors,
  type DetailsField,
} from "@/data/InvoiceBuilder/invoicevalidation";
import { selectAllCustomers } from "@/Redux/Slices/InvoiceBuilder/customerslice";
import {
  businessChanged,
  customerSelected,
  dueDateChanged,
  invoiceDateChanged,
  invoiceNumberChanged,
  notesChanged,
  paymentTermChanged,
  selectInvoiceDraft,
} from "@/Redux/Slices/InvoiceBuilder/invoiceslice";

const PAYMENT_TERM_OPTIONS = PAYMENT_TERMS.map(({ label, value }) => ({ label, value }));

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="col-span-full mt-2 whitespace-nowrap text-[14px] font-bold text-brand first:mt-0">
    {children}
  </h3>
);

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

type DetailsPanelProps = {
  visibleErrors: DetailsErrors;
  onTouch: (...fields: DetailsField[]) => void;
  onNext: () => void;
};

export function DetailsPanel({ visibleErrors, onTouch, onNext }: DetailsPanelProps) {
  const dispatch = useDispatch();
  const draft = useSelector(selectInvoiceDraft);
  const customers = useSelector(selectAllCustomers);

  const customer = customers.find((item) => item.id === draft.customer_id);
  const customerOptions = customers.map((item) => ({
    label: item.name,
    value: String(item.id),
  }));

  return (
    <div className="grid grid-cols-1 gap-x-3  gap-y-4  sm:grid-cols-6">
      {/* ---------- Customer ---------- */}
      <SectionTitle>Customer Information</SectionTitle>

      <FormField
        type="select"
        name="customer_id"
        placeholder="Select a customer"
        options={customerOptions}
        value={draft.customer_id === null ? "" : String(draft.customer_id)}
        onChange={(value) => {
          onTouch("customer_id");
          dispatch(customerSelected(value ? Number(value) : null));
        }}
        error={visibleErrors.customer_id}
        required
        className="sm:col-span-6"
      />

      {customer && (
        <div className="flex items-start gap-3 rounded-xl border border-line bg-muted px-4 py-3 text-sm sm:col-span-6">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand"
          >
            {initials(customer.name)}
          </span>
          <div className="min-w-0 break-words">
            <p className="font-semibold">{customer.name}</p>
            <p className="text-muted-foreground">
              #CUST-{String(customer.id).padStart(3, "0")} · {customer.email}
            </p>
            <p className="text-muted-foreground">{customer.phone}</p>
            <p className="text-muted-foreground">{customer.address}</p>
          </div>
        </div>
      )}

      {/* ---------- Invoice details: number, date, due date in one row ---------- */}
      <SectionTitle>Invoice Details</SectionTitle>

      <FormField
        type="text"
        name="invoice_number"
        label="Invoice Number"
        placeholder="INV-2026-001"
        value={draft.invoice_number}
        onChange={(value) => {
          onTouch("invoice_number");
          dispatch(invoiceNumberChanged(value));
        }}
        error={visibleErrors.invoice_number}
        required
        className="sm:col-span-2"
      />

      {/* moving the invoice date moves the due date, unless the term is Custom */}
      <FormField
        type="date"
        name="invoice_date"
        label="Invoice Date"
        value={draft.invoice_date}
        onChange={(value) => {
          onTouch("invoice_date", "due_date");
          dispatch(invoiceDateChanged(value));
        }}
        error={visibleErrors.invoice_date}
        required
        className="sm:col-span-2"
      />

      {/* typing a due date switches the term to the matching Net X, or Custom */}
      <FormField
        type="date"
        name="due_date"
        label="Due Date"
        value={draft.due_date}
        onChange={(value) => {
          onTouch("due_date", "payment_term");
          dispatch(dueDateChanged(value));
        }}
        error={visibleErrors.due_date}
        required
        className="sm:col-span-2"
      />

      {/* ---------- Business ---------- */}
      <SectionTitle>Business Information</SectionTitle>

      <FormField
        type="text"
        name="business_name"
        label="Business Name"
        placeholder="e.g. Acme Solutions Ltd."
        value={draft.business.name}
        onChange={(value) => {
          onTouch("business_name");
          dispatch(businessChanged({ field: "name", value }));
        }}
        error={visibleErrors.business_name}
        required
        className="sm:col-span-6"
      />

      <FormField
        type="textarea"
        name="business_address"
        label="Address"
        placeholder="Street, city, state"
        value={draft.business.address}
        onChange={(value) => {
          onTouch("business_address");
          dispatch(businessChanged({ field: "address", value }));
        }}
        error={visibleErrors.business_address}
        required
        className="sm:col-span-6"
      />

      <FormField
        type="email"
        name="business_email"
        label="Email"
        placeholder="hello@acme.com"
        value={draft.business.email}
        onChange={(value) => {
          onTouch("business_email");
          dispatch(businessChanged({ field: "email", value }));
        }}
        error={visibleErrors.business_email}
        required
        className="sm:col-span-3"
      />

      <FormField
        type="tel"
        name="business_phone"
        label="Phone"
        placeholder="10-digit mobile number"
        value={draft.business.phone}
        onChange={(value) => {
          onTouch("business_phone");
          dispatch(businessChanged({ field: "phone", value }));
        }}
        error={visibleErrors.business_phone}
        required
        className="sm:col-span-3"
      />

      <FormField
        type="textarea"
        name="notes"
        label="Notes (Optional)"
        placeholder="Thank you for your business!"
        value={draft.notes}
        onChange={(value) => {
          onTouch("notes");
          dispatch(notesChanged(value));
        }}
        error={visibleErrors.notes}
        className="sm:col-span-6"
      />

      {/* picking a term sets the due date (the slice does this) */}
      <FormField
        type="select"
        name="payment_term"
        label="Payment Terms"
        options={PAYMENT_TERM_OPTIONS}
        value={draft.payment_term}
        onChange={(value) => {
          if (!isPaymentTerm(value)) return;
          onTouch("payment_term", "due_date");
          dispatch(paymentTermChanged(value));
        }}
        error={visibleErrors.payment_term}
        required
        className="sm:col-span-6"
      />

      {/* <div className="flex justify-end sm:col-span-6">
        <Button type="button" variant="primary" onClick={onNext}>
          Next: Items
        </Button>
      </div> */}
    </div>
  );

}