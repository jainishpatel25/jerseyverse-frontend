import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form ,InputGroup} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaEdit, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import AddressAdd from './MyAccount/AddressAdd';





const AddressSelect = () => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState(null);
  const [delivery, setDelivery] = useState('express');
  const [sameBilling, setSameBilling] = useState(true);
  const navigate = useNavigate();

  const { coupon, discount } = useSelector((state) => state.coupon);
  const cartItems = useSelector((state) => state.cart); 
  const subtotal = cartItems.reduce((sum, item) => {
  const price = typeof item.price === 'number' ? item.price : Number(item.price);
  const qty = typeof item.qty === 'number' ? item.qty : Number(item.qty);
  return sum + price * qty;
}, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const Delivery = 0;
  const tax = 0;
  // const total = subtotal  + tax;
  const total = subtotal + tax - discount;
  const API= process.env.REACT_APP_API_URL;


  useEffect(() => {
  const fetchAddress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!user || !user.token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(`${API}/api/address`, config);
      setAddress(res.data); // set the fetched address
    } catch (err) {
      console.error('Failed to load address:', err);
    }
  };

  fetchAddress();
}, []);

  const handleConfirm = () => {
    // Redirect to payment or next step
    alert("Proceeding to payment...");
    navigate('/payment')
  };

  // const handleEdit = () => {
  //   localStorage.removeItem('userAddress');
  //   window.location.reload();
  // };
 const handleEdit = () => {
  setShowForm(true);
};
 

  if (!address) return null;

  return (
    <Container className="my-5">
      <h5 className="mb-4">Order &gt; <span className="fw-bold text-dark">Address</span> &gt; <span className="text-muted">Payment</span></h5>
      <h2 className="mb-4">Delivery address</h2>
      <Row>
        <Col md={8}>
            {/* ✅ Updated Address UI */}
      <Row className="mb-5">
        <Col md={6}>
          <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-between">
            <div>
              <p className="mb-1 fw-semibold">{address.company || ''}, {address.email}</p>
              <p className="mb-1">{address.street}</p>
              <p className="mb-1">{address.apartment}</p>
              <p className="mb-1">{address.city} {address.zip}</p>
              <p className="mb-1">{address.state} GJ</p>
              <p className="mb-3">{address.country}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <FaCreditCard className="me-2" />
              <Button variant="outline-dark" size="sm" onClick={handleEdit}>
                <FaEdit className="me-1" /> Edit
              </Button>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="p-3 border rounded text-center d-flex flex-column justify-content-center align-items-center h-100" style={{ borderStyle: 'dashed' }}>
            <FaPlus size={28} className="text-muted mb-2" />
            <p className="mb-0 text-muted">Add Address</p>
          </div>
        </Col>
      </Row>

          <div className="mt-4">
            <h5>Delivery method</h5>
            <Form>
              <div className="border rounded p-2 mb-2 d-flex justify-content-between">
                <Form.Check
                  type="radio"
                  label="Standard delivery"
                  name="delivery"
                  id="standard"
                  value="standard"
                  onChange={() => setDelivery('standard')}
                  checked={delivery === 'standard'}
                />
                <span>Free</span>
              </div>
              <div className="border rounded p-2 d-flex justify-content-between">
                <Form.Check
                  type="radio"
                  label="Express Delivery"
                  name="delivery"
                  id="express"
                  value="express"
                  onChange={() => setDelivery('express')}
                  checked={delivery === 'express'}
                />
                <span>Free</span>
              </div>
            </Form>
          </div>

          <div className="mt-4">
            <h5>Billing address</h5>
            <Form.Check
              type="switch"
              label="Same as delivery address"
              checked={sameBilling}
              onChange={() => setSameBilling(!sameBilling)}
            />
          </div>
        </Col>

        <Col md={4}>
          <div className="border rounded p-4 shadow-sm">
            <h6 className="fw-bold mb-3">Order summary</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>({totalItems} item{cartItems.length > 1 ? 's' : ''})</span>
              <span>₹ {subtotal.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery</span>
              <span>₹ {Delivery.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
              <span>Taxes</span>
              <span>₹ {tax.toLocaleString('en-IN')}.00</span>
            </div>
            {discount > 0 && coupon && (
  <div className="d-flex justify-content-between text-success mb-2">
    <span>Coupon ({coupon.code})</span>
    <span>- ₹ {discount.toLocaleString('en-IN')}.00</span>
  </div>
)}

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span>₹ {total.toLocaleString('en-IN')}.00</span>
            </div>

            {/* <InputGroup className="mb-3">
  <Form.Control placeholder="Discount code..." />
  <Button variant="secondary" id="button-addon2" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
    Apply
  </Button>
</InputGroup> */}

            <Button variant="dark" className="w-100 mb-3" onClick={handleConfirm}>
              Confirm &nbsp; →
            </Button>

            <div className="text-center text-muted">or</div>
            <div className="text-center mt-2 text-dark" onClick={()=> {navigate('/cart')}} style={{cursor:'pointer'}}>
              ← Back to cart
            </div>
          </div>
        </Col>
      </Row>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Edit Address</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <AddressAdd
      initialData={address}
      onSuccess={() => {
        setShowForm(false);
        // Refetch address
        const user = JSON.parse(localStorage.getItem('userInfo'));
        axios.get(`${API}/api/address`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((res) => setAddress(res.data));
      }}
    />
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default AddressSelect;
