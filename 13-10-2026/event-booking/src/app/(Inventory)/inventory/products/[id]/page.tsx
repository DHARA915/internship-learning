"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, PackageX, PencilLine, SlidersHorizontal, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { CommonDialog } from "@/components/CommonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ProductFormDialog } from "@/components/inventory/Productformdialog";
import type { RootState } from "@/Redux/store";
import {
  productDeleted,
  selectAllMovements,
  selectProductById,
  stockAdjusted,
} from "@/Redux/Slices/inventory/productslice";
import { selectAllCategories } from "@/Redux/Slices/inventory/categoryslice";
import { selectAllSuppliers } from "@/Redux/Slices/inventory/supplierslice";
import {
  EMPTY_ADJUST_VALUES,
  MOVEMENT_TYPE_OPTIONS,
  STOCK_STATUS_VARIANT,
  getMaxQuantity,
  getMovementTypeOptions,
  getReasonOptions,
  getStockStatus,
  isMovementReason,
  isMovementType,
  validateAdjustment,
  type AdjustFormValues,
  type StockMovement,
} from "@/data/Inventory/productdata";
import { Badge } from "@/components/ui/badge";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value || "—"}</dd>
    </div>
  );
}

const movementColumns: DataTableColumn<StockMovement>[] = [
  {
    key: "created_at",
    header: "Date & time",
    isSort: true,
    cellClassName: "whitespace-nowrap font-medium",
    cell: (movement) => formatDateTime(movement.created_at),
  },
  {
    key: "type",
    header: "Movement type",
    cell: (movement) => (
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          movement.type === "in" ? "bg-brand-soft text-brand" : "bg-danger-soft text-danger",
        )}
      >
        {movement.type === "in" ? "Stock in" : "Stock out"}
      </span>
    ),
  },
  {
    key: "change",
    header: "Quantity change",
    isSort: true,
    cell: (movement) => (
      <span className={cn("font-semibold", movement.change > 0 ? "text-brand" : "text-danger")}>
        {movement.change > 0 ? `+${movement.change}` : movement.change}
      </span>
    ),
  },
  { key: "previous_quantity", header: "Previous qty", cell: (movement) => movement.previous_quantity },
  { key: "new_quantity", header: "New quantity", cell: (movement) => movement.new_quantity },
  {
    key: "reason",
    header: "Reason",
    cell: (movement) => <span className="capitalize">{movement.reason}</span>,
  },
];

export default function ProductDetailsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const product = useSelector((state: RootState) => selectProductById(state, id));
  const categories = useSelector(selectAllCategories);
  const suppliers = useSelector(selectAllSuppliers);
  const allMovements = useSelector(selectAllMovements);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // adjust-stock dialog
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [values, setValues] = useState<AdjustFormValues>(EMPTY_ADJUST_VALUES);
  const [submitted, setSubmitted] = useState(false);

  // history filter
  const [typeFilter, setTypeFilter] = useState("all");

  const movements = useMemo(
    () =>
      allMovements.filter(
        (item) => item.product_id === id && (typeFilter === "all" || item.type === typeFilter),
      ),
    [allMovements, id, typeFilter],
  );

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 py-20 text-center">
        <PackageX className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">This product no longer exists.</p>
        <Button  variant="outline">
          <Link href="/inventory/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const category = categories.find((item) => item.id === product.categoryId);
  const supplier = suppliers.find((item) => item.id === product.supplierId);
  const Stockstatus = getStockStatus(product.availableQuantity, product.quantity);
  const sold = product.quantity - product.availableQuantity;

  /* ---------- adjust stock ---------- */
  const errors = validateAdjustment(values, product);
  const visibleErrors = submitted ? errors : {};
  const maxQuantity = getMaxQuantity(values.type, values.reason, product);

  const setField = (field: keyof AdjustFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const openAdjust = () => {
    setValues(EMPTY_ADJUST_VALUES);
    setSubmitted(false);
    setIsAdjustOpen(true);
  };

  // returning false keeps the dialog open
  const handleAdjust = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return false;
    if (!isMovementType(values.type) || !isMovementReason(values.reason)) return false;

    dispatch(
      stockAdjusted({
        product_id: product.id,
        type: values.type,
        reason: values.reason,
        quantity: Number(values.quantity),
      }),
    );
  };

  const handleDelete = () => {
    dispatch(productDeleted(product.id));
    router.push("/inventory/products");
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <Link
        href="/inventory/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Product details</h1>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={openAdjust}>
            <SlidersHorizontal />
            Adjust stock
          </Button>
          <Button type="button" variant="primary" onClick={() => setIsEditOpen(true)}>
            <PencilLine />
            Edit product
          </Button>
          <Button type="button" variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <section className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-4 shadow-sm sm:flex-row">
            <div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-tertiary sm:w-48">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image} alt={product.name} className="size-full object-cover" />
              ) : (
                <PackageX className="size-8 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold break-words">{product.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
              <p className="text-sm text-muted-foreground">Category: {category?.name ?? "—"}</p>
              <p className="mt-3 text-sm font-semibold">Description</p>
              <p className="text-sm break-words text-muted-foreground">
                {product.description || "No description added."}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-card p-4 shadow-sm">
            <h3 className="mb-4 font-semibold">Product info</h3>
            <dl className="grid gap-4 sm:grid-cols-3">
              <InfoRow label="Product name" value={product.name} />
              <InfoRow label="SKU" value={product.sku} />
              <InfoRow label="Category" value={category?.name ?? ""} />
              <InfoRow label="Unit price" value={money(product.unitPrice)} />
              <InfoRow label="Total quantity" value={String(product.quantity)} />
              <InfoRow label="Available quantity" value={String(product.availableQuantity)} />
              <InfoRow
                label="Stock value (available)"
                value={money(product.unitPrice * product.availableQuantity)}
              />
              <InfoRow label="Added on" value={formatDateTime(product.created_at)} />
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-card p-4 shadow-sm">
            <h3 className="mb-4 font-semibold">Supplier info</h3>
            <dl className="grid gap-4 sm:grid-cols-3">
              <InfoRow label="Supplier" value={supplier?.name ?? ""} />
              <InfoRow label="Email" value={supplier?.email ?? ""} />
              <InfoRow label="Contact" value={supplier?.contact_number ?? ""} />
            </dl>
          </section>
        </div>

        <aside className="min-w-0">
          <section className="rounded-2xl border border-line bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="font-semibold">Current stock status</h3>
             <Badge variant={Stockstatus.status}>{Stockstatus.label}</Badge>
             
            </div>

            <p className="text-4xl font-extrabold">{product.availableQuantity}</p>
            <p className="text-sm text-muted-foreground">available of {product.quantity} total</p>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-tertiary p-2">
                <dt className="text-xs text-muted-foreground">Total</dt>
                <dd className="font-semibold">{product.quantity}</dd>
              </div>
              <div className="rounded-lg bg-tertiary p-2">
                <dt className="text-xs text-muted-foreground">Sold / out</dt>
                <dd className="font-semibold">{sold}</dd>
              </div>
              <div className="rounded-lg bg-tertiary p-2">
                <dt className="text-xs text-muted-foreground">Available</dt>
                <dd className="font-semibold">{product.availableQuantity}</dd>
              </div>
            </dl>

            {/* <Button type="button" variant="outline" className="mt-4 w-full" onClick={openAdjust}>
              <SlidersHorizontal />
              Adjust stock
            </Button> */}
          </section>
        </aside>
      </div>

      {/* Stock movement history */}
      <section className="mt-6 min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Stock movement history</h2>
          <div className="w-full sm:w-44">
            <FormField
              type="select"
              name="movement-filter"
              value={typeFilter}
              options={[{ label: "All movements", value: "all" }, ...MOVEMENT_TYPE_OPTIONS]}
              onChange={setTypeFilter}
            />
          </div>
        </div>

        <DataTable
          columns={movementColumns}
          data={movements}
          getRowKey={(movement) => movement.id}
          caption="Stock movement history"
          emptyMessage="No stock movements yet. Use Adjust stock to record one."
          noResultsMessage="No movements match your search."
          searchFields={["reason", "type"]}
          searchPlaceholder="Search by reason or type..."
          pageSize={5}
          minWidth={640}
          className="border border-line"
        />
      </section>

      {/* Adjust stock */}
      <CommonDialog
        open={isAdjustOpen}
        onOpenChange={setIsAdjustOpen}
        icon={<SlidersHorizontal />}
        title="Adjust stock"
        description={`${product.name} · available ${product.availableQuantity} of ${product.quantity} total`}
        saveLabel="Update stock"
        onSubmit={handleAdjust}
      >
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <FormField
            type="select"
            name="movement-type"
            label="Movement type"
            value={values.type}
            options={getMovementTypeOptions(product)}
            error={visibleErrors.type}
            onChange={(value) =>
              // keep the reason if it still applies to the new type, else pick the first valid one
              setValues((previous) => {
                const reasons = getReasonOptions(value, product);
                const stillValid = reasons.some((option) => option.value === previous.reason);
                return {
                  ...previous,
                  type: value,
                  reason: stillValid ? previous.reason : (reasons[0]?.value ?? ""),
                };
              })
            }
          />

          <FormField
            type="number"
            name="movement-quantity"
            label="Quantity"
            placeholder="e.g. 10"
            value={values.quantity}
            onChange={(value) => setField("quantity", value)}
            error={visibleErrors.quantity}
            required
          />

          <FormField
            type="select"
            name="movement-reason"
            label="Reason"
            value={values.reason}
            options={getReasonOptions(values.type, product)}
            onChange={(value) => setField("reason", value)}
            error={visibleErrors.reason}
            className="sm:col-span-2"
          />

          {maxQuantity !== null && (
            <p className="text-xs text-muted-foreground sm:col-span-2">
              {values.type === "out"
                ? `You can stock out up to ${maxQuantity} unit${maxQuantity === 1 ? "" : "s"} (what's currently available).`
                : `Up to ${maxQuantity} sold unit${maxQuantity === 1 ? "" : "s"} can be returned.`}
            </p>
          )}
        </div>
      </CommonDialog>

      {/* Edit product (same dialog as the products list) */}
      <ProductFormDialog open={isEditOpen} onOpenChange={setIsEditOpen} product={product} />

      {/* Delete */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        icon={Trash2}
        variant="danger"
        title="Delete this product?"
        description={
          <>
            <span className="font-medium text-foreground">{product.name}</span> and its stock
            history will be removed. This can't be undone.
          </>
        }
        confirmLabel="Delete product"
        onConfirm={handleDelete}
      />
    </div>
  );
}