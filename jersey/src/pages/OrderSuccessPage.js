import React from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // OrderDetailResponse passed from PaymentPage
  const order = location.state?.order;

  // Prevent showing fake success information
  // if somebody directly opens /orderplace
  if (!order) {
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">Order information is unavailable.</Alert>

        <Button variant="dark" onClick={() => navigate("/shop")}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2 className="mb-3">🎉 Order Placed Successfully!</h2>

        <p className="text-muted">Thank you for shopping with us.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-4">Order Confirmation</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Order Number</span>

                <strong>{order.orderNumber}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Order Status</span>

                <span>{order.status}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Payment Method</span>

                <span>{order.paymentMethod}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Payment Status</span>

                <span>{order.paymentStatus}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>

                <span>
                  ₹ {Number(order.subtotal || 0).toLocaleString("en-IN")}
                </span>
              </div>

              {Number(order.discountAmount || 0) > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>
                    Discount
                    {order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>

                  <span>
                    - ₹ {Number(order.discountAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>

                <span>
                  ₹ {Number(order.shippingCharge || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="d-flex justify-content-between fw-bold border-top pt-3 mt-3">
                <span>Total Amount</span>

                <span>
                  ₹ {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button variant="dark" onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccessPage;
