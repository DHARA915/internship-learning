// app/events/[id]/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Check, CreditCard, Minus, Plus, Ticket, UserRound } from "lucide-react";
import QRCode from "qrcode";
import { CommonDialog } from "@/components/CommonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import FormField from "@/components/form-field/FormField";
import { Button } from "@/components/ui/button";
import { seatsLeft } from "@/data/events/events";
import type {
  PaymentMethod,
  Registration,
} from "@/data/registration/registrationdata";
import { selectAllEvents } from "@/Redux/Slices/eventslice";
import {
  registrationAdded,
  selectAllRegistrations,
} from "@/Redux/Slices/Registrationsslice ";
import { seatsBooked } from "@/Redux/Slices/eventslice";
import type { FormErrors } from "@/components/CommonDialog";
import Stepper from "@/components/Stepper";

// What the person can pick on the Payment step ("free" is set automatically
// for free events, so it is not a choice here)
type PayChoice = Extract<PaymentMethod, "upi" | "card" | "netbanking">;

// The data this form holds: one entry per field, keyed by field name.
// Built from your Registration type so the field names and types stay in sync.
// Only these fields differ from the saved record:
//   tickets        -> a number while the user picks with + and -
//   payment_method -> only the choices the user can pick (no "free")
//   card_number    -> typed in the form but never saved (only card_last4 is)
type RegisterFormValues = Partial<
  Pick<
    Registration,
    "full_name" | "email" | "phone" | "city" | "upi_id" | "card_name" | "bank_name"
  >
> & {
  tickets: number | "";
  payment_method: PayChoice;
  card_number?: string;
};

type RegisterField = keyof RegisterFormValues;

const STEPS = [
  { label: "Details", title: "Your details", description: "Tell us who is attending.", icon: <UserRound /> },
  { label: "Tickets", title: "Choose tickets", description: "How many seats do you need?", icon: <Ticket /> },
  { label: "Payment", title: "Payment", description: "Review your order and pay.", icon: <CreditCard /> },
  { label: "Done", title: "You're registered", description: "Your ticket QR code is ready.", icon: <Check /> },
];

const PAYMENT_OPTIONS: { label: string; value: PayChoice }[] = [
  { label: "UPI", value: "upi" },
  { label: "Card", value: "card" },
  { label: "Net banking", value: "netbanking" },
];

const INITIAL_VALUES: RegisterFormValues = { tickets: 1, payment_method: "upi" };

const text = (value: unknown) => String(value ?? "").trim();
const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const validateStep = (
  step: number,
  v: RegisterFormValues,
  maxTickets: number,
  isFree: boolean,
): FormErrors => {
  const e: FormErrors = {};

  if (step === 0) {
    if (!text(v.full_name)) e.full_name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(text(v.email))) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(text(v.phone)))
      e.phone = "Enter a valid 10-digit mobile number";
    if (!text(v.city)) e.city = "City is required";
  }

  if (step === 1) {
    const t = Number(v.tickets);
    if (!Number.isInteger(t) || t < 1) e.tickets = "Select at least 1 ticket";
    else if (t > maxTickets) e.tickets = `Only ${maxTickets} seats available`;
  }

  if (step === 2 && !isFree) {
    if (v.payment_method === "upi" && !/^[\w.-]+@[\w]+$/.test(text(v.upi_id)))
      e.upi_id = "Enter a valid UPI ID, e.g. name@bank";
    if (v.payment_method === "card") {
      if (!text(v.card_name)) e.card_name = "Name on card is required";
      if (!/^\d{16}$/.test(text(v.card_number).replace(/\s/g, "")))
        e.card_number = "Enter a 16-digit card number";
    }
    if (v.payment_method === "netbanking" && !text(v.bank_name))
      e.bank_name = "Bank name is required";
  }

  return e;
};

export default function RegisterPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const events = useSelector(selectAllEvents);
  const registrations = useSelector(selectAllRegistrations);
  const event = events.find((item) => String(item.id) === String(id));

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<{ code: string; qr: string } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);


  const setValue = <K extends RegisterField>(
    name: K,
    value: RegisterFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (!event) {
    return <p className="text-muted-foreground">Event not found.</p>;
  }

  const price = event.price_type === "paid" ? Number(event.price) || 0 : 0;
  const isFree = price === 0;
  // no fixed per-booking cap: the only limit is the seats still available
  const maxTickets = seatsLeft(event);
  const tickets = Number(values.tickets) || 0;
  const total = tickets * price;
  const current = STEPS[step];

  const ticketWord = tickets === 1 ? "ticket" : "tickets";
  const payLabel = isFree ? "Confirm registration" : `Pay ${inr(total)}`;
  const saveLabel = step < 2 ? "Next" : step === 2 ? payLabel : "Done";

  const changeTickets = (delta: number) =>
    setValue("tickets", Math.min(maxTickets, Math.max(1, tickets + delta)));

  // returns false to keep the dialog open (next step / validation error)
  const handleSubmit = async () => {
    if (step === 3) return; // Done -> dialog closes

    const stepErrors = validateStep(step, values, maxTickets, isFree);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return false;

    if (step < 2) {
      setStep(step + 1);
      return false;
    }

    // Payment step: ask first, pay only after the user confirms
    setIsConfirmOpen(true);
    return false;
  };

  // runs only after the user confirms (ConfirmDialog closes itself afterwards)
  const completePayment = async () => {
    const nextId = registrations.reduce((max, prev) => Math.max(max, prev.id), 0) + 1;
    const code = `REG-${String(nextId).padStart(4, "0")}`;

    const qr = await QRCode.toDataURL(
      JSON.stringify({ code, event_id: event.id, name: text(values.full_name), tickets }),
      { width: 320, margin: 1, color: { dark: "#111111", light: "#ffffff" } },
    );

    // free events store "free" as the method, paid events store what was picked
    const method: PaymentMethod = isFree ? "free" : values.payment_method;

    const newRegistration: Omit<Registration, "id"> = {
      code,
      event_id: event.id,
      event_title: event.title,
      full_name: text(values.full_name),
      email: text(values.email),
      phone: text(values.phone),
      city: text(values.city),
      tickets,
      price_per_ticket: price,
      total_amount: total,
      payment_method: method,
      upi_id: method === "upi" ? text(values.upi_id) : "",
      card_name: method === "card" ? text(values.card_name) : "",
      // never store the full card number
      card_last4:
        method === "card" ? text(values.card_number).replace(/\s/g, "").slice(-4) : "",
      bank_name: method === "netbanking" ? text(values.bank_name) : "",
      status: isFree ? "free" : "paid",
      created_at: new Date().toISOString(),
      qr_code: qr,
    };



    dispatch(registrationAdded(newRegistration));
    dispatch(seatsBooked({id:event.id,tickets}))

    setResult({ code, qr });
    setStep(3);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">{event.title}</h1>
      <p className="mt-1 text-muted-foreground">
        {[event.venue, event.city].filter(Boolean).join(", ")}
      </p>

      <CommonDialog
        open
        onOpenChange={(isOpen) => {
          if (!isOpen) router.back();
        }}
        icon={current.icon}
        title={current.title}
        description={current.description}
        saveLabel={saveLabel}
        onSubmit={handleSubmit}
        onBack={
          step > 0 && step < 3
            ? () => {
                setErrors({});
                setStep(step - 1);
              }
            : undefined
        }
        hideCancel={step === 3}
      >
        <Stepper step={step} STEPS={STEPS} />

        {/* Fixed minimum height so the dialog is the same size on every step */}
        <div className="min-h-[22rem]">
          {step === 0 && (
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <FormField
                type="text"
                name="full_name"
                label="Full name"
                placeholder="e.g. Aarav Patel"
                value={values.full_name ?? ""}
                onChange={(value) => setValue("full_name", value)}
                error={errors.full_name}
                required
                className="sm:col-span-2"
              />
              <FormField
                type="text"
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={values.email ?? ""}
                onChange={(value) => setValue("email", value)}
                error={errors.email}
                required
              />
              <FormField
                type="text"
                name="phone"
                label="Phone"
                placeholder="10-digit mobile number"
                value={values.phone ?? ""}
                onChange={(value) => setValue("phone", value)}
                error={errors.phone}
                required
              />
              <FormField
                type="text"
                name="city"
                label="City"
                placeholder="e.g. Ahmedabad"
                value={values.city ?? ""}
                onChange={(value) => setValue("city", value)}
                error={errors.city}
                required
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium">Number of tickets</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {maxTickets} {maxTickets === 1 ? "seat" : "seats"} left
                </p>

                <div className="mt-3 inline-flex w-fit items-center rounded-lg border border-line-strong">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Decrease tickets"
                    disabled={tickets <= 1}
                    onClick={() => changeTickets(-1)}
                    className="size-9 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span
                    className="min-w-12 text-center font-semibold tabular-nums"
                    aria-live="polite"
                  >
                    {tickets}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Increase tickets"
                    disabled={tickets >= maxTickets}
                    onClick={() => changeTickets(1)}
                    className="size-9 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                {errors.tickets && (
                  <p className="mt-2 text-xs text-danger" role="alert">
                    {errors.tickets}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-line bg-muted px-4 py-3 text-sm">
                <p className="text-muted-foreground">
                  {tickets} × {isFree ? "Free" : inr(price)}
                </p>
                <p className="text-lg font-semibold">
                  {isFree ? "Free" : `Total ${inr(total)}`}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-muted px-4 py-3 text-sm sm:col-span-2">
                <p className="text-muted-foreground">
                  {tickets} × {isFree ? "Free" : inr(price)}
                </p>
                <p className="text-lg font-semibold">
                  {isFree ? "No payment needed" : `Total ${inr(total)}`}
                </p>
              </div>

              {!isFree && (
                <>
                  <FormField
                    type="select"
                    name="payment_method"
                    label="Payment method"
                    options={PAYMENT_OPTIONS}
                    value={values.payment_method}
                    onChange={(value) => setValue("payment_method", value as PayChoice)}
                    className="sm:col-span-2"
                  />

                  {values.payment_method === "upi" && (
                    <FormField
                      type="text"
                      name="upi_id"
                      label="UPI ID"
                      placeholder="name@bank"
                      value={values.upi_id ?? ""}
                      onChange={(value) => setValue("upi_id", value)}
                      error={errors.upi_id}
                      required
                      className="sm:col-span-2"
                    />
                  )}

                  {values.payment_method === "card" && (
                    <>
                      <FormField
                        type="text"
                        name="card_name"
                        label="Name on card"
                        value={values.card_name ?? ""}
                        onChange={(value) => setValue("card_name", value)}
                        error={errors.card_name}
                        required
                      />
                      <FormField
                        type="text"
                        name="card_number"
                        label="Card number"
                        placeholder="1234 5678 9012 3456"
                        value={values.card_number ?? ""}
                        onChange={(value) => setValue("card_number", value)}
                        error={errors.card_number}
                        required
                      />
                    </>
                  )}

                  {values.payment_method === "netbanking" && (
                    <FormField
                      type="text"
                      name="bank_name"
                      label="Bank name"
                      placeholder="e.g. HDFC Bank"
                      value={values.bank_name ?? ""}
                      onChange={(value) => setValue("bank_name", value)}
                      error={errors.bank_name}
                      required
                      className="sm:col-span-2"
                    />
                  )}
                </>
              )}
            </div>
          )}

          {step === 3 && result && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-xl border border-line bg-card p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.qr} alt={`QR code for ${result.code}`} className="size-48" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Registration code
                </p>
                <p className="text-lg font-semibold">{result.code}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Show this QR code at the entrance. It is saved with your registration.
              </p>
            </div>
          )}
        </div>
      </CommonDialog>

      {/* Asks before paying; the QR is generated only after "Yes" */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        variant="default"
        icon={CreditCard}
        title={isFree ? "Confirm registration?" : "Confirm payment?"}
        description={
          isFree
            ? `Register ${tickets} ${ticketWord} for this event?`
            : `You are about to pay ${inr(total)} for ${tickets} ${ticketWord}. Do you want to continue?`
        }
        confirmLabel={isFree ? "Yes, register" : `Yes, pay ${inr(total)}`}
        cancelLabel="No, go back"
        onConfirm={completePayment}
      />
    </div>
  );
}