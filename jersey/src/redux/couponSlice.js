// // src/redux/couponSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   coupon: null,        // applied coupon object
//   discount: 0,         // calculated discount amount
//   error: null,         // error message from coupon validation
// };

// const couponSlice = createSlice({
//   name: 'coupon',
//   initialState,
//   reducers: {
//     applyCouponSuccess: (state, action) => {
//       state.coupon = action.payload.coupon;
//       state.discount = action.payload.discount;
//       state.error = null;
//     },
//     applyCouponFail: (state, action) => {
//       state.coupon = null;
//       state.discount = 0;
//       state.error = action.payload;
//     },
//     removeCoupon: (state) => {
//       state.coupon = null;
//       state.discount = 0;
//       state.error = null;
//     },
//   },
// });

// export const { applyCouponSuccess, applyCouponFail, removeCoupon } = couponSlice.actions;
// export default couponSlice.reducer;
// src/redux/couponSlice.js
import { createSlice } from '@reduxjs/toolkit';

const savedCoupon = localStorage.getItem('appliedCoupon');
const savedDiscount = localStorage.getItem('appliedDiscount');

const initialState = {
  coupon: savedCoupon ? JSON.parse(savedCoupon) : null,
  discount: savedDiscount ? Number(savedDiscount) : 0,
  error: null,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    applyCouponSuccess: (state, action) => {
      state.coupon = action.payload.coupon;
      state.discount = action.payload.discount;
      state.error = null;
      // save to localStorage
      localStorage.setItem('appliedCoupon', JSON.stringify(action.payload.coupon));
      localStorage.setItem('appliedDiscount', action.payload.discount);
    },
    applyCouponFail: (state, action) => {
      state.coupon = null;
      state.discount = 0;
      state.error = action.payload;
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('appliedDiscount');
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.error = null;
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('appliedDiscount');
    },
  },
});

export const { applyCouponSuccess, applyCouponFail, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
