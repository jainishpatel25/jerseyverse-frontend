import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddressForm = ({ onConfirm }) => {
  


  const savedAddress = JSON.parse(localStorage.getItem('userAddress')) || {};

const [formData, setFormData] = useState({
  name: savedAddress.name || '',
  email: savedAddress.email || '',
  phone: savedAddress.phone || '',
  company: savedAddress.company || '',
  vat: savedAddress.vat || '',
  street: savedAddress.street || '',
  apartment: savedAddress.apartment || '',
  city: savedAddress.city || '',
  zip: savedAddress.zip || '',
  country: savedAddress.country || 'India',
  state: savedAddress.state || 'Gujarat',
});

  const API= process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (!user || !user.token) {
      alert('You must be logged in to save address.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    };

    await axios.post(`${API}/api/address`, formData, config);
    // ✅ Save address locally as well
    localStorage.setItem('userAddress', JSON.stringify(formData));

    // You can optionally show a success message
    // alert('Address saved successfully!');
    onConfirm(); // triggers UI to go to AddressSelect
  } catch (error) {
    console.error('Error saving address:', error.response?.data || error.message);
    alert('Failed to save address. Try again.');
  }
};

  return (
    <Container className="my-5">
      <h5 className="mb-4">Order &gt; <span className="fw-bold text-dark">Address</span> &gt; <span className="text-muted">Payment</span></h5>
      <h2>Edit address</h2>

      <Alert variant="warning">
        You are editing your <strong>delivery and billing</strong> addresses at the same time!<br />
        If you want to modify your billing address, create a new address.
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Your name *</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>VAT</Form.Label>
              <Form.Control name="vat" value={formData.vat} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control name="company" value={formData.company} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Street and Number *</Form.Label>
              <Form.Control name="street" value={formData.street} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Apartment, suite, etc.</Form.Label>
          <Form.Control name="apartment" value={formData.apartment} onChange={handleChange} />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City *</Form.Label>
              <Form.Control name="city" value={formData.city} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Zip Code *</Form.Label>
              <Form.Control name="zip" value={formData.zip} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Country *</Form.Label>
              <Form.Select name="country" value={formData.country} onChange={handleChange}>
                <option>India</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>State / Province *</Form.Label>
              <Form.Select name="state" value={formData.state} onChange={handleChange}>
                <option>Gujarat</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="dark">Confirm</Button>
      </Form>
    </Container>
  );
};

export default AddressForm;
