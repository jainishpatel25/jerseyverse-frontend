import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import api from "../../utils/api";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/v1/admin/dashboard");

        setStats(res.data);
      } catch (err) {
        console.error(
          "Error fetching dashboard stats:",
          err.response?.data || err.message,
        );
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
                <h3 className="text-warning">
                  ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
