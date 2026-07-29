import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Card, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialFormState = {
    couponCode: "",
    discountType: "FLAT",
    discountValue: "",
    minimumOrderAmount: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/v1/admin/coupons", {
        params: {
          page,
          size: 10,
          sortBy: "createdAt",
          sortDir: "desc",
        },
      });

      const data = response.data;

      setCoupons(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);

      setCoupons([]);

      setError(err.response?.data?.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => {
    setShowModal(true);
    setEditingCoupon(null);
    setFormData(initialFormState);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData(initialFormState);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCoupon = async (e) => {
    try {
      setError("");

      const requestData = {
        couponCode: formData.couponCode.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumOrderAmount: Number(formData.minimumOrderAmount),
        maxUses: Number(formData.maxUses),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      await api.post("/api/v1/admin/coupons", requestData);

      alert("Coupon created successfully!", "success");

      setFormData(initialFormState);
      setShowModal(false);

      // Reload current coupon page
      await fetchCoupons();
    } catch (err) {
      console.error("Failed to create coupon:", err);

      const errorData = err.response?.data;
      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      const message =
        firstFieldError || errorData?.message || "Failed to create coupon.";

      setError(message);
      alert(message, "error");
    }
  };

  const handleEdit = async (couponId) => {
    try {
      setError("");

      const response = await api.get(`/api/v1/admin/coupons/${couponId}`);

      const coupon = response.data;

      setEditingCoupon(coupon);

      setFormData({
        couponCode: coupon.couponCode,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maxUses: coupon.maxUses,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
      });

      setShowModal(true);
    } catch (err) {
      console.error("Failed to load coupon:", err);

      const message =
        err.response?.data?.message || "Failed to load coupon details.";

      alert(message, "error");
    }
  };

  const handleUpdateCoupon = async () => {
    try {
      setError("");

      const requestData = {
        couponCode: formData.couponCode.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumOrderAmount: Number(formData.minimumOrderAmount),
        maxUses: Number(formData.maxUses),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      await api.put(`/api/v1/admin/coupons/${editingCoupon.id}`, requestData);

      alert("Coupon updated successfully!", "success");

      setEditingCoupon(null);
      setFormData(initialFormState);
      setShowModal(false);

      await fetchCoupons();
    } catch (err) {
      console.error("Failed to update coupon:", err);

      const errorData = err.response?.data;
      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      const message =
        firstFieldError || errorData?.message || "Failed to update coupon.";

      setError(message);
      alert(message, "error");
    }
  };

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon "${coupon.couponCode}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/api/v1/admin/coupons/${coupon.id}`);

      alert("Coupon deleted successfully!", "success");

      await fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon:", err);

      const message = err.response?.data?.message || "Failed to delete coupon.";

      alert(message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingCoupon) {
      await handleUpdateCoupon();
    } else {
      await handleCreateCoupon();
    }
  };

  const handleStatusChange = async (coupon) => {
    try {
      setError("");

      const newStatus = coupon.status === "ACTIVE" ? "DISABLED" : "ACTIVE";

      await api.patch(`/api/v1/admin/coupons/${coupon.id}/status`, {
        status: newStatus,
      });

      alert(
        `Coupon ${
          newStatus === "ACTIVE" ? "activated" : "disabled"
        } successfully!`,
        "success",
      );

      await fetchCoupons();
    } catch (err) {
      console.error("Failed to update coupon status:", err);

      const message =
        err.response?.data?.message || "Failed to update coupon status.";

      alert(message, "error");
    }
  };
  return (
    <div className="admin-content">
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Coupons & Discounts</h4>
          <Button variant="dark" onClick={handleShow}>
            + Add Coupon
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="d-none d-md-block">
          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive bordered hover className="mb-0">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    {/* <th>Min Order</th> */}
                    <th>Max Uses</th>
                    <th>Used</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td>{coupon.couponCode}</td>

                        <td>{coupon.discountType}</td>

                        <td>
                          {coupon.discountType === "FLAT"
                            ? `₹${coupon.discountValue}`
                            : `${coupon.discountValue}%`}
                        </td>

                        <td>{coupon.maxUses}</td>

                        <td>{coupon.usedCount}</td>

                        <td>{coupon.startDate}</td>

                        <td>{coupon.endDate}</td>

                        <td>
                          <Button
                            variant={
                              coupon.status === "ACTIVE"
                                ? "success"
                                : "secondary"
                            }
                            size="sm"
                            onClick={() => handleStatusChange(coupon)}
                          >
                            {coupon.status === "ACTIVE" ? "Active" : "Disabled"}
                          </Button>
                        </td>

                        <td className="d-flex gap-2">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleEdit(coupon.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(coupon)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-muted">
                        No coupons created yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="d-block d-md-none">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <Card key={coupon.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <p>
                    <strong>Code:</strong> {coupon.couponCode}
                  </p>

                  <p>
                    <strong>Type:</strong> {coupon.discountType}
                  </p>

                  <p>
                    <strong>Value:</strong>{" "}
                    {coupon.discountType === "FLAT"
                      ? `₹${coupon.discountValue}`
                      : `${coupon.discountValue}%`}
                  </p>

                  <p>
                    <strong>Max Uses:</strong> {coupon.maxUses}
                  </p>

                  <p>
                    <strong>Used:</strong> {coupon.usedCount}
                  </p>

                  <p>
                    <strong>Start:</strong> {coupon.startDate}
                  </p>

                  <p>
                    <strong>End:</strong> {coupon.endDate}
                  </p>

                  <Button
                    variant={
                      coupon.status === "ACTIVE" ? "success" : "secondary"
                    }
                    size="sm"
                    onClick={() => handleStatusChange(coupon)}
                  >
                    {coupon.status === "ACTIVE" ? "Active" : "Disabled"}
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(coupon)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted">No coupons created yet</div>
          )}
        </div>

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

        {/* Modal for Create/Edit Coupon (same as your code) */}
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Coupon Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Type</Form.Label>
                    <Form.Select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      required
                    >
                      <option value="FLAT">Flat</option>
                      <option value="PERCENTAGE">Percentage</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Value</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Order Amount</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name="minimumOrderAmount"
                      value={formData.minimumOrderAmount}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Maximum Uses</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      name="maxUses"
                      value={formData.maxUses}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="DISABLED">Disabled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={handleClose}>
                Cancel
              </Button>

              <Button variant="dark" type="submit">
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Coupon;
