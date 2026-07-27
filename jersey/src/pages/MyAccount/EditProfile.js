import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../../utils/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/userSlice";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/v1/users/me");

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccessMessage("");

      const updateData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      };

      const { data } = await api.put("/api/v1/users/me", updateData);

      dispatch(updateUserProfile(data));

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
      });

      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);

      const errorData = err.response?.data;
      const fieldErrors = errorData?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)[0]
        : null;

      setError(
        firstFieldError || errorData?.message || "Failed to update profile",
      );
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-4 text-center fw-bold">Edit Profile</h3>

              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                    plaintext
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="phone" className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="dark" type="submit" className="rounded-pill">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
