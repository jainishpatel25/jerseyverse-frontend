import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../redux/cartSlice";
import { removeCoupon } from "../redux/couponSlice";

import api from "../utils/api"; // adjust path if required

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedAddressId = location.state?.addressId;

  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  // Backend CartResponse stored in Redux
  const cart = useSelector((state) => state.cart);

  const cartItems = cart.items || [];

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = Number(cart.subtotal || 0);
  const discount = Number(cart.discount || 0);
  const deliveryCharge = Number(cart.deliveryCharge || 0);
  const tax = Number(cart.tax || 0);
  const total = Number(cart.total || 0);

  // --------------------------------------------------
  // Fetch selected checkout address
  // --------------------------------------------------

  useEffect(() => {
    const fetchSelectedAddress = async () => {
      if (!selectedAddressId) {
        setError("No delivery address was selected.");
        setAddressLoading(false);
        return;
      }

      try {
        setAddressLoading(true);
        setError("");

        const response = await api.get(
          `/api/v1/addresses/${selectedAddressId}`,
        );

        setAddress(response.data);
      } catch (err) {
        console.error("Failed to load selected address:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load selected delivery address.",
        );
      } finally {
        setAddressLoading(false);
      }
    };

    fetchSelectedAddress();
  }, [selectedAddressId]);

  // --------------------------------------------------
  // Payment selection
  // --------------------------------------------------

  const handlePayment = async () => {
    setError("");

    if (!selectedAddressId) {
      setError("No delivery address was selected.");
      return;
    }

    if (!selectedMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (selectedMethod !== "COD") {
      setError("This payment method is currently unavailable.");
      return;
    }

    const placeOrderRequest = {
      addressId: selectedAddressId,
      paymentMethod: selectedMethod,
    };

    try {
      setPlacingOrder(true);

      const response = await api.post("/api/v1/orders", placeOrderRequest);

      const createdOrder = response.data;

      // ONLY success performs cleanup
      dispatch(resetCart());
      dispatch(removeCoupon());

      localStorage.removeItem("cart");
      localStorage.removeItem("appliedDiscount");
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("paymentMethod");

      navigate("/orderplace", {
        state: {
          order: createdOrder,
        },
      });
    } catch (err) {
      console.error("Failed to place order:", err);

      const errorData = err.response?.data;

      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      setError(
        firstFieldError ||
          errorData?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className="my-5">
      <h5 className="mb-4">
        Order &gt; Address &gt; <span className="fw-bold">Payment</span>
      </h5>

      <h2 className="mb-4">Payment method</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Form>
                {/* CARD - NOT AVAILABLE */}

                <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center bg-light">
                  <Form.Check
                    type="radio"
                    name="payment"
                    label="Card"
                    id="card"
                    disabled
                  />

                  <span className="text-muted small">Coming soon</span>
                </div>

                {/* CASH ON DELIVERY */}

                <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center">
                  <Form.Check
                    type="radio"
                    name="payment"
                    label="Cash on Delivery"
                    id="cod"
                    value="COD"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    checked={selectedMethod === "COD"}
                  />

                  <span className="fw-semibold">COD</span>
                </div>

                {/* NETBANKING - NOT AVAILABLE */}

                <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center bg-light">
                  <Form.Check
                    type="radio"
                    name="payment"
                    label="Netbanking"
                    id="netbanking"
                    disabled
                  />

                  <span className="text-muted small">Coming soon</span>
                </div>

                {/* UPI - NOT AVAILABLE */}

                <div className="border rounded px-3 py-2 mb-2 d-flex justify-content-between align-items-center bg-light">
                  <Form.Check
                    type="radio"
                    name="payment"
                    label="UPI"
                    id="upi"
                    disabled
                  />

                  <span className="text-muted small">Coming soon</span>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* SELECTED DELIVERY ADDRESS */}

          <Card>
            <Card.Body>
              <strong>Delivery & Billing</strong>

              {addressLoading ? (
                <p className="text-muted mt-3 mb-0">Loading address...</p>
              ) : address ? (
                <div className="mt-3">
                  <p className="fw-semibold mb-1">{address.fullName}</p>

                  <p className="mb-1">{address.addressLine1}</p>

                  {address.addressLine2 && (
                    <p className="mb-1">{address.addressLine2}</p>
                  )}

                  <p className="mb-1">
                    {address.city}, {address.postalCode}
                  </p>

                  <p className="mb-1">
                    {address.state}, {address.country}
                  </p>

                  <p className="mb-0">{address.phoneNumber}</p>
                </div>
              ) : (
                <p className="text-danger mt-3 mb-0">
                  Delivery address unavailable.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* ORDER SUMMARY */}

        <Col md={4}>
          <div className="border rounded p-4 shadow-sm">
            <h6 className="fw-bold mb-3">Order summary</h6>

            <div className="d-flex justify-content-between mb-2">
              <span>
                ({totalItems} item
                {totalItems !== 1 ? "s" : ""})
              </span>

              <span>₹ {subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Delivery</span>

              <span>₹ {deliveryCharge.toLocaleString("en-IN")}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>

              <span>₹ {subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
              <span>Taxes</span>

              <span>₹ {tax.toLocaleString("en-IN")}</span>
            </div>

            {cart.appliedCouponCode && discount > 0 && (
              <div className="d-flex justify-content-between text-success fw-semibold mb-2">
                <span>Coupon ({cart.appliedCouponCode})</span>

                <span>- ₹ {discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>

              <span>₹ {total.toLocaleString("en-IN")}</span>
            </div>

            <Button
              variant="dark"
              className="w-100 mb-3"
              onClick={handlePayment}
              disabled={addressLoading || !address || placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>

            <div className="text-center text-muted">or</div>

            <div
              className="text-center mt-2 text-dark"
              onClick={handleBack}
              style={{ cursor: "pointer" }}
            >
              ← Back to address
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
