
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageModule from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "./Slices/authSlice.ts";
import MenuSectionReducer from "./Slices/menuSectionSlice.ts";
import ModifierReducer from "./Slices/Modifierslice.ts";
import MenuItemReducer from "./Slices/menuItemSlice.ts";
import CartReducer from "./Slices/cartSlice.ts";
import MenuReducer from "./Slices/menuSectionSlice.ts";
import compareReducer from "./Slices/ProductCompareSlice/compareSlice.ts";

// Vite can hand back { default: storage } instead of storage itself
const storage =
  (storageModule as unknown as { default?: typeof storageModule }).default ??
  storageModule;

const rootReducer = combineReducers({
  auth: authReducer,
  modifiers: ModifierReducer,
  menuItems: MenuItemReducer,
  cart: CartReducer,
  menuSections: MenuSectionReducer,
  menus: MenuReducer,
  compare: compareReducer,
});

/**
 * Runs once per user, when their saved version is lower than the target.
 * Dropping a slice here makes it start again from its seed data.
 * Next time the seed changes: add `4: ...` below and set version to 4.
 */
const migrations = {
  3: (state: any) => {
    const { menus, menuSections, menuItems, modifiers, ...rest } = state;
    return rest; // auth, cart and compare are kept
  },
};

const persistConfig = {
  key: "root",
  version: 3,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist actions carry non-serializable values
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;