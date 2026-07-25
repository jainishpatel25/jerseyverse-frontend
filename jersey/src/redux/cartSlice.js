// import { createSlice } from '@reduxjs/toolkit';

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: [],
//   reducers: {
//     addToCart: (state, action) => {
//   const existingItem = state.find(item => item._id === action.payload._id);
//   if (existingItem) {
//     existingItem.qty += action.payload.qty || 1; // increment quantity if item already in cart
//   } else {
//     state.push({ ...action.payload, qty: action.payload.qty || 1 }); // set quantity for new item
//   }
// },

//    removeFromCart: (state, action) => {
//       return state.filter(item => item._id !== action.payload);
//     },
//      increaseQty: (state, action) => {
//       const item = state.find(i => i._id === action.payload);
//       if (item) item.qty += 1;
//     },
//     decreaseQty: (state, action) => {
//       const item = state.find(i => i._id === action.payload);
//       if (item && item.qty > 1) item.qty -= 1;
//     },
//     clearCart: () => [] // ✅ this clears the entire cart
//   },
// });

// export const { addToCart , removeFromCart ,increaseQty,decreaseQty ,clearCart} = cartSlice.actions;
// export default cartSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      // Find existing item with same _id AND size
      const existingItem = state.find(
        item =>
          item._id === action.payload._id &&
          item.size === action.payload.size
      );

      if (existingItem) {
        // Increment quantity if same item + size exists
        existingItem.qty += action.payload.qty || 1;
      } else {
        // Add new item with qty (and size)
        state.push({
          ...action.payload,
          qty: action.payload.qty || 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      // action.payload should include _id and size
      return state.filter(
        item =>
          !(item._id === action.payload._id && item.size === action.payload.size)
      );
    },

    increaseQty: (state, action) => {
      const item = state.find(
        i => i._id === action.payload._id && i.size === action.payload.size
      );
      if (item) item.qty += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.find(
        i => i._id === action.payload._id && i.size === action.payload.size
      );
      if (item && item.qty > 1) item.qty -= 1;
    },

    clearCart: () => [] // clears the entire cart
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
