import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { SpecGroup, SpecRow } from "./Comparetype";

export const formatINR = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

export const get = (obj: any, path: string) => path.split(".").reduce((o, k) => o?.[k], obj);

export const humanize = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export const ColorDot = ({ name, hex }: { name: string; hex: string }) => (
  <span
    title={name}
    aria-label={name}
    className="size-5 shrink-0 rounded-full border border-line"
    style={{ background: hex }}
  />
);

export const isColor = (v: any) => v && typeof v === "object" && "hex" in v && "name" in v;

export function renderValue(v: any, labels?: boolean): ReactNode {
  if (v == null || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return v.toLocaleString("en-IN");
  if (typeof v === "string") return v;

  // list of colours -> dots
  if (Array.isArray(v) && v.length > 0 && v.every(isColor)) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {v.map((c) => (
          <ColorDot key={c.name} name={c.name} hex={c.hex} />
        ))}
      </div>
    );
  }

  // one colour -> dot + name
  if (isColor(v)) {
    return (
      <span className="inline-flex items-center gap-2">
        <ColorDot name={v.name} hex={v.hex} />
        {v.name}
      </span>
    );
  }

  // list of strings -> one per line
  if (Array.isArray(v)) {
    return v.length === 0 ? (
      "—"
    ) : (
      <div className="space-y-0.5">
        {v.map((x, i) => (
          <div key={i}>{String(x)}</div>
        ))}
      </div>
    );
  }

  // object -> one value per line (optionally "Key value")
  return (
    <div className="space-y-0.5">
      {Object.entries(v)
        .filter(([, x]) => x != null && x !== "")
        .map(([k, x]) => (
          <div key={k}>
            {labels && <span className="text-secondary">{humanize(k)} </span>}
            {typeof x === "boolean" ? (x ? "Yes" : "No") : String(x)}
          </div>
        ))}
    </div>
  );
}

/* ---------- the one-line row builder ---------- */
export interface RowOptions {
  labels?: boolean;
}

export const row = (
  label: string,
  path: string,
  icon: LucideIcon,
  group: SpecGroup,
  opts: RowOptions = {},
): SpecRow => ({
  key: path,
  label,
  icon,
  group,
  render: (p) => renderValue(get(p, path), opts.labels),
});