import { createSlice } from "@reduxjs/toolkit";
import { products } from "./data";

const initialState = {
  products: products,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Add product
    addProduct: (state, action) => {
      state.products.push({
        ...action.payload,
        id: Date.now(),
      });
    },

    // Update product
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    // Delete product
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },

    buyProducts: (state, action) => {
      const { id, quantity } = action.payload;

      const product = state.products.find(
        (product) => product.id === id
      );

      if (!product) return;

      if (product.stock >= quantity) {
        product.stock -= quantity;
      }
    }

  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  buyProducts
} = productSlice.actions;

export default productSlice.reducer;

