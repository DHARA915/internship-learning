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


export type ViewFieldType =
  | "text" // default
  | "longtext" // paragraph, full width
  | "status" // Active / Inactive badge
  | "veg" // veg / non-veg mark
  | "boolean" // Yes / No badge
  | "price" // ₹ amount ("Free" for 0)
  | "badge" // single neutral badge
  | "chips" // array of strings / {name, price} objects, horizontal
  | "groups"; // array of groups, each with its own options (e.g. modifiers)

export interface ViewField<T = Record<string, any>> {
  /** key on the record; supports "a.b" paths */
  key: string;
  label: string;
  type?: ViewFieldType;
  /** make the field span the full row (always true for longtext / chips / groups) */
  full?: boolean;
  /** compute the value from the whole record (derived / joined data) */
  getValue?: (data: T) => any;
  /** custom renderer; wins over `type` */
  render?: (value: any, data: T) => React.ReactNode;
  /** skip the field when this returns true */
  hidden?: (data: T) => boolean;
  /** type "groups": where each group keeps its options (default "options") */
  itemsKey?: string;
  /** type "groups": key holding the group name (default "name" / "groupName") */
  nameKey?: string;
}

export interface ViewHeader<T = Record<string, any>> {
  imageKey?: string;
  titleKey: string;
  descriptionKey?: string;
  /** small fields shown beside the title, e.g. veg mark + status */
  badges?: ViewField<T>[];
}

export interface ViewDialogProps<T extends Record<string, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string;
  description?: string;
  header?: ViewHeader<T>;
  /** omit to auto-lay-out every non-id field */
  fields?: ViewField<T>[];
  /** dialog width class, default "max-w-3xl" */
  className?: string;
}

/** what a module passes through DataTable (`viewConfig`) to describe its view */
export interface ViewConfig<T = Record<string, any>> {
  title?: string;
  description?: string;
  header?: ViewHeader<T>;
  fields?: ViewField<T>[];
  className?: string;
}

/* ---------- helpers ---------- */
const getPath = (obj: any, path: string) =>
  path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

const isEmpty = (v: unknown) =>
  v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);

const isObj = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const formatPrice = (n: number) => (n === 0 ? "Free" : `₹${n}`);

const formatLabel = (k: string) =>
  k
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const FULL_TYPES: ViewFieldType[] = ["longtext", "chips", "groups"];

/* ---------- small pieces ---------- */
const Dash = () => <span className="text-tertiary">—</span>;

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

const YesNo = ({ value }: { value: boolean }) => (
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

// "Large · ₹50" — strings, or objects with a name (+ optional price)
const Chip = ({ item }: { item: unknown }) => {
  let label = String(item);
  let price: number | undefined;
  if (isObj(item)) {
    const nameKey = ["name", "label", "title", "value"].find((k) => !isEmpty(item[k]));
    label = nameKey ? String(item[nameKey]) : "";
    if (typeof item.price === "number") price = item.price;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-primary px-2.5 py-1 text-sm text-secondary">
      {label}
      {price !== undefined && (
        <span
          className={cn(
            "rounded-md px-1.5 text-xs font-medium leading-5",
            price === 0 ? "bg-tertiary text-tertiary" : "row-dull text-button-primary",
          )}
        >
          {formatPrice(price)}
        </span>
      )}
    </span>
  );
};

const Chips = ({ items }: { items: unknown[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((it, i) => (
      <Chip key={i} item={it} />
    ))}
  </div>
);

const Thumb = ({ src, name }: { src?: string; name: string }) => {
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

/* ---------- groups (modifier groups etc.) ---------- */
const Groups = ({ groups, field }: { groups: any[]; field: ViewField<any> }) => {
  const itemsKey = field.itemsKey ?? "options";
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {groups.map((g, i) => {
        if (!isObj(g)) return null;
        const name =
          (field.nameKey && g[field.nameKey]) ?? g.groupName ?? g.name ?? `Group ${i + 1}`;
        const items: unknown[] = Array.isArray(g[itemsKey]) ? g[itemsKey] : [];
        const selection =
          g.selection === "single" ? "Choose one" : g.selection === "multiple" ? "Choose many" : null;

        return (
          <div key={i} className="overflow-hidden rounded-xl border border-line">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-tertiary/50 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-primary">{String(name)}</span>
                {g.type && (
                  <Badge variant="outline" className="border-line bg-primary text-secondary">
                    {formatLabel(String(g.type))}
                  </Badge>
                )}
                {selection && <span className="text-xs text-tertiary">{selection}</span>}
              </div>
              <div className="flex items-center gap-2">
                {g.required && (
                  <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                    Required
                  </Badge>
                )}
                <span className="text-xs text-tertiary">
                  {items.length} {items.length === 1 ? "option" : "options"}
                </span>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-3 text-xs text-tertiary">No options added.</p>
            ) : (
              <div className="p-4">
                <Chips items={items} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- value renderer ---------- */
const renderValue = (f: ViewField<any>, data: any): React.ReactNode => {
  const value = f.getValue ? f.getValue(data) : getPath(data, f.key);
  if (f.render) return f.render(value, data);
  if (isEmpty(value)) return <Dash />;

  switch (f.type) {
    case "status":
      return <StatusBadge value={value} />;
    case "veg":
      return <VegMark isVeg={value === true || value === "true"} />;
    case "boolean":
      return <YesNo value={Boolean(value)} />;
    case "price":
      return (
        <span className="text-sm font-medium text-primary">{formatPrice(Number(value))}</span>
      );
    case "badge":
      return (
        <Badge variant="outline" className="border-line bg-primary text-secondary">
          {String(value)}
        </Badge>
      );
    case "longtext":
      return <p className="text-sm leading-relaxed text-secondary">{String(value)}</p>;
    case "chips":
      return <Chips items={Array.isArray(value) ? value : [value]} />;
    case "groups":
      return Array.isArray(value) ? <Groups groups={value} field={f} /> : <Dash />;
    default:
      return <span className="break-words text-sm font-medium text-primary">{String(value)}</span>;
  }
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1 text-xs font-medium text-tertiary">{children}</p>
);


/* ---------- auto layout (module passed no fields) ---------- */
const isIdKey = (k: string) => k === "id" || k === "srNo" || /Ids?$/.test(k);
const CHILD_KEYS = ["options", "modifiers", "items"];

const autoConfig = (
  data: Record<string, any>,
): { header?: ViewHeader<any>; fields: ViewField<any>[] } => {
  const imageKey = ["image", "icon", "imageUrl", "photo", "thumbnail"].find(
    (k) => k in data,
  );
  const titleKey = ["name", "title"].find((k) => typeof data[k] === "string");

  const header: ViewHeader<any> | undefined =
    imageKey || titleKey
      ? {
          imageKey,
          titleKey: titleKey ?? "name",
          descriptionKey: "description" in data ? "description" : undefined,
          badges: [
            ...(typeof data.isVeg === "boolean"
              ? [{ key: "isVeg", label: "Type", type: "veg" as const }]
              : []),
            ...("status" in data
              ? [{ key: "status", label: "Status", type: "status" as const }]
              : []),
          ],
        }
      : undefined;

  const hero = new Set<string>(
    header ? [imageKey, titleKey, "isVeg", "status", "description"].filter(Boolean) as string[] : [],
  );

  const fields = Object.entries(data)
    .filter(([k]) => !isIdKey(k) && !hero.has(k))
    .map(([key, v]): ViewField<any> => {
      const label = formatLabel(key);
      if (key.toLowerCase() === "status") return { key, label, type: "status" };
      if (typeof v === "boolean") return { key, label, type: "boolean" };
      if (Array.isArray(v)) {
        const childKey = CHILD_KEYS.find((c) => isObj(v[0]) && Array.isArray(v[0][c]));
        const grouped =
          childKey && v.length > 0 && v.every((g) => isObj(g) && Array.isArray(g[childKey]));
        return grouped
          ? { key, label, type: "groups", itemsKey: childKey }
          : { key, label, type: "chips" };
      }
      if (isObj(v))
        return {
          key,
          label,
          render: (val) => (
            <span className="text-sm text-primary">
              {Object.entries(val)
                .filter(([k]) => !isIdKey(k))
                .map(([k, x]) => `${formatLabel(k)}: ${String(x)}`)
                .join(" · ")}
            </span>
          ),
        };
      if (typeof v === "string" && v.length > 60) return { key, label, type: "longtext" };
      return { key, label };
    });

  return { header, fields };
};

/* ---------- main ---------- */
export function ViewDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  data,
  title = "View Details",
  description = "View the complete details.",
  header: headerProp,
  fields: fieldsProp,
  className,
}: ViewDialogProps<T>) {
  if (!data) return null;

  // no config from the module -> lay the record out automatically
  const auto = autoConfig(data);
  const header = headerProp ?? (fieldsProp ? undefined : auto.header);
  const fields = fieldsProp ?? auto.fields;

  const visible = fields.filter((f) => !f.hidden?.(data));
  // groups get their own full-width section with a count; the rest go in the grid
  const groupFields = visible.filter((f) => f.type === "groups" && !f.render);
  const gridFields = visible.filter((f) => !(f.type === "groups" && !f.render));

  const titleText = header ? String(getPath(data, header.titleKey) ?? "") : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-h-[85vh] max-w-3xl gap-0 overflow-y-auto bg-primary p-0", className)}
      >
        <DialogHeader className="border-b border-line px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-sm text-tertiary">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          {header && (
            <div className="flex items-start gap-4">
              {header.imageKey && (
                <Thumb src={getPath(data, header.imageKey)} name={titleText} />
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="break-words text-xl font-semibold text-primary">
                  {titleText || "—"}
                </h2>
                {header.badges && header.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    {header.badges
                      .filter((b) => !b.hidden?.(data))
                      .map((b) => (
                        <span key={b.key}>{renderValue(b, data)}</span>
                      ))}
                  </div>
                )}
                {header.descriptionKey && !isEmpty(getPath(data, header.descriptionKey)) && (
                  <p className="text-sm leading-relaxed text-secondary">
                    {String(getPath(data, header.descriptionKey))}
                  </p>
                )}
              </div>
            </div>
          )}

          {gridFields.length > 0 && (
            <div className="grid gap-x-6 gap-y-4 rounded-xl border border-line bg-tertiary/30 p-4 sm:grid-cols-2">
              {gridFields.map((f) => (
                <div
                  key={f.key}
                  className={cn(
                    "min-w-0",
                    (f.full || (f.type && FULL_TYPES.includes(f.type))) && "sm:col-span-2",
                  )}
                >
                  <Label>{f.label}</Label>
                  {renderValue(f, data)}
                </div>
              ))}
            </div>
          )}

          {groupFields.map((f) => {
            const v = getPath(data, f.key);
            return (
              <section key={f.key}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary">{f.label}</h3>
                  <span className="rounded-full bg-tertiary px-2 py-0.5 text-[11px] font-medium text-secondary">
                    {Array.isArray(v) ? v.length : 0}
                  </span>
                </div>
                {isEmpty(v) ? (
                  <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-tertiary">
                    Nothing added.
                  </p>
                ) : (
                  renderValue(f, data)
                )}
              </section>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}