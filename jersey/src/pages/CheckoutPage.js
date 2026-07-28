// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useDispatch ,useSelector} from 'react-redux';
// import { clearCart } from '../redux/cartSlice';

// const CheckoutPage = () => {
//   const [cart, setCart] = useState([]);
//   const [discount, setDiscount] = useState(0);
//   const [couponCode, setCouponCode] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//    const { coupon } = useSelector((state) => state.coupon);

//   const API= process.env.REACT_APP_API_URL;
// // 

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
//     const storedDiscount = parseFloat(localStorage.getItem('appliedDiscount')) || 0;
//     const storedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;

//     setCart(storedCart);
//     setDiscount(storedDiscount);
//     setCouponCode(storedCoupon?.code || null);
//   }, []);

//   const originalTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
//   const finalTotal = originalTotal - discount;

//   const handlePlaceOrder = async () => {
//     const user = JSON.parse(localStorage.getItem('userInfo'));
//     const address = JSON.parse(localStorage.getItem('userAddress'));
//     const paymentMethod = localStorage.getItem('paymentMethod');

//     if (!user || !user.token || !user._id) {
//       alert('Please login before placing an order.');
//       return;
//     }

//     try {
//       const orderData = {
//         items: cart.map(item => ({
//           jersey: item._id,
//           quantity: item.qty,
//           size: item.size,
//           price: item.price
//         })),
//         address,
//         paymentMethod,
//         totalAmount: finalTotal,
//         discountAmount: discount,
//         appliedCoupon: coupon,
//       };

//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`
//         }
//       };

//       await axios.post(`${API}/api/orders`, orderData, config);

//       dispatch(clearCart());
//       alert('Order placed successfully!');

//       // Clear localStorage
//       localStorage.removeItem('cart');
//       localStorage.removeItem('appliedDiscount');
//       localStorage.removeItem('appliedCoupon');
//       localStorage.removeItem('paymentMethod');

//       navigate('/orderplace');
//     } catch (error) {
//       console.error('Error placing order:', error.response?.data || error.message);
//       alert('Something went wrong. Try again.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Checkout</h2>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <ul className="list-group mb-3">
//             {cart.map(item => (
//               <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
//                 <span>{item.name} (x{item.qty}) ({item.size})</span>
//                 <span>₹{item.qty * item.price}</span>
//               </li>
//             ))}
//           </ul>

//           <h5>Subtotal: ₹{originalTotal}</h5>
//           {discount > 0 && <h5 className="text-success">Discount Applied: -₹{discount}</h5>}
//           <h4>Total Payable: ₹{finalTotal}</h4>

//           <button className="btn btn-primary mt-3" onClick={handlePlaceOrder}>
//             Place Order
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;
