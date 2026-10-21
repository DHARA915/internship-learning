import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import eventReducer from "../Redux/Slices/eventslice";
import registrationReducer from "../Redux/Slices/Registrationsslice";
import customerReducer from "@/Redux/Slices/InvoiceBuilder/customerslice";
import invoiceReducer from "@/Redux/Slices/InvoiceBuilder/invoiceslice";
import categoryReducer from "@/Redux/Slices/inventory/categoryslice";
import SupplierReducer from "@/Redux/Slices/inventory/supplierslice";
import ProductReducer from "@/Redux/Slices/inventory/productslice";

const rootReducer = combineReducers({
  events: eventReducer,
  registrations: registrationReducer,
  customers: customerReducer,
  invoice: invoiceReducer,
  categories: categoryReducer,
  suppliers: SupplierReducer,
  products: ProductReducer,
});

const persistConfig = {
  key: "root",
  storage,

  // Persist only these slices
  whitelist: [
    "customers",
    "invoice",
    "categories",
    "suppliers",
    "products",
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;