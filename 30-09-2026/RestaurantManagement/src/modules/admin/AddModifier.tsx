import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge.tsx";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField";
import { cn } from "../../lib/utils";
import { Filter } from "../../components/Filter.tsx";
import type { RootState, AppDispatch } from "../../Redux/store";
import {
  addModifier,
  updateModifier,
  deleteModifier,
  type NewModifier,
} from "../../Redux/Slices/Modifierslice.ts";
import {
  MODIFIER_LIMITS,
  MODIFIER_TYPE_LABELS,
  type ModifierGroup,
  type ModifierOption,
  type ModifierType,
  type Selection,
} from "../../utils/Modifierdata";
import { formatPrice } from "../../utils/MenuItemdata.ts";

/* ---------- shared dialog fields (Add + Edit) ---------- */
type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

const inputCls =
  "rounded-lg border-line bg-primary px-3 text-sm text-primary shadow-none transition-colors " +
  "placeholder:text-tertiary";

const chipCls = (on: boolean) =>
  cn(
    "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors",
    on
      ? "border-button-primary row-dull text-primary"
      : "border-line bg-primary text-secondary hover:bg-secondary",
  );

// const blankOptions = (type: ModifierType): ModifierOption[] => {
//   const l = MODIFIER_LIMITS[type];
//   const names = l.defaults ?? Array<string>(l.min).fill("");
//   return names.map((name) => ({ id: nanoid(), name }));
// };

// AFTER: a new group starts with exactly one empty option


const blankOptions = (): ModifierOption[] => [
  { id: nanoid(), name: "", isVeg: true },
];

// NEW: the two choices for an add-on
const selectionOptions = [
  { label: "Choose One", value: "single" },
  { label: "Choose Many", value: "multiple" },
];

const modifierTypeOptions = (
  Object.keys(MODIFIER_TYPE_LABELS) as ModifierType[]
).map((t) => ({ label: MODIFIER_TYPE_LABELS[t], value: t }));

const ModifierFields = ({ values, setValue, errors }: Ctx) => {
  const sections = useSelector((s: RootState) => s.menuSections.menuSections);
  const type: ModifierType = values.type ?? "preference";
  const limit = MODIFIER_LIMITS[type];
  const isAddon = type === "addon";
  const options: ModifierOption[] = values.options ?? [];
  const sectionIds: number[] = values.menuSectionIds ?? [];
  const selection: Selection = values.selection ?? limit.selection;
  const isActive = values.status !== "Inactive";

  // active sections, plus any already selected so an edit never loses one
  // const sectionOptions = sections
  //   .filter((s) => s.status === "Active" || sectionIds.includes(s.id))
  //   .map((s) => ({ label: s.name, value: String(s.id) }));



  const changeType = (t: ModifierType) => {
    if (t === type) return;
    setValue("type", t);
    setValue("selection", MODIFIER_LIMITS[t].selection);
  };

  const updateOption = (i: number, updates: Partial<ModifierOption>) =>
    setValue(
      "options",
      options.map((o, idx) => (idx === i ? { ...o, ...updates } : o)),
    );
  const addOption = () =>
    setValue("options", [...options, { id: nanoid(), name: "", isVeg: true }]);

  const removeOption = (i: number) => {
    if (options.length > 1) {
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
        />
      </div>

      {/* <FormField
        type="multiselect"
        name="menuSectionIds"
        label="Used for"
        value={sectionIds.map(String)}
        options={sectionOptions}
        placeholder="Select menu sections"
        onChange={(value) =>
          setValue("menuSectionIds", (value as string[]).map(Number))
        }
        error={errors.menuSectionIds}
        required
      /> */}

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {isAddon && (
          <div>
            <FormField
              type="select"
              name="selection"
              label="Selection Type"
              value={selection}
              options={selectionOptions}
              placeholder="Select single or multi"
              onChange={(value) => setValue("selection", value as Selection)}
              error={errors.selection}
              required
            />
          </div>
        )}

        {/* <div className={cn(!isAddon && "sm:col-span-2")}>
          <FormField
            type="multiselect"
            name="menuSectionIds"
            label="Used for"
            value={sectionIds.map(String)}
            options={sectionOptions}
            placeholder="Select menu sections"
            onChange={(value) =>
              setValue("menuSectionIds", (value as string[]).map(Number))
            }
            error={errors.menuSectionIds}
            required
          />
        </div> */}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-secondary">
            Options<span className="ml-0.5 text-danger">*</span>
          </Label>
          <span className="text-xs text-tertiary">
            {options.length} {options.length === 1 ? "option" : "options"}
          </span>
        </div>

        {options.map((o, i) => (
          <div key={o.id} className="flex items-center gap-2">
            <Input
              value={o.name}
              placeholder={`Ex. ${limit.placeholders[i] ?? "Option name"}`}
              onChange={(e) => updateOption(i, { name: e.target.value })}
              className={inputCls}
            />

            {limit.hasPrice && (
              <Input
                type="number"
                min={0}
                value={o.price ?? ""}
                placeholder="Price"
                onChange={(e) =>
                  updateOption(i, {
                    price:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className={cn(inputCls, "w-28 shrink-0")}
              />
            )}

            {options.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove option"
                onClick={() => removeOption(i)}
                className="size-8 shrink-0 cursor-pointer rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <span className="size-8 shrink-0" aria-hidden />
            )}
          </div>
        ))}

        {errors.options && (
          <p className="text-xs text-danger">{errors.options}</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
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
  if (!String(v.name ?? "").trim())
    errors.name = "Modifier group name is required";

  const type: ModifierType = (v.type as ModifierType) ?? "preference";
  const limit = MODIFIER_LIMITS[type];

  // NEW: add-on must have a selection type
  if (
    limit.chooseSelection &&
    v.selection !== "single" &&
    v.selection !== "multiple"
  )
    errors.selection = "Select single or multi select";

  const opts: ModifierOption[] = v.options ?? [];
  const names = opts.map((o) => o.name.trim().toLowerCase()).filter(Boolean);

  if (names.length < limit.min) errors.options = "Add at least 1 option";
  else if (new Set(names).size !== names.length)
    errors.options = "Option names must be unique";
  else if (limit.hasPrice && opts.some((o) => o.price != null && o.price < 0))
    errors.options = "Price cannot be negative";
  return errors;
};

const normalize = (v: FormValues): NewModifier => {
  const type: ModifierType = v.type ?? "preference";
  const limit = MODIFIER_LIMITS[type];
  // add-on: use what the admin picked; preference: always single
  const selection: Selection = limit.chooseSelection
    ? v.selection === "single"
      ? "single"
      : "multiple"
    : limit.selection;

  return {
    name: String(v.name).trim(),
    type,
    selection,
    required: limit.required,
    menuSectionIds: ((v.menuSectionIds ?? []) as (number | string)[]).map(
      Number,
    ),
    status: v.status === "Inactive" ? "Inactive" : "Active",
    options: (v.options ?? [])
      .map((o: ModifierOption) => ({
        id: o.id || nanoid(),
        name: o.name.trim(),
        isVeg: o.isVeg ?? true, // was being dropped
        ...(limit.hasPrice ? { price: Number(o.price) || 0 } : {}), // NEW: default price
      }))
      .filter((o: ModifierOption) => o.name),
  };
};

/* ---------- page ---------- */
const AddModifier = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modifiers = useSelector((s: RootState) => s.modifiers.modifiers);
  const sections = useSelector((s: RootState) => s.menuSections.menuSections);
  const [filter, setFilter] = useState<number | "all">("all");

   const chipOptions = useMemo(
    () => [
      { value: "all" as const, label: "All" },
      ...sections.map((s) => ({
        value: s.id,
        label: s.name,
        count: modifiers.filter((m) => m.menuSectionIds?.includes(s.id)).length,
      })),
    ],
    [sections, modifiers],
  );

  const visible =
    filter === "all"
      ? modifiers
      : modifiers.filter((m) => m.menuSectionIds?.includes(filter));

  const columns: Column<ModifierGroup>[] = useMemo(
    () => [
      {
        key: "srNo",
        header: "Sr. No",
        className: "w-20",
        cell: (_r, i) => i + 1,
      },
      { key: "name", header: "Modifier Group" },
      // {
      //   key: "type",
      //   header: "Type",
      //   cell: (r) => MODIFIER_TYPE_LABELS[r.type],
      // },
      {
        key: "type",
        header: "Type",
        cell: (r) => (
          <span>
            {MODIFIER_TYPE_LABELS[r.type]}
          </span>
        ),
      },
      {
        key: "options",
        header: "Options",
        cell: (r) => (
          <div className="flex flex-wrap gap-1.5">
            {r.options.map((o) => (
              <Badge key={o.id} variant="option">
                {o.name}
                {r.type === "addon" && o.price
                  ? ` · ${formatPrice(o.price)}`
                  : ""}
              </Badge>
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
    ],
    [sections],
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-5">

        <h1 className="border-l-4 border-button-primary pl-3 text-xl font-semibold">Modifiers</h1>

        </div>

        <div className="flex items-center gap-3">
      <Filter options={chipOptions} value={filter} onChange={setFilter} />


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
            type: "preference",
            selection: "single",
            status: "Active",
            menuSectionIds: filter === "all" ? [] : [filter],
            options: blankOptions(),
          }}
          validate={validate}
          onSubmit={(v) => {
            const data = normalize(v);

            console.log("Submitted JSON:", data);

            dispatch(addModifier(data));
          }}
        >
          {(ctx) => <ModifierFields {...ctx} />}
        </CommonDialog>
        </div>

      </div>


      <DataTable
        columns={columns}
        data={visible}
        onDelete={(row) => dispatch(deleteModifier(row.id))}
        editTitle="Edit Modifier Group"
        validate={validate}
        renderEditForm={(ctx) => <ModifierFields {...ctx} />}
        onEdit={(updated) => {
          dispatch(
            updateModifier({ id: updated.id, data: normalize(updated) }),
          );
        }}
      />
    </div>
  );
};

export default AddModifier;
