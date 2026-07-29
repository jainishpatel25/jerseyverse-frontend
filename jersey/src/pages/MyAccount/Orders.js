import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Container,
  Table,
  Breadcrumb,
  Spinner,
  Alert,
  Badge,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/v1/orders", {
          params: {
            page: page,
            size: 10,
          },
        });

        const data = response.data;

        setOrders(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error("Failed to fetch orders:", err);

        setOrders([]);

        setError(err.response?.data?.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "secondary";

      case "CONFIRMED":
        return "primary";

      case "SHIPPED":
        return "info";

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "danger";

      default:
        return "dark";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return status
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPaymentStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "success";

      case "PENDING":
        return "warning";

      case "FAILED":
        return "danger";

      case "REFUNDED":
        return "info";

      default:
        return "secondary";
    }
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <i className="bi bi-house-door"></i>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Sales Orders</Breadcrumb.Item>
      </Breadcrumb>

      <h5 className="mb-4">Sales Orders</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="order-table">
          <thead>
            <tr>
              <th>Sales Order #</th>
              <th className="text-center">Order Date</th>
              <th className="text-center">Payment</th>
              <th className="text-center">Payment Status</th>
              <th className="text-end">Total</th>
              <th className="text-center">Order Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const date = new Date(order.createdAt);

              return (
                <tr key={order.id}>
                  <td className="fw-semibold">{order.orderNumber}</td>

                  <td className="text-center">
                    {date.toLocaleDateString()} &nbsp;
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="text-center">{order.paymentMethod}</td>

                  <td className="text-center">
                    <Badge bg={getPaymentStatusVariant(order.paymentStatus)}>
                      {formatStatus(order.paymentStatus)}
                    </Badge>
                  </td>

                  <td className="text-end">
                    ₹ {Number(order.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="text-center">
                    <Badge bg={getStatusVariant(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="outline-dark"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="text-muted">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="outline-dark"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Order;
