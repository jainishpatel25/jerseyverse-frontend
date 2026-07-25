import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5">
      <h2 className="mb-3">🎉 Order Placed Successfully!</h2>
      <p className="text-muted">Thank you for shopping with us.</p>
      <Button variant="dark" onClick={() => navigate('/shop')}>Continue Shopping</Button>
    </Container>
  );
};

export default OrderSuccessPage;
