import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CancelOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [error, setError] = useState('');
//   const[order,setOrder]=useState("");
  const {id}=useParams();

  const API= process.env.REACT_APP_API_URL;


  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      setCancelingOrderId(orderId);
      await axios.put(`${API}/api/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh orders
      const res = await axios.get(`${API}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      alert('Error cancelling order.');
    } finally {
      setCancelingOrderId(null);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!orders.length) return <Alert variant="info">No orders found.</Alert>;

  return (
    <Container className="py-4">
      <h4>Cancel Order</h4>

      {orders.map((order) => (
        <Card key={order._id} className="mb-4">
          <Card.Body>
            <Row className="mb-2">
              <Col><strong>Order ID:</strong></Col>
              <Col>{order._id}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Status:</strong></Col>
              <Col>{order.status}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Total:</strong></Col>
              <Col>₹ {order.totalAmount?.toLocaleString('en-IN')}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Date:</strong></Col>
              <Col>{new Date(order.createdAt).toLocaleString()}</Col>
            </Row>

            {order.status === 'Pending' ? (
              <Button
                variant="danger"
                onClick={() => handleCancel(order._id)}
                disabled={cancelingOrderId === order._id}
              >
                {cancelingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            ) : (
              <Alert variant="info" className="mt-3 mb-0">You can no longer cancel this order.</Alert>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default CancelOrderPage;
