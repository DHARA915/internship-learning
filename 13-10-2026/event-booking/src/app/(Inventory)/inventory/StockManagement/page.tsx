"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { cn } from "cn";
import FormField from "@/components/form-field/FormField";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { selectAllCategories } from "@/Redux/Slices/inventory/categoryslice";
import {
  selectAllMovements,
  selectAllProducts,
} from "@/Redux/Slices/inventory/productslice";
import {
  MOVEMENT_TYPE_OPTIONS,
  type StockMovement,
} from "@/data/Inventory/productdata";

// a movement plus the product and category details the table needs
type MovementRow = StockMovement & {
  productName: string;
  sku: string;
  categoryId: number | null;
  categoryName: string;
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const columns: DataTableColumn<MovementRow>[] = [
  {
    key: "created_at",
    header: "Date & time",
    isSort: true,
    cellClassName: "whitespace-nowrap font-medium",
    cell: (row) => formatDateTime(row.created_at),
  },
  {
    key: "productName",
    header: "Product",
    isSort: true,
    cell: (row) => (
      <div className="flex flex-col">
        <Link
          href={`/inventory/products/${row.product_id}`}
          className="font-medium hover:underline"
        >
          {row.productName}
        </Link>
        <span className="font-mono text-xs text-muted-foreground">{row.sku}</span>
      </div>
    ),
  },
  {
    key: "categoryName",
    header: "Category",
    isSort: true,
    cell: (row) => row.categoryName,
  },
  {
    key: "type",
    header: "Stock status",
    cell: (row) => (
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          row.type === "in" ? "bg-brand-soft text-brand" : "bg-danger-soft text-danger",
        )}
      >
        {row.type === "in" ? "Stock in" : "Stock out"}
      </span>
    ),
  },
  {
    key: "change",
    header: "Quantity change",
    isSort: true,
    cell: (row) => (
      <span className={cn("font-semibold", row.change > 0 ? "text-brand" : "text-danger")}>
        {row.change > 0 ? `+${row.change}` : row.change}
      </span>
    ),
  },
  { key: "previous_quantity", header: "Previous qty", cell: (row) => row.previous_quantity },
  { key: "new_quantity", header: "New quantity", cell: (row) => row.new_quantity },
  {
    key: "reason",
    header: "Reason",
    cell: (row) => <span className="capitalize">{row.reason}</span>,
  },
];


export default function StockManagementPage() {
  const movements = useSelector(selectAllMovements);
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // join each movement with its product and category
  const rows: MovementRow[] = useMemo(
    () =>
      movements.map((movement) => {
        const product = products.find((item) => item.id === movement.product_id);
        const category = categories.find((item) => item.id === product?.categoryId);
        return {
          ...movement,
          productName: product?.name ?? "Deleted product",
          sku: product?.sku ?? "—",
          categoryId: product?.categoryId ?? null,
          categoryName: category?.name ?? "—",
        };
      }),
    [movements, products, categories],
  );

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          (typeFilter === "all" || row.type === typeFilter) &&
          (categoryFilter === "all" || String(row.categoryId) === categoryFilter),
      ),
    [rows, typeFilter, categoryFilter],
  );


  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <div className="mb-6">
        <h1 className="border-l-4 border-brand p-1 text-3xl font-extrabold tracking-tight">
          Stock management
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every stock in and stock out across all products.
        </p>
      </div>


      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
        <FormField
          type="select"
          name="stock-type-filter"
          label="Stock status"
          value={typeFilter}
          options={[{ label: "All movements", value: "all" }, ...MOVEMENT_TYPE_OPTIONS]}
          onChange={setTypeFilter}
        />
        <FormField
          type="select"
          name="stock-category-filter"
          label="Category"
          value={categoryFilter}
          options={[
            { label: "All categories", value: "all" },
            ...categories.map((category) => ({
              label: category.name,
              value: String(category.id),
            })),
          ]}
          onChange={setCategoryFilter}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredRows}
        getRowKey={(row) => row.id}
        caption="All stock movements"
        emptyMessage="No stock movements yet. Use Adjust stock on a product to record one."
        noResultsMessage="No movements match your search."
        searchFields={["productName", "sku", "categoryName", "reason"]}
        searchPlaceholder="Search by product, SKU, category or reason..."
        pageSize={10}
        minWidth={900}
        className="border border-line"
      />
    </div>
  );
}