import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

import { useDispatch } from "react-redux";
import { setCart as setReduxCart } from "../redux/cartSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Backend cart state
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Get cart from Spring Boot
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/v1/cart");

        console.log("Backend cart:", response.data);

        setCart(response.data);
        dispatch(setReduxCart(response.data));
      } catch (err) {
        console.error("Failed to load cart:", err);

        setError(err.response?.data?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Backend is now the source of truth
  const cartItems = cart?.items || [];

  const subtotal = Number(cart?.subtotal || 0);
  const discount = Number(cart?.discount || 0);
  const deliveryCharge = Number(cart?.deliveryCharge || 0);
  const tax = Number(cart?.tax || 0);
  const total = Number(cart?.total || 0);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    // Backend requires quantity >= 1
    if (newQuantity < 1) {
      return;
    }

    try {
      setError("");

      const response = await api.put(`/api/v1/cart/items/${cartItemId}`, {
        quantity: newQuantity,
      });

      // PUT already returns the updated CartResponse
      setCart(response.data);
      dispatch(setReduxCart(response.data));
    } catch (err) {
      console.error("Failed to update quantity:", err);

      alert(err.response?.data?.message || "Failed to update cart quantity");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      setError("");

      const response = await api.delete(`/api/v1/cart/items/${cartItemId}`);

      // Backend returns the updated cart
      setCart(response.data);
      dispatch(setReduxCart(response.data));
    } catch (err) {
      console.error("Failed to remove cart item:", err);

      alert(err.response?.data?.message || "Failed to remove item from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      setError("");

      const response = await api.delete("/api/v1/cart");

      // Backend returns the empty updated CartResponse
      setCart(response.data);
      dispatch(setReduxCart(response.data));
    } catch (err) {
      console.error("Failed to clear cart:", err);

      alert(err.response?.data?.message || "Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    try {
      setError("");

      const response = await api.get("/api/v1/cart/checkout");

      // Keep the latest validated cart returned by backend
      setCart(response.data);
      dispatch(setReduxCart(response.data));

      navigate("/addresspage");
    } catch (err) {
      console.error("Checkout validation failed:", err);

      alert(
        err.response?.data?.message ||
          "Cart validation failed. Please review your cart.",
      );
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");

      const response = await api.post("/api/v1/coupons/apply", {
        couponCode: couponCode.trim(),
      });

      // Backend returns complete updated CartResponse
      setCart(response.data);
      dispatch(setReduxCart(response.data));

      setCouponCode("");
    } catch (err) {
      console.error("Failed to apply coupon:", err);

      setCouponError(err.response?.data?.message || "Failed to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setCouponLoading(true);
      setCouponError("");

      const response = await api.delete("/api/v1/coupons/apply");

      // Backend returns updated CartResponse
      setCart(response.data);
      dispatch(setReduxCart(response.data));

      setCouponCode("");
    } catch (err) {
      console.error("Failed to remove coupon:", err);

      setCouponError(err.response?.data?.message || "Failed to remove coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <h5>Loading cart...</h5>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="my-5 text-center">
        <p className="text-danger">{error}</p>

        <Button variant="outline-dark" onClick={() => navigate("/shop")}>
          Go to Shop
        </Button>
      </Container>
    );
  }

  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${API}${imageUrl}`;
  };

  return (
    <Container className="my-5">
      <h5 className="mb-4">
        Order &gt; <span className="text-muted">Address</span> &gt;{" "}
        <span className="text-muted">Payment</span>
      </h5>

      <h2 className="mb-4">Order summary</h2>

      <Row>
        {/* LEFT SIDE - CART ITEMS */}
        {cartItems.length > 0 && (
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </div>
        )}
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
              <Row key={item.cartItemId} className="align-items-center mb-4">
                {/* PRODUCT IMAGE */}
                <Col xs={3}>
                  <img
                    src={getProductImageUrl(item.imageUrl)}
                    alt={item.productName}
                    className="img-fluid rounded"
                  />
                </Col>

                {/* PRODUCT DETAILS */}
                <Col xs={9}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6>
                        <strong>
                          {item.productName}

                          <span className="text-muted"> ({item.size})</span>
                        </strong>
                      </h6>

                      {/* Step 6D will connect this */}
                      <button
                        className="btn btn-link p-0 text-danger"
                        onClick={() => handleRemoveItem(item.cartItemId)}
                      >
                        Remove
                      </button>

                      {item.availabilityStatus && (
                        <div className="small text-muted mt-1">
                          {item.availabilityStatus}
                        </div>
                      )}
                    </div>

                    <div className="text-end">
                      {/* Step 6C will connect quantity updates */}
                      <div className="d-flex align-items-center justify-content-end mb-2">
                        <Button
                          variant="outline-secondary"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity - 1,
                            )
                          }
                        >
                          −
                        </Button>

                        <span className="px-3">{item.quantity}</span>

                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity + 1,
                            )
                          }
                        >
                          +
                        </Button>
                      </div>

                      <div className="text-primary fw-bold">
                        ₹ {Number(item.itemSubtotal).toLocaleString("en-IN")}
                      </div>

                      <small className="text-muted">
                        ₹ {Number(item.unitPrice).toLocaleString("en-IN")} each
                      </small>
                    </div>
                  </div>
                </Col>
              </Row>
            ))
          )}
        </Col>

        {/* RIGHT SIDE - ORDER SUMMARY */}
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

                  <span>₹ {deliveryCharge.toLocaleString("en-IN")}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>

                  <span>₹ {subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span>Taxes</span>

                  <span>₹ {tax.toLocaleString("en-IN")}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between text-success mb-2">
                    <span>
                      Discount
                      {cart?.appliedCouponCode
                        ? ` (${cart.appliedCouponCode})`
                        : ""}
                    </span>

                    <span>− ₹ {discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>

                  <span>₹ {total.toLocaleString("en-IN")}</span>
                </div>
                {/* Coupon Input */}
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Discount code..."
                      value={
                        cart?.appliedCouponCode
                          ? cart.appliedCouponCode
                          : couponCode
                      }
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      disabled={!!cart?.appliedCouponCode}
                    />

                    {cart?.appliedCouponCode ? (
                      <Button
                        variant="primary"
                        onClick={handleRemoveCoupon}
                        disabled={couponLoading}
                      >
                        {couponLoading ? "Removing..." : "Remove"}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </Button>
                    )}
                  </div>

                  {couponError && (
                    <div className="text-danger small mt-1">{couponError}</div>
                  )}
                </div>

                <Button
                  variant="dark"
                  className="w-100 mb-3"
                  onClick={handleCheckout}
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
              <span className="me-1">←</span>
              Continue shopping
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
