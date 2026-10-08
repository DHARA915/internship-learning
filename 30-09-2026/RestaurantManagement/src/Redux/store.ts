import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.ts";
import MenuSectionReducer from "./Slices/menuSectionSlice.ts";
import ModifierReducer from './Slices/Modifierslice.ts'
import MenuItemReducer from './Slices/menuItemSlice.ts'
import CartReducer from './Slices/cartSlice.ts'
import MenuReducer from './Slices/menuSectionSlice.ts'

export const store =  configureStore({
    reducer: {
        auth: authReducer,
        menuSections: MenuSectionReducer,
        modifiers:ModifierReducer,
        menuItems:MenuItemReducer,
        cart:CartReducer,
        menus:MenuReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;