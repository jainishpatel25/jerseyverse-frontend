import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import api from "../../utils/api";
import {
  Table,
  Button,
  Badge,
  Offcanvas,
  ListGroup,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 10;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await api.get("/api/v1/admin/orders", {
        params: {
          page: currentPage,
          size: pageSize,
          sort: "createdAt,desc",
        },
      });

      setOrders(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error(
        "Failed to fetch orders:",
        err.response?.data || err.message,
      );

      setOrders([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };
  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";

      case "PROCESSING":
        return "primary";

      case "SHIPPED":
        return "info";

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "danger";

      case "CONFIRMED":
        return "primary";

      default:
        return "secondary";
    }
  };

  const handleView = async (order) => {
    try {
      setSelectedOrder(null);
      setShowCanvas(true);

      const response = await api.get(`/api/v1/admin/orders/${order.id}`);

      const orderDetails = response.data;

      setSelectedOrder(orderDetails);
      setSelectedStatus("");
      setSelectedPaymentStatus("");
    } catch (err) {
      console.error(
        "Failed to fetch order details:",
        err.response?.data || err.message,
      );

      setShowCanvas(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) {
      return;
    }

    try {
      const response = await api.patch(
        `/api/v1/admin/orders/${selectedOrder.id}/status`,
        {
          status: selectedStatus,
        },
      );

      setSelectedOrder(response.data);
      setSelectedStatus("");

      await fetchOrders(false);
    } catch (err) {
      console.error(
        "Failed to update order status:",
        err.response?.data || err.message,
      );
    }
  };

  const getAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "PENDING":
        return ["CONFIRMED", "CANCELLED"];

      case "CONFIRMED":
        return ["PROCESSING", "CANCELLED"];

      case "PROCESSING":
        return ["SHIPPED"];

      case "SHIPPED":
        return ["DELIVERED"];

      case "DELIVERED":
      case "CANCELLED":
        return [];

      default:
        return [];
    }
  };

  const getAllowedPaymentStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "PENDING":
        return ["PAID", "FAILED"];

      case "PAID":
      case "FAILED":
        return [];

      default:
        return [];
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (!selectedOrder || !selectedPaymentStatus) {
      return;
    }

    try {
      const response = await api.patch(
        `/api/v1/admin/orders/${selectedOrder.id}/payment-status`,
        {
          paymentStatus: selectedPaymentStatus,
        },
      );

      // Keep Offcanvas open with updated details
      setSelectedOrder(response.data);
      setSelectedPaymentStatus("");

      // Silent refresh so Offcanvas doesn't close/reopen
      await fetchOrders(false);
    } catch (err) {
      console.error(
        "Failed to update payment status:",
        err.response?.data || err.message,
      );
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="admin-content">
      <div className="p-4">
        <h4 className="mb-4">Orders</h4>

        {/* Desktop Table */}
        <div className="d-none d-md-block table-responsive-wrapper">
          <Table striped bordered hover className="shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>

                    <td>
                      <div>{order.customerName}</div>
                      <small className="text-muted">
                        {order.customerEmail}
                      </small>
                    </td>

                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                    <td>
                      ₹ {Number(order.totalAmount).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <Badge bg={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>

                    <td>
                      <Badge
                        bg={
                          order.paymentStatus === "PAID"
                            ? "success"
                            : order.paymentStatus === "FAILED"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </td>

                    <td>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => handleView(order)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="d-block d-md-none">
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-card mb-3 p-3 shadow-sm rounded"
            >
              <p>
                <strong>Order #:</strong> {order.orderNumber}
              </p>

              <p>
                <strong>Customer:</strong> {order.customerName}
              </p>

              <p>
                <strong>Email:</strong> {order.customerEmail}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p>
                <strong>Amount:</strong> ₹
                {Number(order.totalAmount).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </p>

              <p>
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
                  {order.paymentStatus}
                </Badge>
              </p>

              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => handleView(order)}
              >
                View
              </Button>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-3">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index === currentPage}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}

        {/* Offcanvas for Order Details */}
        <Offcanvas
          show={showCanvas}
          onHide={() => setShowCanvas(false)}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Order Details</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {selectedOrder && (
              <div>
                <p>
                  <strong>Order ID:</strong> {selectedOrder.orderNumber}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Payment Mode:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  {selectedOrder.orderAddressResponse && (
                    <>
                      <hr />

                      <h6>Delivery Address</h6>

                      <p className="mb-1">
                        {selectedOrder.orderAddressResponse.fullName}
                      </p>

                      <p className="mb-1">
                        {selectedOrder.orderAddressResponse.addressLine1}
                      </p>

                      {selectedOrder.orderAddressResponse.addressLine2 && (
                        <p className="mb-1">
                          {selectedOrder.orderAddressResponse.addressLine2}
                        </p>
                      )}

                      <p className="mb-1">
                        {selectedOrder.orderAddressResponse.city},{" "}
                        {selectedOrder.orderAddressResponse.state}{" "}
                        {selectedOrder.orderAddressResponse.postalCode}
                      </p>

                      <p className="mb-1">
                        {selectedOrder.orderAddressResponse.country}
                      </p>

                      <p>{selectedOrder.orderAddressResponse.phoneNumber}</p>
                    </>
                  )}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg={getStatusVariant(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </p>

                {getAllowedStatuses(selectedOrder.status).length > 0 && (
                  <>
                    <Form.Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="my-2"
                    >
                      <option value="">Select next status</option>

                      {getAllowedStatuses(selectedOrder.status).map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ),
                      )}
                    </Form.Select>

                    <Button
                      variant="primary"
                      className="mb-3"
                      onClick={handleStatusUpdate}
                      disabled={!selectedStatus}
                    >
                      Update Status
                    </Button>
                  </>
                )}

                {getAllowedStatuses(selectedOrder.status).length === 0 && (
                  <p className="text-muted">
                    This order has reached a final status and cannot be updated.
                  </p>
                )}

                <p>
                  <strong>Subtotal:</strong> ₹
                  {Number(selectedOrder.subtotal).toLocaleString("en-IN")}
                </p>

                {selectedOrder.couponCode && (
                  <>
                    <p>
                      <strong>Coupon:</strong>{" "}
                      <Badge bg="success">{selectedOrder.couponCode}</Badge>
                    </p>

                    <p className="text-success">
                      <strong>Discount:</strong> - ₹
                      {Number(selectedOrder.discountAmount || 0).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </>
                )}

                <p>
                  <strong>Shipping:</strong> ₹
                  {Number(selectedOrder.shippingCharge || 0).toLocaleString(
                    "en-IN",
                  )}
                </p>

                <p>
                  <strong>Total Amount:</strong> ₹
                  {Number(selectedOrder.totalAmount).toLocaleString("en-IN")}
                </p>

                <hr />

                <hr />

                <h6>Payment Status</h6>

                <p>
                  Current:{" "}
                  <Badge
                    bg={
                      selectedOrder.paymentStatus === "PAID"
                        ? "success"
                        : selectedOrder.paymentStatus === "FAILED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </p>

                {getAllowedPaymentStatuses(selectedOrder.paymentStatus).length >
                0 ? (
                  <>
                    <Form.Select
                      value={selectedPaymentStatus}
                      onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                      className="my-2"
                    >
                      <option value="">Select payment status</option>

                      {getAllowedPaymentStatuses(
                        selectedOrder.paymentStatus,
                      ).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>

                    <Button
                      variant="primary"
                      className="mb-3"
                      disabled={!selectedPaymentStatus}
                      onClick={handlePaymentStatusUpdate}
                    >
                      Update Payment Status
                    </Button>
                  </>
                ) : (
                  <p className="text-muted">
                    Payment status cannot be updated further.
                  </p>
                )}

                <h6>Items:</h6>

                <ListGroup>
                  {selectedOrder.orderItemResponseList?.length > 0 ? (
                    selectedOrder.orderItemResponseList.map((item) => (
                      <ListGroup.Item
                        key={item.productVariantId}
                        className="d-flex justify-content-between"
                      >
                        <div>
                          <strong>{item.productName}</strong>

                          <div>Size: {item.size}</div>

                          <div>Qty: {item.quantity}</div>

                          <small className="text-muted">
                            ₹{Number(item.unitPrice).toLocaleString("en-IN")}{" "}
                            each
                          </small>
                        </div>

                        <div className="fw-semibold">
                          ₹{Number(item.subtotal).toLocaleString("en-IN")}
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <p className="text-muted">No items found in this order.</p>
                  )}
                </ListGroup>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default OrdersPage;
