import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Aboutus = () => {
  return (
    <Container className="my-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1>About Us</h1>
        <p className="lead">"Connecting sports fans with their favorite jerseys, one game at a time."</p>
      </div>

      {/* Our Story */}
      <Row className="mb-5 text-center">
        <Col md={12}>
          <h2>Our Story</h2>
          <p>
            Founded in 2025, JerseyVerse Sportswear aims to provide high-quality football jerseys to fans across the country.
            We believe in authenticity, comfort, and delivering your favorite team’s spirit right to your doorstep.
          </p>
        </Col>
      </Row>

      {/* Our Vision */}
      <Row className="mb-5 text-center">
        <Col md={12}>
          <h2>Our Vision</h2>
          <p>
            To be the go-to platform for fans to celebrate their love for sports, ensuring every fan feels connected to the game.
          </p>
        </Col>
      </Row>

      {/* What We Offer */}
      <Row className="mb-5">
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h5>Official Jerseys</h5>
            <p>Wide variety of designs – home, away, and special edition jerseys.</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h5>Customizable</h5>
            <p>Add your name or number to your jersey.</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h5>Fast Delivery</h5>
            <p>Receive your jersey quickly and safely.</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 mb-3">
            <h5>Support</h5>
            <p>We’re here to help with any questions.</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Aboutus;
