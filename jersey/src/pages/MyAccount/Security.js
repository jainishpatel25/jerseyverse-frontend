// ConnectionSecurity.js
import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
} from "react-bootstrap";
import api from "../../utils/api";

const Security = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const requestData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await api.put("/api/v1/users/change-password", requestData);

      alert("Password updated successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errorData = error.response?.data;
      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      alert(firstFieldError || errorData?.message || "Error updating password");
    }
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <i className="bi bi-house-door"></i>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Connection & Security</Breadcrumb.Item>
      </Breadcrumb>
      <hr
        className="ms-2"
        style={{
          width: "610px",
          height: "0px",
          backgroundColor: "#A9A9A9",
          opacity: 1,
        }}
      />
      <Row className="justify-content-start">
        <Col md={6}>
          <h4 className="mb-4 fw-semibold">Change Password</h4>
          <div className="p-1">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="currentPassword" className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                />
              </Form.Group>

              <Form.Group controlId="newPassword" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter new password"
                />
              </Form.Group>

              <Button
                variant="dark"
                type="submit"
                className="w-50 rounded-pill mb-3"
              >
                Update Password
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Security;
