
import { configureStore } from "@reduxjs/toolkit";
import productReducer from './modules/Product Management/ProductSlice'
import cartReducer from './modules/Product Management/CartSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart:cartReducer
  },
});

