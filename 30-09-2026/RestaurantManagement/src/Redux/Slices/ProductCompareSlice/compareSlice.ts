import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Phone } from "../../../utils/ProductCompUtils/Phonedata";
import type { Laptop } from "../../../utils/ProductCompUtils/Laptopdata";
import type { Refrigerator } from "../../../utils/ProductCompUtils/Refrigeratordata";

export type CompareProduct = Phone | Laptop | Refrigerator;

export type ProductCategory =
    | "phones"
    | "laptops"
    | "refrigerators";

interface CompareState {
    selectedProducts: CompareProduct[];
    category: ProductCategory | null;
    error: string | null;
}

const initialState: CompareState = {
    selectedProducts: [],
    category: null,
    error: null,
};

const MAX_COMPARE = 3;

const compareSlice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<CompareProduct>) => {
            const product = action.payload
            const alreadySelected = state.selectedProducts.some((item) => item.id === product.id);

            if (alreadySelected) {
                state.error = "This Product is already selected."
                return;
            }
            if (state.selectedProducts.length === 0) {
                state.category = product.category;
            }
            //Prevent different categories

            if (state.category !== null && product.category !== state.category) {
                state.error = "You can compare only from the same Category";
                return;
            }
            if (state.selectedProducts.length >= MAX_COMPARE) {
                state.error =
                    "You can compare maximum 3 items from the same category.";

                return;
            }
            state.selectedProducts.push(product);
            state.error = null;

        },

        removeProduct: (state, action: PayloadAction<string>) => {
            state.selectedProducts = state.selectedProducts.filter((product) => product.id !== action.payload);
            if (state.selectedProducts.length === 0) {
                state.category = null;
            }
            state.error = null;
        },
        clearProducts: (state) => {
            state.selectedProducts = [];
            state.category = null;
            state.error = null;
        },
        clearCompareError: (state) => {
            state.error = null;
        },
    }
})

export const {addProduct,removeProduct,clearProducts,clearCompareError} = compareSlice.actions;

export default compareSlice.reducer
