// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
// // import { FaEdit } from 'react-icons/fa';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const PaymentPage = () => {
//   const [selectedMethod, setSelectedMethod] = useState('');
//   const [address, setAddress] = useState(null);
//   const cartItems = useSelector((state) => state.cart); 
//   const { cart } = useSelector((state) => state);
//   const { coupon, discount } = useSelector((state) => state.coupon); // 👈 Add this

//   const subtotal = cartItems.reduce((sum, item) => {
//   const price = typeof item.price === 'number' ? item.price : Number(item.price);
//   const qty = typeof item.qty === 'number' ? item.qty : Number(item.qty);
//   return sum + price * qty;
// }, 0);
//   const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
//   const Delivery = 0;
//   const tax = 0;
//   const total = subtotal  + tax- discount;

//   const API= process.env.REACT_APP_API_URL;


//   useEffect(() => {
//      const fetchAddress = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem('userInfo'));
//         if (!user || !user.token) return;

//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };

//         const res = await axios.get(`${API}/api/address`, config);
//         setAddress(res.data);
//       } catch (err) {
//         console.error('Failed to load address:', err);
//       }
//     };

//     fetchAddress();
//   }, []);

//   const handlePayment = () => {
//   if (!selectedMethod) {
    
//     alert("Please select a payment method.");
//     return;
//   }
//   localStorage.setItem('paymentMethod', selectedMethod);

//   if (selectedMethod === 'cod') {
//     // alert("Order placed successfully with Cash on Delivery!");
    
//     // // OPTIONAL: clear cart from redux + localStorage
//     // localStorage.removeItem('cart');
//     window.location.href = '/checkout'; // or navigate to a success page
//   } else {
//     alert(`Payment method '${selectedMethod}' is not available in demo mode.`);
//   }
// };

//   const handleBack = () => {
//     window.history.back();
//   };

//   return (
//     <Container className="my-5">
//       <h5 className="mb-4">Order &gt; Address &gt; <span className="fw-bold">Payment</span></h5>
//       <h2 className="mb-4">Payment method</h2>
//       <Row>
//         <Col md={8}>
//           <Card className="mb-3">
//             <Card.Body>
//               <Form>
//                 {/* Card */}
//                 <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="payment"
//                     label="Card"
//                     id="card"
//                     value="card"
//                     onChange={(e) => setSelectedMethod(e.target.value)}
//                     checked={selectedMethod === 'card'}
//                   />
//                   <div className="d-flex gap-2">
//                     <img src="https://img.icons8.com/color/32/amex.png" alt="amex" />
//                     <img src="https://img.icons8.com/color/32/discover.png" alt="discover" />
//                     <img src="https://img.icons8.com/color/32/visa.png" alt="visa" />
//                   </div>
//                 </div>

//                 {/* Cash on Delivery */}
//                 <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="payment"
//                     label="Cash on Delivery"
//                     id="cod"
//                     value="cod"
//                     onChange={(e) => setSelectedMethod(e.target.value)}
//                     checked={selectedMethod === 'cod'}
//                   />
//                   <img src="https://img.icons8.com/fluency/32/cash-in-hand.png" alt="cash" />
//                 </div>

//                 {/* Netbanking */}
//                 <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="payment"
//                     label="Netbanking"
//                     id="netbanking"
//                     value="netbanking"
//                     onChange={(e) => setSelectedMethod(e.target.value)}
//                     checked={selectedMethod === 'netbanking'}
//                   />
//                   <img src="https://img.icons8.com/color/32/bank-building.png" alt="netbanking" />
//                 </div>

//                 {/* UPI */}
//                 <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="payment"
//                     label="UPI"
//                     id="upi"
//                     value="upi"
//                     onChange={(e) => setSelectedMethod(e.target.value)}
//                     checked={selectedMethod === 'upi'}
//                   />
//                   <img src="https://img.icons8.com/color/32/upi.png" alt="upi" />
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>

//           {/* Address Box */}
//           {address && (
//             <Card>
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <strong>Delivery & Billing</strong>
//                   {/* <Button variant="link" size="sm" onClick={() => window.history.back()}>
//                     <FaEdit className="me-1" /> Edit
//                   </Button> */}
//                 </div>
//                 <p className="mb-1 mt-2">{address.company}, {address.email}</p>
//                 <p className="mb-1">{address.street}</p>
//                 <p className="mb-1">{address.apartment}</p>
//                 <p className="mb-1">{address.city} {address.zip}</p>
//                 <p className="mb-1">{address.state} GJ</p>
//                 <p>{address.country}</p>
//               </Card.Body>
//             </Card>
//           )}
//         </Col>

//         {/* Order Summary */}
//         <Col md={4}>
//           <div className="border rounded p-4 shadow-sm">
//             <h6 className="fw-bold mb-3">Order summary</h6>
//             <div className="d-flex justify-content-between mb-2">
//               <span>({totalItems} item{cartItems.length > 1 ? 's' : ''})</span>
//               <span>₹ {subtotal.toLocaleString('en-IN')}.00</span>
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Delivery</span>
//               <span>₹ {Delivery.toLocaleString('en-IN')}.00</span>
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Subtotal</span>
//               <span>₹ {subtotal.toLocaleString('en-IN')}.00</span>
//             </div>
//             <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
//               <span>Taxes</span>
//               <span>₹ {tax.toLocaleString('en-IN')}.00</span>
//             </div>
//              {coupon && (
//     <div className="d-flex justify-content-between text-success fw-semibold mb-2">
//       <span>Coupon Applied ({coupon.code})</span>
//       <span>- ₹ {discount.toLocaleString('en-IN')}.00</span>
//     </div>
//   )}
//             <div className="d-flex justify-content-between fw-bold mb-3">
//               <span>Total</span>
//               <span>₹ {total.toLocaleString('en-IN')}.00</span>
//             </div>

//             {/* <InputGroup className="mb-3">
//   <Form.Control placeholder="Discount code..." />
//   <Button variant="secondary" id="button-addon2" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
//     Apply
//   </Button>
// </InputGroup> */}

//             <Button variant="dark" className="w-100 mb-3" onClick={handlePayment}>
//               Pay now
//             </Button>

//             <div className="text-center text-muted">or</div>
//             <div className="text-center mt-2 text-dark" onClick={handleBack} style={{ cursor: 'pointer' }}>
//               ← Back to address
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default PaymentPage;
import React from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Address selected on AddressSelect.js
  const selectedAddressId = location.state?.addressId;

  console.log(
    "Selected checkout address ID:",
    selectedAddressId
  );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className="my-5">
      <h5 className="mb-4">
        Order &gt; Address &gt;{" "}
        <span className="fw-bold text-dark">
          Payment
        </span>
      </h5>

      <h2 className="mb-4">
        Payment
      </h2>

      {selectedAddressId ? (
        <Alert variant="success">
          Selected Address ID:{" "}
          <strong>{selectedAddressId}</strong>
        </Alert>
      ) : (
        <Alert variant="danger">
          No delivery address was selected.
        </Alert>
      )}

      <div className="mt-4">
        <Button
          variant="outline-dark"
          onClick={handleBack}
        >
          ← Back to Address
        </Button>
      </div>
    </Container>
  );
};

export default PaymentPage;