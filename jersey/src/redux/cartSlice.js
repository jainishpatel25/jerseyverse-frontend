import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartId: null,
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryCharge: 0,
  tax: 0,
  total: 0,
  appliedCouponCode: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      return {
        ...initialState,
        ...action.payload,
      };
    },

    resetCart: () => initialState,
  },
});

export const { setCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
