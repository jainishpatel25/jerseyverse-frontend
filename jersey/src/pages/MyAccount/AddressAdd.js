import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import api from "../../utils/api";

const AddressAdd = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "India",
    postalCode: initialData?.postalCode || "",
    isDefault: initialData?.default || false,
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

      if (initialData?.id) {
        await api.put(`/api/v1/addresses/${initialData.id}`, formData);
      } else {
        await api.post("/api/v1/addresses", formData);
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to save address:", err);

      const errorData = err.response?.data;
      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      setError(
        firstFieldError || errorData?.message || "Failed to save address",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-2">
        <Form.Label>Full Name</Form.Label>

        <Form.Control
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Phone Number</Form.Label>

        <Form.Control
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Address Line 1</Form.Label>

        <Form.Control
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Address Line 2</Form.Label>

        <Form.Control
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>City</Form.Label>

        <Form.Control
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>State</Form.Label>

        <Form.Control
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Country</Form.Label>

        <Form.Control
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Postal Code</Form.Label>

        <Form.Control
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Check
        type="checkbox"
        name="isDefault"
        label="Set as default address"
        checked={formData.isDefault}
        onChange={handleChange}
        className="mb-3"
      />

      <Button type="submit" variant="dark" disabled={submitting}>
        {submitting
          ? "Saving..."
          : initialData
            ? "Update Address"
            : "Save Address"}
      </Button>
    </Form>
  );
};

export default AddressAdd;
