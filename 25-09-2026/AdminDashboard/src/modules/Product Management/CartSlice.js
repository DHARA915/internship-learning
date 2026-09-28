import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {

        // addToCart: (state, action) => {
        //     const product = action.payload;

        //     console.log("Payload from cartSlice:",product)

        //     const exisitingItem = state.items.find(
        //         (item) => item.id === product.id
        //     );
        //     if (exisitingItem) {
        //         exisitingItem.quantity += 1;
        //     } else {
        //         state.items.push({
        //             ...product,
        //             quantity: 1,
        //         })
        //     }

        //     console.log("Items from CartSlice:", state.items)
        // },


        addToCart: (state, action) => {
  const product = action.payload;

  const existingItem = state.items.find(
    (item) => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({
      ...product,
      quantity: 1,
    });
  }
console.log(
  "4. Items AFTER:",
  JSON.parse(JSON.stringify(state.items))
);
},

        // INCREASE QUANTITY
increaseQuantity: (state, action) => {
  const item = state.items.find(
    (item) => item.id === action.payload
  );

  if (item && item.quantity < item.stock) {
    item.quantity += 1;
  }
},

        // DECREASE QUANTITY
        decreaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },

        // REMOVE PRODUCT FROM CART
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },

        clearCart: (state) => {
            state.items = [];
        },


    }

})

export const {
    addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart
} = cartSlice.actions;

export default cartSlice.reducer