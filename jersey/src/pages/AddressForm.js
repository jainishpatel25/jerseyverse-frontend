import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

import api from "../utils/api"; // adjust path if needed

const AddressForm = ({ onConfirm }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "India",
    state: "",
    isDefault: false,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSubmitting(true);

      // Create address
      const response = await api.post("/api/v1/addresses", formData);

      const createdAddress = response.data;

      // POST does not automatically set the backend default.
      // Use the dedicated default endpoint.
      if (formData.isDefault && createdAddress?.id) {
        await api.patch(`/api/v1/addresses/${createdAddress.id}/default`);
      }

      // Tell AddressPage that creation succeeded
      if (onConfirm) {
        onConfirm(createdAddress);
      }
    } catch (err) {
      console.error("Error saving address:", err);

      const errorData = err.response?.data;
      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      setError(
        firstFieldError || errorData?.message || "Failed to save address.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h5 className="mb-4">
        Order &gt; <span className="fw-bold text-dark">Address</span> &gt;{" "}
        <span className="text-muted">Payment</span>
      </h5>

      <h2 className="mb-4">Add address</h2>

      <Alert variant="warning">Add a delivery address for your order.</Alert>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Your name *</Form.Label>

              <Form.Control
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>

              <Form.Control
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Street and Number *</Form.Label>

              <Form.Control
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apartment, suite, etc.</Form.Label>

              <Form.Control
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City *</Form.Label>

              <Form.Control
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Zip Code *</Form.Label>

              <Form.Control
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Country *</Form.Label>

              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>State / Province *</Form.Label>

              <Form.Control
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state or province"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Check
          type="checkbox"
          name="isDefault"
          label="Set as default address"
          checked={formData.isDefault}
          onChange={handleChange}
          className="mb-4"
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" variant="dark" disabled={submitting}>
          {submitting ? "Saving..." : "Confirm"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddressForm;
