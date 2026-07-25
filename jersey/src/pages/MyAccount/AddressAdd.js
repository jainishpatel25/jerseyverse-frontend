// components/AddressForm.jsx
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddressAdd = ({ initialData = {}, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    street: initialData?.street || '',
    apartment: initialData?.apartment || '',
    city: initialData?.city || '',
    zip: initialData?.zip || '',
    state: initialData?.state || '',
    country: initialData?.country || 'India',
  });
  const API= process.env.REACT_APP_API_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      if (initialData && initialData._id) {
        // Edit
        await axios.put(`${API}/api/address/${initialData._id}`, formData, config);
      } else {
        // Add
        await axios.post(`${API}/api/address`, formData, config);
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to save address', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Name</Form.Label>
        <Form.Control name="name" value={formData.name} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control name="email" value={formData.email} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Phone</Form.Label>
        <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
      </Form.Group>
     <Form.Group className="mb-2">
        <Form.Label>Street</Form.Label>
        <Form.Control name="street" value={formData.street} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Apartment</Form.Label>
        <Form.Control name="apartment" value={formData.apartment} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>City</Form.Label>
        <Form.Control name="city" value={formData.city} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Zip</Form.Label>
        <Form.Control name="zip" value={formData.zip} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>State</Form.Label>
        <Form.Control name="state" value={formData.state} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Country</Form.Label>
        <Form.Control name="country" value={formData.country} onChange={handleChange} />
      </Form.Group>     
      <Button type="submit">Save Address</Button>
    </Form>
  );
};

export default AddressAdd;
