// app/suppliers/page.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilLine, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { CommonDialog } from "@/components/CommonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  EMPTY_SUPPLIER_VALUES,
  supplierToValues,
  validateSupplier,
  type Supplier,
  type SupplierFormValues,
} from "@/data/Inventory/supplierdata";
import {
  supplierAdded,
  supplierDeleted,
  supplierUpdated,
  selectAllSuppliers,
} from "@/Redux/Slices/inventory/supplierslice";

export default function SuppliersPage() {
  const dispatch = useDispatch();
  const suppliers = useSelector(selectAllSuppliers);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null); // null = adding
  const [deleting, setDeleting] = useState<Supplier | null>(null);

  // the dialog's own values
  const [values, setValues] = useState<SupplierFormValues>(EMPTY_SUPPLIER_VALUES);
  const [submitted, setSubmitted] = useState(false);

  const errors = validateSupplier(values, suppliers, editing?.id ?? null);
  // errors show after the first Save click, then update as the user fixes them
  const visibleErrors = submitted ? errors : {};

  const setField = (field: keyof SupplierFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const handleAdd = () => {
    setEditing(null);
    setValues(EMPTY_SUPPLIER_VALUES);
    setSubmitted(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditing(supplier);
    setValues(supplierToValues(supplier));
    setSubmitted(false);
    setIsDialogOpen(true);
  };

  // returning false keeps the dialog open; otherwise CommonDialog closes it
  const handleSave = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return false;

    const input = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      contact_number: values.contact_number.trim(),
       status: values.status,
    };

    if (editing) dispatch(supplierUpdated({ id: editing.id, changes: input }));
    else dispatch(supplierAdded(input));
  };

  const handleDelete = () => {
    if (deleting) dispatch(supplierDeleted(deleting.id));
  };

  const columns: DataTableColumn<Supplier>[] = [
    { key: "id", header: "ID", headerClassName: "w-16", cell: (supplier) => supplier.id },
    {
      key: "name",
      header: "Supplier",
      isSort: true,
      cell: (supplier) => <span className="font-medium">{supplier.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      isSort: true,
      cell: (supplier) => <span className="text-muted-foreground">{supplier.email}</span>,
    },
    {
      key: "contact_number",
      header: "Contact number",
      cell: (supplier) => supplier.contact_number,
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      headerClassName: "w-28",
      cell: (supplier) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Edit ${supplier.name}`}
            onClick={() => handleEdit(supplier)}
          >
            <PencilLine />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${supplier.name}`}
            onClick={() => setDeleting(supplier)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
           
          <h1 className="text-3xl font-extrabold border-l-4 border-brand p-2 tracking-tight sm:text-3xl">
            {suppliers.length === 1 ? "Supplier" : "Suppliers"}
          </h1>
        </div>

        <Button type="button" variant="primary" onClick={handleAdd}>
          <Plus />
          Add supplier
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        getRowKey={(supplier) => supplier.id}
        caption="Suppliers"
        emptyMessage="No suppliers yet. Click Add supplier to create one."
        searchFields={["name", "email", "contact_number"]}
        searchPlaceholder="Search by name, email or number..."
        pageSize={5}
        minWidth={640}
        className="border border-line"
      />

      {/* Add / edit supplier */}
      <CommonDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        icon={editing ? <PencilLine /> : <Truck />}
        title={editing ? "Edit supplier" : "Add supplier"}
        description={
          editing
            ? "Update this supplier's details."
            : "Add a supplier you buy products from."
        }
        saveLabel={editing ? "Save changes" : "Add supplier"}
        onSubmit={handleSave}
      >
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <FormField
            type="text"
            name="name"
            label="Supplier name"
            placeholder="e.g. Reliance Electronics"
            value={values.name}
            onChange={(value) => setField("name", value)}
            error={visibleErrors.name}
            required
            className="sm:col-span-2"
          />

          <FormField
            type="email"
            name="email"
            label="Email"
            placeholder="sales@example.com"
            value={values.email}
            onChange={(value) => setField("email", value)}
            error={visibleErrors.email}
            required
          />

          <FormField
            type="tel"
            name="contact_number"
            label="Contact number"
            placeholder="10-digit mobile number"
            value={values.contact_number}
            onChange={(value) => setField("contact_number", value)}
            error={visibleErrors.contact_number}
            required
          />

          <div className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 sm:col-span-2">
  <div className="min-w-0">
    <label htmlFor="supplier-status" className="text-sm font-medium">
      Active
    </label>
    <p className="text-xs text-muted-foreground">
      Inactive suppliers are hidden from product forms.
    </p>
  </div>

  <Switch
    id="supplier-status"
    checked={values.status === "active"}
    onCheckedChange={(checked) =>
      setField("status", checked ? "active" : "inactive")
    }
  />
</div>
        </div>
      </CommonDialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleting(null);
        }}
        icon={Trash2}
        variant="danger"
        title="Delete this supplier?"
        description={
          deleting && (
            <>
              <span className="font-medium text-foreground">{deleting.name}</span> will be removed.
              This can't be undone.
            </>
          )
        }
        confirmLabel="Delete supplier"
        onConfirm={handleDelete}
      />
    </div>
  );
}