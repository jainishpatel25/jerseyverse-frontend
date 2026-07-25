import { useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/cartSlice";
import { applyCouponSuccess, removeCoupon } from "../redux/couponSlice"; // import this

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  // const coupon = useSelector((state) => state.coupon);
  const couponState = useSelector((state) => state.coupon);
  const discount = couponState.discount || 0;
  const coupon = couponState.coupon; // { code: 'SAVE10', ... }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  // const discount = coupon.discountAmount || 0;

  const grandTotal = total - discount;

  const API= process.env.REACT_APP_API_URL;


  // const handleApplyCoupon = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/admin/coupons/apply',

  //       {
  //       code: couponInput,
  //       cartTotal: total,
  //     });

  //     if (response.data.valid) {
  //       dispatch(
  //         applyCouponSuccess({
  //           code: couponInput,
  //           discountAmount: response.data.discountType === 'percent'
  //             ? (total * response.data.value) / 100
  //             : response.data.value,
  //         })
  //       );
  //     } else {
  //       alert('Invalid coupon code');
  //     }
  //   } catch (error) {
  //     console.error('Error applying coupon:', error);
  //     alert('Something went wrong. Please try again later.');
  //   }
  // };

  const handleApplyCoupon = async () => {
    try {
      if (!couponInput) {
        alert("Please enter a coupon code");
        return;
      }

      const response = await axios.post(
        `${API}/admin/coupons/apply`,
        {
          code: couponInput,
          cartTotal: total, // make sure total is a number!
        }
      );

      if (response.status === 200) {
        const data = response.data;

        // dispatch(
        //   applyCouponSuccess({
        //     code: data.appliedCode,
        //     discountAmount: data.discount,
        //   })
        // );
        dispatch(
          applyCouponSuccess({
            coupon: { code: data.appliedCode },
            discount: data.discount,
          })
        );

        alert("Coupon applied successfully!");
      } else {
        alert(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container className="my-5">
      <h5 className="mb-4">
        Order &gt; <span className="text-muted">Address</span> &gt;{" "}
        <span className="text-muted">Payment</span>
      </h5>
      <h2 className="mb-4">Order summary</h2>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4>Your cart is empty 🛒</h4>
              <p className="text-muted">Add something to make it happy!</p>
              <Button variant="outline-dark" onClick={() => navigate("/shop")}>
                Go to Shop
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <Row key={item._id} className="align-items-center mb-4">
                <Col xs={3}>
                  <img
                    src={`${API}/uploads/${item.image}`}
                    alt={item.name}
                    className="img-fluid rounded"
                  />
                </Col>
                <Col xs={9}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6>
                        <strong>{item.name} <span className="text-muted">({item.size})</span></strong>
                        
                      </h6>
                      <button
                        className="btn btn-link p-0 text-danger"
                        onClick={() => dispatch(removeFromCart({ _id: item._id, size: item.size }))}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-end">
                      <div className="d-flex align-items-center justify-content-end mb-2">
                        <Button
                          variant="outline-secondary"
                          onClick={() => dispatch(decreaseQty({ _id: item._id, size: item.size }))}
                        >
                          −
                        </Button>
                        <span className="px-3">{item.qty}</span>
                        <Button
                          variant="outline-secondary"
                          onClick={() => dispatch(increaseQty({ _id: item._id, size: item.size }))}
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-primary fw-bold">
                        ₹ {(item.price * item.qty).toLocaleString("en-IN")}.00
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ))
          )}
        </Col>

        <Col md={4}>
          <div className="border rounded p-4 shadow-sm">
            {cartItems.length === 0 ? (
              <div className="text-center text-muted py-3">
                No items in cart.
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span>₹ 0.00</span>
                </div>
                {/* <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹ {total.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span>Taxes</span>
                  <span>₹ 0.00</span>
                </div>
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span>₹ {total.toLocaleString('en-IN')}.00</span>
                </div> */}
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹ {total.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span>Taxes</span>
                  <span>₹ 0.00</span>
                </div>
                {coupon && coupon.code && (
                  <div className="d-flex justify-content-between text-success mb-2">
                    <span>Discount ({coupon.code})</span>
                    <span>− ₹ {discount.toLocaleString("en-IN")}.00</span>
                  </div>
                )}
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span>₹ {grandTotal.toLocaleString("en-IN")}.00</span>
                </div>

                {/* <InputGroup className="mb-3">
                  <Form.Control placeholder="Discount code..." />
                  <Button variant="secondary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                    Apply
                  </Button>
                </InputGroup> */}
                <InputGroup className="mb-3">
                  <Form.Control
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!coupon}
                  />

                  <Button
                    onClick={() =>
                      coupon ? dispatch(removeCoupon()) : handleApplyCoupon()
                    }
                  >
                    {coupon ? "Remove" : "Apply"}
                  </Button>
                </InputGroup>
                {coupon && coupon.code && (
                  <div className="text-success mb-2">
                    Coupon <strong>{coupon.code}</strong> applied 🎉
                  </div>
                )}

                <Button
                  variant="dark"
                  className="w-100 mb-3"
                  onClick={() => navigate("/addresspage")}
                >
                  Checkout &nbsp;→
                </Button>
              </>
            )}
            <div className="text-center text-muted">or</div>
            <div
              className="text-center mt-2 text-dark"
              onClick={() => navigate("/shop")}
              style={{ cursor: "pointer" }}
            >
              <span className="me-1">←</span>Continue shopping
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
