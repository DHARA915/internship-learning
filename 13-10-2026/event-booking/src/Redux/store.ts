import { configureStore } from "@reduxjs/toolkit";
import eventReducer from '../Redux/Slices/eventslice'
import registrationReducer from '../Redux/Slices/Registrationsslice '
import customerReducer from '@/Redux/Slices/InvoiceBuilder/customerslice'
import invoiceReducer from "@/Redux/Slices/InvoiceBuilder/invoiceslice"

export const store = configureStore({
  reducer: {
    events:eventReducer,
    registrations:registrationReducer,
    customers:customerReducer,
    invoice:invoiceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;