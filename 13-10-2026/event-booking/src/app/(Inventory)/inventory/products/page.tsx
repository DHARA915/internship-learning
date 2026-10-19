
"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Eye, ImagePlus, PencilLine, Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ProductFormDialog } from "@/components/inventory/Productformdialog";
import {
  STOCK_TONE_CLASS,
  getStockStatus,
  type Product,
} from "@/data/Inventory/productdata";
import { selectAllCategories } from "@/Redux/Slices/inventory/categoryslice";
import { selectAllSuppliers } from "@/Redux/Slices/inventory/supplierslice";
import { productDeleted, selectAllProducts } from "@/Redux/Slices/inventory/productslice";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const suppliers = useSelector(selectAllSuppliers);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null); 
  const [deleting, setDeleting] = useState<Product | null>(null);

  const categoryName = (id: number) =>
    categories.find((category) => category.id === id)?.name ?? "—";
  const supplierName = (id: number) =>
    suppliers.find((supplier) => supplier.id === id)?.name ?? "—";

  const handleAdd = () => {
    setEditing(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleting) dispatch(productDeleted(deleting.id));
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Product",
      isSort: true,
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-brand-soft text-brand">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt="" className="size-full object-cover" />
            ) : (
              <ImagePlus className="size-4" />
            )}
          </div>
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      isSort: true,
      cell: (product) => <span className="font-mono text-xs">{product.sku}</span>,
    },
    {
      key: "categoryId",
      header: "Category",
      cell: (product) => categoryName(product.categoryId),
    },
    {
      key: "supplierId",
      header: "Supplier",
      cell: (product) => supplierName(product.supplierId),
    },
    {
      key: "unitPrice",
      header: "Unit price",
      isSort: true,
      cell: (product) => formatPrice(product.unitPrice),
    },
    {
      // total vs remaining, with a status badge
      key: "availableQuantity",
      header: "Available / total",
      isSort: true,
      cell: (product) => {
        const status = getStockStatus(product.availableQuantity, product.quantity);
        return (
          <div className="flex flex-wrap items-center gap-2">
            {/* <span className="font-medium">
              {product.availableQuantity} / {product.quantity}
            </span> */}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
                STOCK_TONE_CLASS[status.tone],
              )}
            >
              {status.label}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      headerClassName: "w-36",
      cell: (product) => (
        <div className="flex items-center justify-end gap-2">
          {/* 1. View */}
          <Button  variant="outline" size="icon" aria-label={`View ${product.name}`}>
            <Link href={`/inventory/products/${product.id}`}>
              <Eye />
            </Link>
          </Button>

          {/* 2. Edit */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Edit ${product.name}`}
            onClick={() => handleEdit(product)}
          >
            <PencilLine />
          </Button>

          {/* 3. Delete */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${product.name}`}
            onClick={() => setDeleting(product)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="border-l-4 border-brand p-1 text-3xl font-extrabold tracking-tight">
          Products
        </h1>

        <Button type="button" variant="primary" onClick={handleAdd}>
          <Plus />
          Add product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        getRowKey={(product) => product.id}
        caption="Products"
        emptyMessage="No products yet. Click Add product to create one."
        searchFields={["name", "sku"]}
        searchPlaceholder="Search by name or SKU..."
        pageSize={5}
        minWidth={820}
        className="border border-line"
      />

      {/* Add / edit product (shared with the details page) */}
      <ProductFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} product={editing} />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleting(null);
        }}
        icon={Trash2}
        variant="danger"
        title="Delete this product?"
        description={
          deleting && (
            <>
              <span className="font-medium text-foreground">{deleting.name}</span> (
              {deleting.sku}) and its stock history will be removed. This can't be undone.
            </>
          )
        }
        confirmLabel="Delete product"
        onConfirm={handleDelete}
      />
    </div>
  );
}