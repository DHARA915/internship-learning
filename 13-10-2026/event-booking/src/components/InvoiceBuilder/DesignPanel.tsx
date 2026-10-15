// components/invoice/DesignPanel.tsx
"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  Image as ImageIcon,
  SlidersHorizontal,
  StickyNote,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import type {
  InvoiceDesign,
  InvoiceFont,
  InvoiceTemplate,
  InvoiceTheme,
} from "@/data/InvoiceBuilder/invoicedata";
import { designChanged, selectInvoiceDraft } from "@/Redux/Slices/InvoiceBuilder/invoiceslice";
import { THEME_COLORS } from "@/data/InvoiceBuilder/invoicedata";

const TEMPLATE_OPTIONS: { label: string; value: InvoiceTemplate }[] = [
  { label: "Modern", value: "modern" },
  { label: "Minimal", value: "minimal" },
  { label: "Elegant", value: "elegant" },
];

const THEME_OPTIONS: { label: string; value: InvoiceTheme }[] = [
  { label: "Blue", value: "blue" },
  { label: "Purple", value: "purple" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
  { label: "Slate", value: "slate" },
];

const FONT_OPTIONS: { label: string; value: InvoiceFont }[] = [
  { label: "Inter", value: "inter" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "mono" },
];

const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB

/* ---------- small building blocks ---------- */



const Bar = ({ w }: { w: string }) => (
  <div className="h-0.5 rounded-full bg-slate-200" style={{ width: w }} />
);

/** Tiny drawing of each template, coloured with the chosen theme. */
function TemplateThumb({ template, accent }: { template: InvoiceTemplate; accent: string }) {
  const lines = (
    <div className="mt-1.5 space-y-1">
      <Bar w="70%" />
      <Bar w="55%" />
      <Bar w="85%" />
      <Bar w="40%" />
      <Bar w="75%" />
    </div>
  );

  if (template === "modern") {
    return (
      <div className="h-full bg-white p-1.5">
        <div className="h-3 rounded-sm" style={{ background: accent }} />
        {lines}
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className="h-full bg-white p-1.5">
        <div className="h-1.5 w-1/3 rounded-sm bg-slate-300" />
        <div className="mt-1 border-t" style={{ borderColor: accent }} />
        {lines}
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-1.5 text-center">
      <div className="mx-auto h-1.5 w-1/2 rounded-sm bg-slate-300" />
      <div className="mt-1 h-1 border-y-2 border-double" style={{ borderColor: accent }} />
      {lines}
    </div>
  );
}

type ToggleRowProps = {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleRow({ icon, label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-3 text-sm [&_svg]:size-4 [&_svg]:text-muted-foreground">
        {icon}
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/30",
          checked ? "bg-brand" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

/* ---------- the panel ---------- */

type DesignPanelProps = {
  /** message shown after a save, e.g. "Invoice INV-2026-001 saved." */
  notice: string;
  onBack: () => void;
  onSave: (status: "draft" | "final") => void;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="col-span-full mb-2 whitespace-nowrap text-[14px] font-bold text-brand first:mt-0">
    {children}
  </h3>
);

export function DesignPanel({ notice, onBack, onSave }: DesignPanelProps) {
  const dispatch = useDispatch();
  const { design, business } = useSelector(selectInvoiceDraft);

  const fileInput = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState("");
  const [optionalOpen, setOptionalOpen] = useState(true);

  const accent = THEME_COLORS[design.theme];
  const update = (changes: Partial<InvoiceDesign>) => dispatch(designChanged(changes));

  // the picked image is stored as a data URL (the design model keeps "image URL or data URL")
  const handleLogoFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the user pick the same file again
    if (!file) return;

    if (!file.type.startsWith("image/")) return setLogoError("Choose an image file");
    if (file.size > MAX_LOGO_BYTES) return setLogoError("Image must be under 1 MB");

    const reader = new FileReader();
    reader.onload = () => {
      setLogoError("");
      update({ logo: String(reader.result) });
    };
    reader.onerror = () => setLogoError("Could not read that file");
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="divide-y divide-line">
        {/* ---------- Template ---------- */}
        <section className="py-5 first:pt-0">
          <SectionTitle>Invoice template</SectionTitle>

          <div role="radiogroup" aria-label="Invoice template" className="grid grid-cols-3 gap-3">
            {TEMPLATE_OPTIONS.map((option) => {
              const selected = design.template === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update({ template: option.value })}
                  className="group flex flex-col items-center gap-1.5 text-center outline-none"
                >
                  <span
                    className={cn(
                      "relative block aspect-[3/4] w-full overflow-hidden rounded-lg border-2 transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring/30",
                      selected ? "border-brand" : "border-line group-hover:border-line-strong",
                    )}
                  >
                    <TemplateThumb template={option.value} accent={accent} />
                    {selected && (
                      <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      selected ? "font-semibold text-brand" : "text-muted-foreground",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------- Logo ---------- */}
        <section className="py-5">
          <SectionTitle>Logo</SectionTitle>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
            <div className="flex min-w-0 items-center gap-3">
              {design.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={design.logo}
                  alt=""
                  className="size-10 shrink-0 rounded-md object-contain"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <ImageIcon className="size-5" />
                </span>
              )}
              <p className="truncate text-sm font-medium">
                {design.logo ? business.name.trim() || "Your logo" : "No logo added"}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {design.logo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLogoError("");
                    update({ logo: "" });
                  }}
                >
                  Remove
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                {design.logo ? "Change" : "Upload"}
              </Button>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="sr-only"
              tabIndex={-1}
              aria-label="Upload logo"
              onChange={handleLogoFile}
            />
          </div>

          {logoError && (
            <p className="mt-2 text-xs text-danger" role="alert">
              {logoError}
            </p>
          )}
        </section>

        {/* ---------- Colour theme ---------- */}
        <section className="py-5">
          <SectionTitle>Color theme</SectionTitle>

          <div role="radiogroup" aria-label="Color theme" className="flex flex-wrap gap-3">
            {THEME_OPTIONS.map((option) => {
              const selected = design.theme === option.value;
              const color = THEME_COLORS[option.value];
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => update({ theme: option.value })}
                  className="flex size-9 items-center justify-center rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/30"
                  style={{
                    background: color,
                    boxShadow: selected
                      ? `0 0 0 2px var(--color-card, #fff), 0 0 0 4px ${color}`
                      : undefined,
                  }}
                >
                  {selected && <Check className="size-4 text-white" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------- Font ---------- */}
        <section className="py-5">
          <SectionTitle>Font</SectionTitle>
          <FormField
            type="select"
            name="font"
            options={FONT_OPTIONS}
            value={design.font}
            onChange={(value) => update({ font: value as InvoiceFont })}
          />
        </section>

        {/* ---------- Optional sections ---------- */}
        <section className="py-5">
          <button
            type="button"
            aria-expanded={optionalOpen}
            onClick={() => setOptionalOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <span className="flex items-center gap-2 text-sm font-semibold [&_svg]:size-4">
              <SectionTitle>
               <div className="flex gap-2" >
              <SlidersHorizontal />
              Optional sections
               </div>
              </SectionTitle>
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                optionalOpen && "rotate-180",
              )}
            />
          </button>

          {optionalOpen && (
            <div className="mt-2 divide-y divide-line">
              <ToggleRow
                icon={<StickyNote />}
                label="Show notes"
                checked={design.show_notes}
                onChange={(checked) => update({ show_notes: checked })}
              />
              <ToggleRow
                icon={<CreditCard />}
                label="Show payment terms"
                checked={design.show_payment_terms}
                onChange={(checked) => update({ show_payment_terms: checked })}
              />
              <ToggleRow
                icon={<Building2 />}
                label="Show business info"
                checked={design.show_business_info}
                onChange={(checked) => update({ show_business_info: checked })}
              />
            </div>
          )}
        </section>
      </div>

      {notice && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-medium"
        >
          <Check className="size-4" />
          {notice}
        </p>
      )}

      <div className="flex flex-wrap justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={() => onSave("draft")}>
            Save draft
          </Button>
          <Button type="button" variant="primary" onClick={() => onSave("final")}>
            Save invoice
          </Button>
        </div>
      </div>
    </div>
  );
}