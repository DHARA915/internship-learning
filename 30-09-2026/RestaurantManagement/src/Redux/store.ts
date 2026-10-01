import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.ts";
import MenuSectionReducer from "./Slices/menuSectionSlice.ts";

export const store =  configureStore({
    reducer: {
        auth: authReducer,
        menuSections: MenuSectionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;