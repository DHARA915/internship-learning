
// Redux/Slices/supplierslice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { suppliers, type Supplier, type SupplierInput } from "@/data/Inventory/supplierdata";
import type { RootState } from "@/Redux/store";

type SupplierState = { items: Supplier[] };

const initialState: SupplierState = { items: suppliers };

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    supplierAdded(state, action: PayloadAction<SupplierInput>) {
      const nextId = state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      state.items.push({ id: nextId, ...action.payload });
    },

    supplierUpdated(state, action: PayloadAction<{ id: number; changes: SupplierInput }>) {
      const supplier = state.items.find((item) => item.id === action.payload.id);
      if (supplier) Object.assign(supplier, action.payload.changes);
    },

    supplierDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { supplierAdded, supplierUpdated, supplierDeleted } = supplierSlice.actions;
export default supplierSlice.reducer;

/* ---------- selectors ---------- */
export const selectAllSuppliers = (state: RootState) => state.suppliers.items;

export const selectSupplierById = (state: RootState, id: number) =>
  state.suppliers.items.find((item) => item.id === id);