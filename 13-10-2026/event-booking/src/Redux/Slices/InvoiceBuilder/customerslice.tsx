import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/Redux/store";
import { customers, type Customer } from "@/data/InvoiceBuilder/invoicedata";

export type NewCustomer = Omit<Customer, "id">;

const nextCustomerId = (items: Customer[]) =>
  items.reduce((max, customer) => Math.max(max, customer.id), 0) + 1;

const customersSlice = createSlice({
  name: "customers",
  initialState: { items: customers },
  reducers: {
    // Create Customer
    customerAdded: {
      reducer(state, action: PayloadAction<Customer>) {
        state.items.push(action.payload);
      },
      prepare(customer: NewCustomer, nextId: number) {
        return { payload: { ...customer, id: nextId } };
      },
    },

    // UPDATE: partial changes by id
    customerUpdated(
      state,
      action: PayloadAction<{ id: number; changes: Partial<NewCustomer> }>,
    ) {
      const customer = state.items.find((item) => item.id === action.payload.id);
      if (customer) Object.assign(customer, action.payload.changes);
    },

    // Delete customer
    customerDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { customerAdded, customerUpdated, customerDeleted } = customersSlice.actions;
export default customersSlice.reducer;

/* ---------- selectors ---------- */
export const selectAllCustomers = (state: RootState) => state.customers.items;

export const selectCustomerById = (state: RootState, id: number | null) =>
  id === null ? undefined : state.customers.items.find((item) => item.id === id);

export const selectNextCustomerId = (state: RootState) => nextCustomerId(state.customers.items);