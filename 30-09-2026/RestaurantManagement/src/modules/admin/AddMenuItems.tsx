import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge.tsx";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField";
import { ModifierPricing } from "../admin/ModifierPricing.tsx";
import { cn } from "../../lib/utils";
import type { RootState, AppDispatch } from "../../Redux/store";
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type NewMenuItem,
} from "../../Redux/Slices/menuItemSlice";
import { selectActiveModifiers } from "../../Redux/Slices/Modifierslice.ts";
import { formatPrice, type MenuItem } from "../../utils/MenuItemdata.ts";
import type { ItemModifierPrice, ModifierGroup } from "../../utils/Modifierdata";

/* ---------- helpers ---------- */
type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

type SectionLite = { id: number; name: string };

const chipCls = (on: boolean) =>
  cn(
    "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors",
    on
      ? "border-button-primary row-dull text-primary"
      : "border-line bg-primary text-secondary hover:bg-secondary",
  );

// FormField may hand back an event or the raw value; accept both
const read = (e: any) => (e?.target ? e.target.value : e);

const vegOptions = [
  { label: "Veg", value: "true" },
  { label: "Non-Veg", value: "false" },
];

const isValidUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

/** Indian-style veg / non-veg mark */
const VegMark = ({ isVeg }: { isVeg: boolean }) => (
  <span className="inline-flex items-center gap-2 text-sm">
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-[3px] border-2",
        isVeg ? "border-green-600" : "border-red-600",
      )}
    >
      <span
        className={cn("h-2 w-2 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")}
      />
    </span>
    {isVeg ? "Veg" : "Non-Veg"}
  </span>
);

const Thumb = ({ src, name }: { src: string; name: string }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed)
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-tertiary text-sm font-medium text-secondary">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-lg border border-line object-cover"
    />
  );
};

/* ---------- fields shared by Add + Edit dialogs ---------- */
const MenuItemFields = ({ values, setValue, errors }: Ctx) => {
  console.log("This is Menu Section values:" , values)
  const sections = useSelector((s: RootState) => s.menuSections.menuSections);
  const sectionId: number | "" = values.menuSectionId ?? "";
  const isActive = values.status !== "Inactive";

  // active sections, plus the item's current one even if it was deactivated later
  const sectionOptions = sections
    .filter((s) => s.status === "Active" || s.id === sectionId)
    .map((s) => ({ label: s.name, value: String(s.id) }));

  const changeSection = (raw: string) => {
    const id = Number(raw);
    if (id === sectionId) return;
    setValue("menuSectionId", id);
    // modifier groups differ per section, so earlier prices no longer apply
    setValue("modifierPrices", []);
  };

  return (
    <>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <FormField
          type="text"
          name="name"
          label="Item Name"
          placeholder="e.g. Margherita Pizza"
          value={values.name ?? ""}
          onChange={(e: any) => setValue("name", read(e))}
          error={errors.name}
          required
        />
        <FormField
          type="number"
          name="price"
          label="Base Price"
          placeholder="e.g. 199"
          value={values.price ?? ""}
          onChange={(e: any) => {
            const raw = read(e);
            setValue("price", raw === "" || raw == null ? "" : Number(raw));
          }}
          error={errors.price}
          required
        />
        <FormField
          type="select"
          name="menuSectionId"
          label="Menu Name"
          placeholder="Select a menu section"
          value={sectionId === "" ? "" : String(sectionId)}
          options={sectionOptions}
          onChange={(v: any) => changeSection(read(v))}
          error={errors.menuSectionId}
          required
        />
        <FormField
          type="select"
          name="isVeg"
          label="Veg / Non-Veg"
          value={String(values.isVeg ?? true)}
          options={vegOptions}
          onChange={(v: any) => setValue("isVeg", read(v) === "true")}
          error={errors.isVeg}
          required
        />
      </div>

      <FormField
        type="text"
        name="image"
        label="Image URL"
        placeholder="https://example.com/item.jpg"
        value={values.image ?? ""}
        onChange={(e: any) => setValue("image", read(e))}
        error={errors.image}
        required
      />

      <FormField
        type="textarea"
        name="description"
        label="Description"
        placeholder="Short description shown to customers"
        value={values.description ?? ""}
        onChange={(e: any) => setValue("description", read(e))}
        error={errors.description}
      />

      <div className="grid gap-3">
        <div>
          <p className="text-sm font-medium text-secondary">Modifier Prices</p>
          <p className="text-xs text-tertiary">
            Extra charge added to the base price. Leave blank to hide an option
            for this item.
          </p>
        </div>
        {sectionId !== "" ? (
          <ModifierPricing
            menuSectionId={sectionId}
            isVeg={values.isVeg ?? true}
            value={values.modifierPrices ?? []}
            onChange={(next) => setValue("modifierPrices", next)}
          />
        ) : (
          <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-tertiary">
            Select a menu name to set modifier prices.
          </p>
        )}
        {errors.modifierPrices && (
          <p className="text-xs text-danger">{errors.modifierPrices}</p>
        )}
      </div>

      <Switch
        id="status"
        aria-label="Status"
        checked={isActive}
        onCheckedChange={(c) => setValue("status", c ? "Active" : "Inactive")}
        className="data-checked:bg-slate-200 data-unchecked:bg-gray-300 dark:data-unchecked:bg-gray-600"
      />
    </>
  );
};

/* ---------- validation + normalising ---------- */
// built from the live modifier groups so required groups can be enforced
const makeValidate =
  (groups: ModifierGroup[]) =>
  (v: FormValues): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!String(v.name ?? "").trim()) errors.name = "Item name is required";
    if (v.menuSectionId === "" || v.menuSectionId == null)
      errors.menuSectionId = "Select a menu name";
    if (v.price === "" || v.price == null || Number(v.price) < 0)
      errors.price = "Enter a valid price";

    const image = String(v.image ?? "").trim();
    if (image && !isValidUrl(image))
      errors.image = "Enter a valid URL starting with http:// or https://";

    if (v.menuSectionId !== "" && v.menuSectionId != null) {
      const id = Number(v.menuSectionId);
      const prices: ItemModifierPrice[] = v.modifierPrices ?? [];
      const missing = groups
        .filter(
          (g) =>
            g.required &&
            g.menuSectionIds.includes(id) &&
            !prices.some((p) => p.groupId === g.id),
        )
        .map((g) => g.name);
      if (missing.length)
        errors.modifierPrices = `Price at least one option in: ${missing.join(", ")}`;
    }
    return errors;
  };

const makeNormalize =
  (sections: SectionLite[]) =>
  (v: FormValues): NewMenuItem => {
    const menuSectionId = Number(v.menuSectionId);
    return {
      name: String(v.name).trim(),
      menuSectionId,
      menuName: sections.find((s) => s.id === menuSectionId)?.name ?? "",
      isVeg: v.isVeg !== false,
      image: String(v.image ?? "").trim(),
      description: String(v.description ?? "").trim(),
      price: Number(v.price),
      status: v.status === "Inactive" ? "Inactive" : "Active",
      modifierPrices: ((v.modifierPrices ?? []) as ItemModifierPrice[]).filter(
        (p) => Number.isFinite(p.price) && p.price >= 0,
      ),
    };
  };

/* ---------- page ---------- */
const AddMenuItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((s: RootState) => s.menuItems.menuItems);
  const sections = useSelector((s: RootState) => s.menuSections.menuSections);
  const activeModifiers = useSelector(selectActiveModifiers);
  const [filter, setFilter] = useState<number | "all">("all");

  const validate = useMemo(() => makeValidate(activeModifiers), [activeModifiers]);
  const normalize = useMemo(() => makeNormalize(sections), [sections]);
  const visible =
    filter === "all" ? items : items.filter((i) => i.menuSectionId === filter);

  const columns: Column<MenuItem>[] = useMemo(
    () => [
      { key: "srNo", header: "Sr. No", className: "w-20", cell: (_r, i) => i + 1 },
      {
        key: "name",
        header: "Item",
        cell: (r) => (
          <div className="flex items-center gap-3">
            <Thumb src={r.image} name={r.name} />
            <div className="grid gap-0.5">
              <span className="font-medium text-primary">{r.name}</span>
              {r.description && (
                <span className="line-clamp-1 text-xs text-tertiary">
                  {r.description}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "menuName",
        header: "Menu Name",
        cell: (r) => (
          <Badge variant="menu">
            {/* live name if the section was renamed, saved name otherwise */}
            {sections.find((s) => s.id === r.menuSectionId)?.name ?? r.menuName}
          </Badge>
        ),
      },
      { key: "isVeg", header: "Type", cell: (r) => <VegMark isVeg={r.isVeg} /> },
      { key: "price", header: "Price", cell: (r) => formatPrice(r.price) },
      {
        key: "modifierPrices",
        header: "Modifiers",
        cell: (r) => `${r.modifierPrices.length} priced`,
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge variant={r.status === "Active" ? "active" : "inactive"}>
            {r.status}
          </Badge>
        ),
      },
    ],
    [sections],
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Menu Items</h1>

        <CommonDialog
          title="Add Menu Item"
          description="Set the base price here. Modifier options come from the Modifiers page."
          trigger={
            <Button className="flex items-center gap-2 cursor-pointer bg-button-primary text-white hover:bg-button-primary-hover">
              <Plus className="h-4 w-4" /> Add
            </Button>
          }
          defaultValues={{
            name: "",
            price: "",
            menuSectionId: filter === "all" ? "" : filter,
            isVeg: true,
            image: "",
            description: "",
            status: "Active",
            modifierPrices: [],
          }}
          validate={validate}
          onSubmit={(v) => {
            dispatch(addMenuItem(normalize(v)));
          }}
        >
          {(ctx) => <MenuItemFields {...ctx} />}
        </CommonDialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...sections.map((s) => s.id)] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={chipCls(filter === c)}
          >
            {c === "all" ? "All" : sections.find((s) => s.id === c)?.name}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={visible}
        onDelete={(row) => dispatch(deleteMenuItem(row.id))}
        editTitle="Edit Menu Item"
        validate={validate}
        renderEditForm={(ctx) => <MenuItemFields {...ctx} />}
        onEdit={(updated) => {
          dispatch(updateMenuItem({ id: updated.id, data: normalize(updated) }));
        }}
      />
    </div>
  );
};

export default AddMenuItems;