import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Breadcrumb,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import api from "../../utils/api";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(null);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/v1/invoices", {
          params: {
            page,
            size: 10,
          },
        });

        const data = response.data;

        setInvoices(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);

        setInvoices([]);

        setError(err.response?.data?.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [page]);

  const handleView = async (invoiceNumber) => {
    try {
      setPdfLoading(invoiceNumber);
      setError("");

      const response = await api.get(`/api/v1/invoices/${invoiceNumber}/pdf`, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank");

      // Release the temporary browser URL later
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (err) {
      console.error("Failed to load invoice PDF:", err);

      setError("Failed to open invoice PDF.");
    } finally {
      setPdfLoading(null);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return status
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getOrderStatusVariant = (status) => {
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

        <Breadcrumb.Item active>Invoice & Bills</Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : invoices.length === 0 ? (
        <Alert variant="info">No invoices found.</Alert>
      ) : (
        <>
          {/* Invoice Table */}
          <Table striped bordered hover responsive className="text-center">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Order #</th>
                <th>Date</th>
                <th>Order Status</th>
                <th>Payment Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoiceNumber}>
                  <td className="fw-semibold">{inv.invoiceNumber}</td>

                  <td>{inv.orderNumber}</td>

                  <td>{new Date(inv.invoiceDate).toLocaleString()}</td>

                  <td>
                    <Badge bg={getOrderStatusVariant(inv.orderStatus)}>
                      {formatStatus(inv.orderStatus)}
                    </Badge>
                  </td>

                  <td>
                    <Badge bg={getPaymentStatusVariant(inv.paymentStatus)}>
                      {formatStatus(inv.paymentStatus)}
                    </Badge>
                  </td>

                  <td>₹ {Number(inv.totalAmount).toLocaleString("en-IN")}</td>

                  <td>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      disabled={pdfLoading === inv.invoiceNumber}
                      onClick={() => handleView(inv.invoiceNumber)}
                    >
                      {pdfLoading === inv.invoiceNumber
                        ? "Opening..."
                        : "View / Download"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
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
        </>
      )}
    </Container>
  );
};

export default Invoice;
