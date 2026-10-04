import { createSlice , type PayloadAction } from "@reduxjs/toolkit";

export interface CartModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  name: string;
  price: number;
}

export interface CartItem {
  key: string; // itemId + chosen options: identifies one cart line
  itemId: number;
  name: string;
  image: string;
  isVeg: boolean;
  menuSectionId: number;
  basePrice: number;
  modifiers: CartModifier[];
  modifierTotal: number;
  unitPrice: number; // base price + modifiers, for ONE unit
  quantity: number;
  lineTotal: number; // unitPrice * quantity
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Same dish and same options -> increase quantity. Otherwise a new line.
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.key === action.payload.key);

      if (existing) {
        existing.quantity += action.payload.quantity;
        existing.lineTotal = existing.unitPrice * existing.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    // delta: +1 or -1. Reaching 0 removes the line.
    changeQuantity: (
      state,
      action: PayloadAction<{ key: string; delta: number }>
    ) => {
      const item = state.items.find((i) => i.key === action.payload.key);
      if (!item) return;

      item.quantity += action.payload.delta;

      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.key !== action.payload.key);
      } else {
        item.lineTotal = item.unitPrice * item.quantity;
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.key !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, changeQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;