// Redux/Slices/inventory/productslice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  products,
  type Product,
  type ProductChanges,
  type ProductInput,
  type StockAdjustment,
  type StockMovement,
} from "@/data/Inventory/productdata";
import type { RootState } from "@/Redux/store";

type ProductState = {
  items: Product[];
  movements: StockMovement[];
};

const initialState: ProductState = { items: products, movements: [] };

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productAdded: {
      reducer(state, action: PayloadAction<ProductInput & { created_at: string }>) {
        const nextId = state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        state.items.push({
          id: nextId,
          ...action.payload,
          availableQuantity: action.payload.quantity, // a new product starts fully available
        });
      },
      // timestamp is created here, outside the reducer
      prepare(input: ProductInput) {
        return { payload: { ...input, created_at: new Date().toISOString() } };
      },
    },

    // SKU and quantity are not editable, so quantities never change here
    productUpdated(state, action: PayloadAction<{ id: number; changes: ProductChanges }>) {
      const product = state.items.find((item) => item.id === action.payload.id);
      if (product) Object.assign(product, action.payload.changes);
    },

    productDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.movements = state.movements.filter((item) => item.product_id !== action.payload);
    },

    /**
     * Stock in  (buy / adjustment): a restock, raises available AND total.
     * Stock out (sale / adjustment / return): lowers available, total stays the same,
     * and can never be more than what is available.
     */
    stockAdjusted: {
      reducer(state, action: PayloadAction<StockAdjustment & { created_at: string }>) {
        const { product_id, type, reason, quantity, created_at } = action.payload;
        const product = state.items.find((item) => item.id === product_id);
        if (!product) return;

        const previous = product.availableQuantity;

        if (type === "in") {
          // safety net: the form only offers buy / adjustment for stock in
          if (reason !== "buy" && reason !== "adjustment") return;

          product.availableQuantity += quantity;
          product.quantity += quantity; // a restock raises the total
        } else {
          // safety net: the form only offers sale / adjustment / return for stock out
          if (reason === "buy") return;
          if (quantity > previous) return;

          product.availableQuantity -= quantity; // the total stays the same
        }

        const nextId = state.movements.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        state.movements.unshift({
          id: nextId,
          product_id,
          type,
          reason,
          change: type === "in" ? quantity : -quantity,
          previous_quantity: previous,
          new_quantity: product.availableQuantity,
          created_at,
        });
      },
      prepare(input: StockAdjustment) {
        return { payload: { ...input, created_at: new Date().toISOString() } };
      },
    },
  },
});

export const { productAdded, productUpdated, productDeleted, stockAdjusted } =
  productSlice.actions;
export default productSlice.reducer;

/* ---------- selectors ---------- */
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectAllMovements = (state: RootState) => state.products.movements;
export const selectProductById = (state: RootState, id: number) =>
  state.products.items.find((item) => item.id === id);