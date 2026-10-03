import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField";
import { cn } from "../../lib/utils";
import type { RootState, AppDispatch } from "../../Redux/store";
import {
  addModifier,
  updateModifier,
  deleteModifier,
  type NewModifier,
} from "../../Redux/Slices/Modifierslice.ts";
import {
  MENU_CATEGORIES,
  MENU_CATEGORY_LABELS,
  MODIFIER_LIMITS,
  MODIFIER_TYPE_LABELS,
  type MenuCategory,
  type ModifierGroup,
  type ModifierOption,
  type ModifierType,
} from "../../utils/Modifierdata";


/* ---------- shared dialog fields (Add + Edit) ---------- */
type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

const inputCls =
  "h-10 rounded-lg border-line bg-primary px-3 text-sm text-primary shadow-none transition-colors " +
  "placeholder:text-tertiary focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20";

const chipCls = (on: boolean) =>
  cn(
    "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors",
    on
      ? "border-button-primary row-dull text-primary"
      : "border-line bg-primary text-secondary hover:bg-secondary",
  );

const blankOptions = (type: ModifierType): ModifierOption[] => {
  const l = MODIFIER_LIMITS[type];
  const names = l.defaults ?? Array<string>(l.min).fill("");
  return names.map((name) => ({ id: nanoid(), name }));
};

// const ModifierFields = ({ values, setValue, errors }: Ctx) => {
//   const type: ModifierType = values.type ?? "base";
//   const limit = MODIFIER_LIMITS[type];
//   const options: ModifierOption[] = values.options ?? [];
//   const categories: MenuCategory[] = values.categories ?? [];
//   const isActive = values.status !== "Inactive";

//   const toggleCategory = (c: MenuCategory) =>
//     setValue(
//       "categories",
//       categories.includes(c) ? categories.filter((x) => x !== c) : [...categories, c],
//     );
//   const changeType = (t: ModifierType) => {
//     if (t === type) return;
//     setValue("type", t);
//     setValue("options", blankOptions(t));
//   };
//   const renameOption = (i: number, name: string) =>
//     setValue(
//       "options",
//       options.map((o, idx) => (idx === i ? { ...o, name } : o)),
//     );
//   const addOption = () =>
//     options.length < limit.max &&
//     setValue("options", [...options, { id: nanoid(), name: "" }]);
//   const removeOption = (i: number) =>
//     options.length > limit.min &&
//     setValue(
//       "options",
//       options.filter((_, idx) => idx !== i),
//     );

    

//   return (
//     <>
//       <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
//         <FormField
//           type="text"
//           name="name"
//           label="Modifier Group Name"
//           placeholder="e.g. Add-on Sauces"
//           value={values.name ?? ""}
//           onChange={(e: any) => setValue("name", e?.target ? e.target.value : e)}
//           error={errors.name}
//         />

//         <div className="grid content-start gap-1.5">
//           <Label htmlFor="modifier-type" className="text-sm font-medium text-secondary">
//             Type
//           </Label>
//           <Select value={type} onValueChange={(v) => changeType(v as ModifierType)}>
//             <SelectTrigger id="modifier-type" className={`${inputCls} w-full`}>
//               <SelectValue placeholder="Select a type" />
//             </SelectTrigger>
//             <SelectContent className="rounded-lg border-line bg-primary text-primary">
//               {(Object.keys(MODIFIER_TYPE_LABELS) as ModifierType[]).map((t) => (
//                 <SelectItem
//                   key={t}
//                   value={t}
//                   className="cursor-pointer focus:bg-brand-soft focus:text-brand"
//                 >
//                   {MODIFIER_TYPE_LABELS[t]}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <p className="text-xs text-tertiary">
//             {limit.required ? "Required" : "Optional"} ·{" "}
//             {limit.selection === "single" ? "customer picks one" : "customer can pick several"}
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-2">
//         <Label className="text-sm font-medium text-secondary">
//           Used for<span className="ml-0.5 text-danger">*</span>
//         </Label>
//         <div className="flex flex-wrap gap-2">
//           {MENU_CATEGORIES.map((c) => (
//             <button
//               key={c}
//               type="button"
//               aria-pressed={categories.includes(c)}
//               onClick={() => toggleCategory(c)}
//               className={chipCls(categories.includes(c))}
//             >
//               {MENU_CATEGORY_LABELS[c]}
//             </button>
//           ))}
//         </div>
//         {errors.categories && <p className="text-xs text-danger">{errors.categories}</p>}
//       </div>

//       <div className="grid gap-2">
//         <div className="flex items-center justify-between">
//           <Label className="text-sm font-medium text-secondary">
//             Options<span className="ml-0.5 text-danger">*</span>
//           </Label>
//           <span className="text-xs text-tertiary">
//             {options.length}/{limit.max}
//           </span>
//         </div>

//         {options.map((o, i) => (
//           <div key={o.id} className="flex items-center gap-2">
//             <Input
//               value={o.name}
//               placeholder={limit.placeholders[i] ?? "Option name"}
//               onChange={(e) => renameOption(i, e.target.value)}
//               className={inputCls}
//             />
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               aria-label="Remove option"
//               disabled={options.length <= limit.min}
//               onClick={() => removeOption(i)}
//               className="h-9 w-9 shrink-0 cursor-pointer rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         ))}

//         {errors.options && <p className="text-xs text-danger">{errors.options}</p>}

//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           disabled={options.length >= limit.max}
//           onClick={addOption}
//           className="w-fit cursor-pointer rounded-lg border-line bg-tertiary text-primary"
//         >
//           <Plus className="mr-1 h-4 w-4" /> Add option
//         </Button>
//         <p className="text-xs text-tertiary">
//           Prices are set per item in the Add Item section.
//         </p>
//       </div>

//       <label
//         htmlFor="status"
//         className="flex cursor-pointer items-center justify-between rounded-lg border border-line px-3 py-2.5"
//       >
//         <span className="text-sm font-medium text-primary">
//           {isActive ? "Active" : "Inactive"}
//         </span>
//         <Switch
//           id="status"
//           aria-label="Status"
//           checked={isActive}
//           onCheckedChange={(c) => setValue("status", c ? "Active" : "Inactive")}
//           className="data-checked:bg-slate-200 data-unchecked:bg-gray-300 dark:data-unchecked:bg-gray-600"
//         />
//       </label>
//     </>
//   );
// };

const ModifierFields = ({ values, setValue, errors }: Ctx) => {
  const type: ModifierType = values.type ?? "base";
  const limit = MODIFIER_LIMITS[type];
  const options: ModifierOption[] = values.options ?? [];
  const categories: MenuCategory[] = values.categories ?? [];
  const isActive = values.status !== "Inactive";

  const modifierTypeOptions = (
    Object.keys(MODIFIER_TYPE_LABELS) as ModifierType[]
  ).map((type) => ({
    label: MODIFIER_TYPE_LABELS[type],
    value: type,
  }));

  const categoryOptions = MENU_CATEGORIES.map((category) => ({
    label: MENU_CATEGORY_LABELS[category],
    value: category,
  }));

  const changeType = (t: ModifierType) => {
    if (t === type) return;
    setValue("type", t);
    setValue("options", blankOptions(t));
  };

  const renameOption = (i: number, name: string) =>
    setValue(
      "options",
      options.map((o, idx) => (idx === i ? { ...o, name } : o)),
    );

  const addOption = () => {
    if (options.length < limit.max) {
      setValue("options", [...options, { id: nanoid(), name: "" }]);
    }
  };

  const removeOption = (i: number) => {
    if (options.length > limit.min) {
      setValue(
        "options",
        options.filter((_, idx) => idx !== i),
      );
    }
  };

  return (
    <>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <FormField
          type="text"
          name="name"
          label="Modifier Group Name"
          placeholder="e.g. Add-on Sauces"
          value={values.name ?? ""}
          onChange={(value) => setValue("name", value)}
          error={errors.name}
          required
        />

        <FormField
          type="select"
          name="type"
          label="Type"
          value={type}
          options={modifierTypeOptions}
          placeholder="Select a type"
          onChange={(value) => changeType(value as ModifierType)}
          error={errors.type}
          required
          helperText={`${limit.required ? "Required" : "Optional"} · ${
            limit.selection === "single"
              ? "customer picks one"
              : "customer can pick several"
          }`}
        />
      </div>

      <FormField
        type="multiselect"
        name="categories"
        label="Used for"
        value={categories}
        options={categoryOptions}
        placeholder="Select menu categories"
        onChange={(value) => setValue("categories", value as MenuCategory[])}
        error={errors.categories}
        required
      />

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-secondary">
            Options<span className="ml-0.5 text-danger">*</span>
          </Label>
          <span className="text-xs text-tertiary">
            {options.length}/{limit.max}
          </span>
        </div>

        {options.map((o, i) => (
          <div key={o.id} className="flex items-center gap-2">
            <Input
              value={o.name}
              placeholder={limit.placeholders[i] ?? "Option name"}
              onChange={(e) => renameOption(i, e.target.value)}
              className={inputCls}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove option"
              disabled={options.length <= limit.min}
              onClick={() => removeOption(i)}
              className="h-9 w-9 shrink-0 cursor-pointer rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {errors.options && (
          <p className="text-xs text-danger">{errors.options}</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={options.length >= limit.max}
          onClick={addOption}
          className="w-fit cursor-pointer rounded-lg border-line bg-tertiary text-primary"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add option
        </Button>

        <p className="text-xs text-tertiary">
          Prices are set per item in the Add Item section.
        </p>
      </div>

        <Switch
          id="status"
          aria-label="Status"
          checked={isActive}
          onCheckedChange={(checked) =>
            setValue("status", checked ? "Active" : "Inactive")
          }
          className="data-checked:bg-slate-200 data-unchecked:bg-gray-300 dark:data-unchecked:bg-gray-600"
        />
    </>
  );
};

/* ---------- validation + normalising ---------- */
const validate = (v: FormValues) => {
  const errors: Record<string, string> = {};
  if (!String(v.name ?? "").trim()) errors.name = "Modifier group name is required";

  if (!(v.categories ?? []).length)
    errors.categories = "Select at least one menu category";

  const limit = MODIFIER_LIMITS[(v.type as ModifierType) ?? "base"];
  const names = (v.options ?? [])
    .map((o: ModifierOption) => o.name.trim().toLowerCase())
    .filter(Boolean);

  if (names.length < limit.min)
    errors.options = `Add at least ${limit.min} options`;
  else if (new Set(names).size !== names.length)
    errors.options = "Option names must be unique";
  return errors;
};

const normalize = (v: FormValues): NewModifier => {
  const type: ModifierType = v.type ?? "base";
  return {
    name: String(v.name).trim(),
    type,
    selection: MODIFIER_LIMITS[type].selection,
    required: MODIFIER_LIMITS[type].required,
    categories: v.categories ?? [],
    status: v.status === "Inactive" ? "Inactive" : "Active",
    options: (v.options ?? [])
      .map((o: ModifierOption) => ({ id: o.id || nanoid(), name: o.name.trim() }))
      .filter((o: ModifierOption) => o.name),
  };
};

/* ---------- table columns ---------- */
const columns: Column<ModifierGroup>[] = [
  { key: "srNo", header: "Sr. No", className: "w-20", cell: (_r, i) => i + 1 },
  { key: "name", header: "Modifier Group" },
  { key: "type", header: "Type", cell: (r) => MODIFIER_TYPE_LABELS[r.type] },
  {
    key: "categories",
    header: "Used for",
    cell: (r) => (
      <div className="flex flex-wrap gap-1.5">
        {r.categories?.map((c) => (
          <span key={c} className="rounded-md bg-brand-soft px-2 py-0.5 text-xs text-brand">
            {MENU_CATEGORY_LABELS[c]}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: "options",
    header: "Options",
    cell: (r) => (
      <div className="flex flex-wrap gap-1.5">
        {r.options.map((o) => (
          <span
            key={o.id}
            className="rounded-md border border-line bg-tertiary px-2 py-0.5 text-xs text-secondary"
          >
            {o.name}
          </span>
        ))}
      </div>
    ),
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
];

/* ---------- page ---------- */
const AddModifier = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modifiers = useSelector((s: RootState) => s.modifiers.modifiers);
  const [filter, setFilter] = useState<MenuCategory | "all">("all");
  const visible =
    filter === "all"
      ? modifiers
      : modifiers.filter((m) => m.categories?.includes(filter));

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Modifiers</h1>

        <CommonDialog
          title="Add Modifier Group"
          description="Define the choices customers see. Set prices when adding an item."
          trigger={
            <Button className="flex items-center gap-2 cursor-pointer bg-button-primary text-white hover:bg-button-primary-hover">
              <Plus className="h-4 w-4" /> Add
            </Button>
          }
          defaultValues={{
            name: "",
            type: "base",
            status: "Active",
            categories: filter === "all" ? [] : [filter],
            options: blankOptions("base"),
          }}
          validate={validate}
          onSubmit={(v) => {
            dispatch(addModifier(normalize(v)));
          }}
        >
          {(ctx) => <ModifierFields {...ctx} />}
        </CommonDialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...MENU_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={chipCls(filter === c)}
          >
            {c === "all" ? "All" : MENU_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={visible}
        onDelete={(row) => dispatch(deleteModifier(row.id))}
        editTitle="Edit Modifier Group"
        validate={validate}
        renderEditForm={(ctx) => <ModifierFields {...ctx} />}
        onEdit={(updated) => {
          dispatch(updateModifier({ id: updated.id, data: normalize(updated) }));
        }}
      />
    </div>
  );
};

export default AddModifier;