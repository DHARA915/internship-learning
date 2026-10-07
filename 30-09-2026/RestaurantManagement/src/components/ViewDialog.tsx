import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

/**
 * Generic "view details" dialog. It works for any record and lays itself out
 * from the shape of the data:
 *   - image / name / veg / status  -> hero header
 *   - description                  -> full-width paragraph
 *   - arrays of groups (each with options / modifiers / items) -> group cards
 *   - everything else              -> label / value grid
 */
interface ViewDialogProps<T extends Record<string, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string;
  description?: string;
  /** Fields that should not be displayed. */
  excludeFields?: string[];
}

/* ---------- helpers ---------- */
const IMAGE_KEYS = ["image", "imageUrl", "photo", "thumbnail"];
const TITLE_KEYS = ["name", "title"];
const CHILD_KEYS = ["options", "modifiers", "items"];

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const isEmpty = (v: unknown) =>
  v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);

const isPlainObject = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const childKeyOf = (g: Record<string, any>) =>
  CHILD_KEYS.find((k) => Array.isArray(g[k]));

// array of objects that each carry their own list of options
const isGroupArray = (v: unknown): v is Record<string, any>[] =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.every((g) => isPlainObject(g) && childKeyOf(g));

const formatPrice = (n: number) => (n === 0 ? "Free" : `₹${n}`);

/* ---------- small pieces ---------- */
const StatusBadge = ({ value }: { value: unknown }) => {
  const active = String(value).toLowerCase() === "active" || value === true;
  return (
    <Badge
      variant="outline"
      className={
        active
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger"
      }
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          active ? "bg-success" : "bg-danger",
        )}
      />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
};

const VegMark = ({ isVeg }: { isVeg: boolean }) => (
  <span className="inline-flex items-center gap-2 text-sm text-secondary">
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-[3px] border-2",
        isVeg ? "border-green-600" : "border-red-600",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isVeg ? "bg-green-600" : "bg-red-600",
        )}
      />
    </span>
    {isVeg ? "Veg" : "Non-Veg"}
  </span>
);

const HeroImage = ({ src, name }: { src?: string; name: string }) => {
  const [failed, setFailed] = React.useState(false);
  if (!src || failed)
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-line bg-tertiary text-2xl font-semibold text-secondary">
        {name.charAt(0).toUpperCase() || "?"}
      </div>
    );
  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="h-20 w-20 shrink-0 rounded-xl border border-line object-cover"
    />
  );
};

const SectionTitle = ({ label, count }: { label: string; count?: number }) => (
  <div className="mb-2 flex items-center gap-2">
    <h3 className="text-sm font-semibold text-primary">{label}</h3>
    {count !== undefined && (
      <span className="rounded-full bg-tertiary px-2 py-0.5 text-[11px] font-medium text-secondary">
        {count}
      </span>
    )}
  </div>
);

const Value = ({ value, fieldName }: { value: unknown; fieldName?: string }) => {
  if (isEmpty(value)) return <span className="text-tertiary">—</span>;

  if (fieldName?.toLowerCase() === "status") return <StatusBadge value={value} />;

  if (typeof value === "boolean")
    return (
      <Badge
        variant="outline"
        className={
          value
            ? "border-success/30 bg-success/10 text-success"
            : "border-danger/30 bg-danger/10 text-danger"
        }
      >
        {value ? "Yes" : "No"}
      </Badge>
    );

  if (Array.isArray(value))
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((item, i) => (
          <Badge key={i} variant="outline" className="border-line bg-primary text-secondary">
            {typeof item === "object" ? JSON.stringify(item) : String(item)}
          </Badge>
        ))}
      </div>
    );

  if (isPlainObject(value))
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(value)
          .filter(([k]) => k !== "id" && k !== "srNo")
          .map(([k, v]) => (
            <Field key={k} label={formatLabel(k)}>
              <Value value={v} fieldName={k} />
            </Field>
          ))}
      </div>
    );

  return (
    <span className="break-words text-sm font-medium text-primary">
      {String(value)}
    </span>
  );
};

const Field = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("min-w-0", className)}>
    <p className="mb-1 text-xs font-medium text-tertiary">{label}</p>
    {children}
  </div>
);

/* ---------- group cards (modifier groups etc.) ---------- */
const GroupCards = ({ groups }: { groups: Record<string, any>[] }) => (
  <div className="grid gap-3">
    {groups.map((g, gi) => {
      const children: any[] = g[childKeyOf(g)!] ?? [];
      const name = g.groupName ?? g.name ?? g.title ?? `Group ${gi + 1}`;
      const selection =
        g.selection === "single"
          ? "Choose one"
          : g.selection === "multiple"
            ? "Choose many"
            : null;
      const required = g.required ?? g.isRequired;

      return (
        <div key={g.groupId ?? g.id ?? gi} className="overflow-hidden rounded-xl border border-line">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-tertiary/50 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-primary">{name}</span>
              {g.type && (
                <Badge variant="outline" className="border-line bg-primary text-secondary">
                  {formatLabel(String(g.type))}
                </Badge>
              )}
              {selection && <span className="text-xs text-tertiary">{selection}</span>}
            </div>
            <div className="flex items-center gap-2">
              {required && (
                <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                  Required
                </Badge>
              )}
              <span className="text-xs text-tertiary">
                {children.length} {children.length === 1 ? "option" : "options"}
              </span>
            </div>
          </div>

          {children.length === 0 ? (
            <p className="px-4 py-3 text-xs text-tertiary">No options added.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {children.map((c, ci) => {
                const obj = isPlainObject(c) ? c : { name: c };
                const label = obj.name ?? obj.label ?? obj.optionName ?? obj.value ?? `Option ${ci + 1}`;
                const price = obj.price ?? obj.additionalPrice;
                return (
                  <li key={obj.id ?? ci} className="flex items-center justify-between gap-3 px-4 py-2">
                    <span className="text-sm text-secondary">{String(label)}</span>
                    {typeof price === "number" && (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          price === 0 ? "text-tertiary" : "text-primary",
                        )}
                      >
                        {formatPrice(price)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    })}
  </div>
);

/* ---------- main dialog ---------- */
export function ViewDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  data,
  title = "View Details",
  description = "View the complete details.",
  excludeFields = ["id", "srNo"],
}: ViewDialogProps<T>) {
  if (!data) return null;

  const entries = Object.entries(data).filter(([k]) => !excludeFields.includes(k));

  // pull out the fields that make up the hero header
  const imageKey = IMAGE_KEYS.find((k) => k in data);
  const titleKey = TITLE_KEYS.find((k) => typeof data[k] === "string");
  const hasHero = Boolean(imageKey || titleKey);
  const heroKeys = new Set(
    [imageKey, titleKey, "isVeg", "status", "description"].filter(Boolean) as string[],
  );

  const groupEntries = entries.filter(([, v]) => isGroupArray(v));
  const fieldEntries = entries.filter(
    ([k, v]) => !isGroupArray(v) && !(hasHero && heroKeys.has(k)),
  );
  // long text spans the full row
  const isWide = (v: unknown) =>
    Array.isArray(v) || isPlainObject(v) || (typeof v === "string" && v.length > 60);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-y-auto bg-primary p-0">
        <DialogHeader className="border-b border-line px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-sm text-tertiary">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          {/* hero */}
          {hasHero && (
            <div className="flex items-start gap-4">
              {imageKey && (
                <HeroImage src={data[imageKey]} name={String(data[titleKey ?? ""] ?? "")} />
              )}
              <div className="min-w-0 flex-1 space-y-2">
                {titleKey && (
                  <h2 className="break-words text-xl font-semibold text-primary">
                    {String(data[titleKey])}
                  </h2>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {typeof data.isVeg === "boolean" && <VegMark isVeg={data.isVeg} />}
                  {"status" in data && <StatusBadge value={data.status} />}
                </div>
                {!isEmpty(data.description) && (
                  <p className="text-sm leading-relaxed text-secondary">
                    {String(data.description)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* remaining fields */}
          {fieldEntries.length > 0 && (
            <div className="grid gap-x-6 gap-y-4 rounded-xl border border-line bg-tertiary/30 p-4 sm:grid-cols-2">
              {fieldEntries.map(([k, v]) => (
                <Field key={k} label={formatLabel(k)} className={cn(isWide(v) && "sm:col-span-2")}>
                  <Value value={v} fieldName={k} />
                </Field>
              ))}
            </div>
          )}

          {/* groups */}
          {groupEntries.map(([k, v]) => (
            <section key={k}>
              <SectionTitle label={formatLabel(k)} count={(v as unknown[]).length} />
              <GroupCards groups={v as Record<string, any>[]} />
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}