import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "./ProductSlice";

import { products, productColumns } from "./data";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
   
  // -----------------------------
  // PRODUCTS
  // -----------------------------

  const reduxProducts = useSelector(
    (state) => state.products.products
  );

  // Use data.js products if Redux has no products
  const productList =
    reduxProducts?.length > 0 ? reduxProducts : products;

  // -----------------------------
  // MODAL
  // -----------------------------

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // -----------------------------
  // SEARCH
  // -----------------------------

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // -----------------------------
  // FILTER
  // -----------------------------

  const [category, setCategory] = useState("All");

  // -----------------------------
  // SORT
  // -----------------------------

  const [sortBy, setSortBy] = useState("default");

  // -----------------------------
  // DEBOUNCE
  // -----------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // -----------------------------
  // ADD
  // -----------------------------

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenModal(true);
  };

  // -----------------------------
  // EDIT
  // -----------------------------

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  // -----------------------------
  // ADD / UPDATE
  // -----------------------------

  const handleSubmit = (formData) => {
    const product = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    if (selectedProduct) {
      // UPDATE
      dispatch(
        updateProduct({
          ...product,
          id: selectedProduct.id,
        })
      );
    } else {
      // ADD
      dispatch(addProduct(product));
    }

    setOpenModal(false);
    setSelectedProduct(null);
  };

  // -----------------------------
  // DELETE
  // -----------------------------

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    dispatch(deleteProduct(product.id));
  };

  // -----------------------------
  // CATEGORIES
  // -----------------------------

  const categories = [
    "All",
    ...new Set(
      productList.map((product) => product.category)
    ),
  ];

  // -----------------------------
  // SEARCH + FILTER + SORT
  // -----------------------------

  const filteredProducts = [...productList]
    .filter((product) => {
      const searchText = debouncedSearch
        .toLowerCase()
        .trim();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText) ||
        product.description
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    })

    .sort((a, b) => {
      switch (sortBy) {
        case "name-az":
          return a.name.localeCompare(b.name);

        case "name-za":
          return b.name.localeCompare(a.name);

        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "stock-low":
          return a.stock - b.stock;

        case "stock-high":
          return b.stock - a.stock;

        default:
          return 0;
      }
    });

  // -----------------------------
  // MODAL FIELDS
  // -----------------------------


  const productFields = productColumns
  .filter((field) => field.key !== "id")
  .map((field) => ({
    ...field,
    name: field.key,
  }));

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="flex h-full flex-col gap-4 p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-tertiary">
            Product Management
          </h1>

          <p className="text-sm text-secondary">
            Manage products, prices and stock.
          </p>
        </div>

        {/* <button
          type="button"
          onClick={handleAdd}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90"
        >
          Add Product
        </button> */}

        <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={handleAdd}
    className="rounded-md cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90"
  >
    Add Product
  </button>

  <button
    type="button"
    onClick={() => navigate("/products/allProducts")}
    className="rounded-md cursor-pointer border border-primary px-4 py-2 text-sm font-medium  transition bg-primary text-primary"
  >
    Buy Products
  </button>
</div>

      </div>

      {/* SEARCH / FILTER / SORT */}

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary p-3 md:flex-row">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {/* SORT */}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
        >
          <option value="default">
            Sort By
          </option>

          <option value="name-az">
            Name A → Z
          </option>

          <option value="name-za">
            Name Z → A
          </option>

          <option value="price-low">
            Price Low → High
          </option>

          <option value="price-high">
            Price High → Low
          </option>

          <option value="stock-low">
            Stock Low → High
          </option>

          <option value="stock-high">
            Stock High → Low
          </option>
        </select>

      </div>

      {/* RESULT COUNT */}

      <div className="text-sm text-secondary">
        Showing {filteredProducts.length} of{" "}
        {productList.length} products
      </div>

      {/* TABLE */}

      <div className="min-h-0 flex-1">

        <DataTable
          columns={productColumns}
          data={filteredProducts}
          onRowDoubleClick={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* MODAL */}

      <Modal
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);

          if (!open) {
            setSelectedProduct(null);
          }
        }}
        title={
          selectedProduct
            ? "Update Product"
            : "Add Product"
        }
        description={
          selectedProduct
            ? "Update the product details below."
            : "Enter the product details below."
        }
        fields={productFields}
        initialData={selectedProduct || {}}
        onSubmit={handleSubmit}
        submitLabel={
          selectedProduct
            ? "Update Product"
            : "Add Product"
        }
      />

    </div>
  );
};

export default ProductManagement;