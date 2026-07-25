import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import useReducer  from './userSlice';
import productReducer from './productSlice';
import couponReducer from './couponSlice';


// Load from localStorage
const savedCart = localStorage.getItem('cart');
const initialCart = savedCart ? JSON.parse(savedCart) : [];

const store= configureStore({
  reducer: {
    cart: cartReducer,
    user:useReducer,
    product: productReducer,
    coupon:couponReducer,
  },

   preloadedState: {
    cart: initialCart,
  },
});

// Save to localStorage on every state change
store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart));
});



export default store;