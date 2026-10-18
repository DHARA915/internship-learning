// Redux/Slices/inventory/productslice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/Redux/store";
import {
  products as seedProducts,
  type Product,
  type ProductChanges,
  type ProductInput,
} from "@/data/Inventory/productdata";

type ProductState = { items: Product[] };

const initialState: ProductState = { items: seedProducts };

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productAdded: {
      reducer(state, action: PayloadAction<Product>) {
        state.items.push(action.payload);
      },
      // id + timestamp are made here so the reducer stays pure
      prepare(input: ProductInput) {
        return {
          payload: {
            ...input,
            id: Date.now() + Math.floor(Math.random() * 1000),
            created_at: new Date().toISOString(),
          } satisfies Product,
        };
      },
    },

    // SKU and quantity can't change here (ProductChanges leaves them out)
    productUpdated(
      state,
      action: PayloadAction<{ id: number; changes: ProductChanges }>,
    ) {
      const product = state.items.find((item) => item.id === action.payload.id);
      if (product) Object.assign(product, action.payload.changes);
    },

    productDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { productAdded, productUpdated, productDeleted } =
  productSlice.actions;

export const selectAllProducts = (state: RootState) => state.products.items;

export default productSlice.reducer;