import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin.css";
import {
  Table,
  Button,
  Badge,
  Offcanvas,
  ListGroup,
  Spinner,
  Form,
} from "react-bootstrap";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  
  
  const API= process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/admin/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      case "Delivered":
        return "info";
      case "Processing":
        return "primary";
      default:
        return "secondary";
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status); // set status safely after order is selected
    setShowCanvas(true);
  };

  const handleStatusUpdate = async (selectedOrder) => {
    try {
      await axios.patch(
        `${API}/admin/orders/${selectedOrder}/status`,
        {
          status: selectedStatus,
        }
      );
      fetchOrders(); // ✅ refresh orders
      setShowCanvas(false); // ✅ close offcanvas
    } catch (error) {
      console.error(error);
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
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || "Guest"}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹ {order.totalAmount}</td>
                  <td>
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status}
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
              ))}
            </tbody>
          </Table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="d-block d-md-none">
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card mb-3 p-3 shadow-sm rounded"
            >
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Customer:</strong> {order.user?.name || "Guest"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={getStatusVariant(order.status)}>
                  {order.status}
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
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedOrder.user?.name || "Guest"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Payment Mode:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.address
                    ? `${selectedOrder.address.street}, ${selectedOrder.address.city}, ${selectedOrder.address.state} - ${selectedOrder.address.zip}, ${selectedOrder.address.country}`
                    : "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg={getStatusVariant(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </p>

                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="my-2"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </Form.Select>

                <Button
                  variant="primary"
                  className="mb-3"
                  onClick={() => handleStatusUpdate(selectedOrder._id)}
                >
                  Update Status
                </Button>

                {selectedOrder.appliedCoupon?.code ? (
                  <>
                    <p>
                      <strong>Applied Coupon:</strong>{" "}
                      <Badge bg="success">
                        {selectedOrder.appliedCoupon.code}
                      </Badge>
                    </p>
                    <p>
                      <strong>Discount:</strong> ₹{selectedOrder.discountAmount}
                    </p>
                    <p>
                      <strong>Original Total:</strong> ₹
                      {selectedOrder.totalAmount + selectedOrder.discountAmount}
                    </p>
                    <p>
                      <strong>Total Payable:</strong> ₹
                      {selectedOrder.totalAmount}
                    </p>
                  </>
                ) : (
                  <p>
                    <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
                  </p>
                )}

                <hr />
                <h6>Items:</h6>
                <ListGroup>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <ul className="list-group">
                      {selectedOrder.items.map((item, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between flex-column flex-sm-row"
                        >
                          <div>
                            <strong>{item.jersey?.name}</strong>
                            <div>Size: {item.size || "N/A"}</div>
                            <div>Qty: {item.quantity}</div>
                          </div>
                          <div>₹{item.jersey?.price}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items found in this order.</p>
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
