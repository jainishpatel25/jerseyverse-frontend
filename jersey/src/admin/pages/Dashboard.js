import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const API= process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/admin/dashboard-stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-content">
    <div className="p-4">
      <h4 className="mb-4">Dashboard Overview</h4>
      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Orders</h5>
              <h3 className="text-primary">{stats.totalOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Products</h5>
              <h3 className="text-success">{stats.totalProducts}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Revenue</h5>
              <h3 className="text-warning">₹{stats.totalRevenue.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    </div>
  );
};

export default Dashboard;
