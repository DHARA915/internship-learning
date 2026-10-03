import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField"; // <- your common FormField
import type { RootState } from "../../Redux/store";
import {
  addMenuSection,
  updateMenuSection,
  deleteMenuSection,
} from "../../Redux/Slices/menuSectionSlice"; // <- adjust path
import type { MenuSection } from "../../utils/Menusectiondata";
import type { AppDispatch } from "../../Redux/store.ts";
import { Badge } from "../../components/ui/badge.tsx";

/* ---------- fields shared by Add + Edit dialogs ---------- */
type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

const MenuSectionFields = ({ values, setValue, errors }: Ctx) => {
  const isActive = values.status !== "Inactive"; // default = Active

  return (
    <>
      <FormField
        type="text"
        name="name"
        label="Menu Section Name"
        placeholder="e.g. Starters"
        value={values.name ?? ""}
        onChange={(e: any) => setValue("name", e?.target ? e.target.value : e)}
        error={errors.name}
      />

      
        <Switch
        id="status"
        aria-label="Status"
        checked={isActive}
        onCheckedChange={(c) => setValue("status", c ? "Active" : "Inactive")}
        className="mt-3 data-checked:bg-slate-200 data-unchecked:bg-gray-300 dark:data-unchecked:bg-gray-600"
      />
      
    </>
  );
};

const validate = (v: FormValues) => {
  const errors: Record<string, string> = {};
  if (!String(v.name ?? "").trim())
    errors.name = "Menu section name is required";
  return errors;
};

/* ---------- table columns ---------- */
const columns: Column<MenuSection>[] = [
  { key: "srNo", header: "Sr. No", className: "w-20", cell: (_r, i) => i + 1 },
  { key: "name", header: "Menu Section" },
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
const AddMenuSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector((s: RootState) => s.menuSections.menuSections);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Menu Sections</h1>

        <CommonDialog
          title="Add Menu Section"
          trigger={
            <Button className="flex items-center gap-2 cursor-pointer bg-button-primary text-white hover:bg-button-primary-hover">
              <Plus className="h-4 w-4" /> Add
            </Button>
          }
          defaultValues={{ name: "", isActive: true }} 
          validate={validate}
          onSubmit={(v) => {
            dispatch(
              addMenuSection({
                name: String(v.name).trim(),
                description: String(v.description ?? "").trim(),
                status: v.status === "Inactive" ? "Inactive" : "Active",
              }),
            );
          }}
        >
          {(ctx) => <MenuSectionFields {...ctx} />}
        </CommonDialog>
      </div>

      <DataTable
        columns={columns}
        data={sections}
        onDelete={(row) => dispatch(deleteMenuSection(row.id))}
        editTitle="Edit Menu Section"
        validate={validate}
        renderEditForm={(ctx) => <MenuSectionFields {...ctx} />}
        onEdit={(updated) => {
          dispatch(
            updateMenuSection({
              id: updated.id,
              data: {
                name: updated.name.trim(),
                description: updated.description.trim(),
                status: updated.status,
              },
            }),
          );
        }}
      />
    </div>
  );
};

export default AddMenuSection;
