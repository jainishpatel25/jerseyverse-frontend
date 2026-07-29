import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Row,
  Col,
  Table,
  Badge,
} from "react-bootstrap";
import api from "../../utils/api"; // adjust path if needed

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/v1/orders/${orderId}`);

        setOrder(response.data);

        console.log("Order Detail Response:", response.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);

        setError(
          err.response?.data?.message || "Failed to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>

        <Button
          variant="outline-dark"
          onClick={() => navigate("/profile/orders")}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return null;
  }

  const formatStatus = (status) => {
    if (!status) return "-";

    return status
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Order Details</h2>

          <span className="text-muted">{order.orderNumber}</span>
        </div>

        <Button variant="outline-dark" onClick={() => navigate("/profile/orders")}>
          ← Back to Orders
        </Button>
      </div>

      {/* Order + Payment Information */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5 className="mb-3">Order Information</h5>

              <p className="mb-2">
                <strong>Order Number:</strong> {order.orderNumber}
              </p>

              <p className="mb-2">
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <p className="mb-0">
                <strong>Status:</strong>{" "}
                <Badge bg="dark">{formatStatus(order.status)}</Badge>
              </p>
            </Col>

            <Col md={6}>
              <h5 className="mb-3">Payment Information</h5>

              <p className="mb-2">
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>

              <p className="mb-0">
                <strong>Payment Status:</strong>{" "}
                <Badge
                  bg={
                    order.paymentStatus === "PAID"
                      ? "success"
                      : order.paymentStatus === "FAILED"
                        ? "danger"
                        : "warning"
                  }
                >
                  {formatStatus(order.paymentStatus)}
                </Badge>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Ordered Items */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Ordered Items</h5>

          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-center">Size</th>
                <th className="text-center">Quantity</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {(order.orderItemResponseList || []).map((item) => (
                <tr key={item.productVariantId}>
                  <td>{item.productName}</td>

                  <td className="text-center">{item.size}</td>

                  <td className="text-center">{item.quantity}</td>

                  <td className="text-end">₹ {formatPrice(item.unitPrice)}</td>

                  <td className="text-end">₹ {formatPrice(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Row>
        {/* Address Snapshot */}
        <Col md={7}>
          <Card className="mb-4 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3">Delivery Address</h5>

              {order.orderAddressResponse ? (
                <>
                  <p className="fw-semibold mb-1">
                    {order.orderAddressResponse.fullName}
                  </p>

                  <p className="mb-1">
                    {order.orderAddressResponse.phoneNumber}
                  </p>

                  <p className="mb-1">
                    {order.orderAddressResponse.addressLine1}
                  </p>

                  {order.orderAddressResponse.addressLine2 && (
                    <p className="mb-1">
                      {order.orderAddressResponse.addressLine2}
                    </p>
                  )}

                  <p className="mb-1">
                    {order.orderAddressResponse.city},{" "}
                    {order.orderAddressResponse.state}
                  </p>

                  <p className="mb-1">
                    {order.orderAddressResponse.postalCode}
                  </p>

                  <p className="mb-0">{order.orderAddressResponse.country}</p>
                </>
              ) : (
                <p className="text-muted mb-0">Address unavailable</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Price Summary */}
        <Col md={5}>
          <Card className="mb-4 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹ {formatPrice(order.subtotal)}</span>
              </div>

              {Number(order.discountAmount || 0) > 0 && (
                <div className="d-flex justify-content-between text-success mb-2">
                  <span>
                    Discount
                    {order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>

                  <span>- ₹ {formatPrice(order.discountAmount)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>₹ {formatPrice(order.shippingCharge)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>

                <span>₹ {formatPrice(order.totalAmount)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailPage;
