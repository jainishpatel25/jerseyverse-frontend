import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../components/styles/ContactPage.css';

const ContactUs = () => {
  return (
    <div className="contact-section">
      <Container>
        <h2 className="contact-title">Contact us</h2>
        <p className="contact-subtitle">
          Contact us about anything related to our company or services.<br />
          We’ll do our best to get back to you as soon as possible.
        </p>
        <Row className="mt-4">
          <Col md={8}>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="+91 00000 00000" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCompany" className="mb-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Control type="text" placeholder="Your company" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formSubject" className="mb-3">
                <Form.Label>Subject *</Form.Label>
                <Form.Control type="text" placeholder="Subject" />
              </Form.Group>
              <Form.Group controlId="formQuestion" className="mb-3">
                <Form.Label>Question *</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Your question..." />
              </Form.Group>
              <Button variant="dark" type="submit" className="rounded-pill px-4">Submit</Button>
            </Form>
          </Col>
          <Col md={4} className="pt-4 pt-md-0">
            <div className="contact-info">
              <h5>My Company</h5>
              <p><FaMapMarkerAlt className="me-2" />Chala Vapi</p>
              <p><FaPhone className="me-2" /> +91 9409025xxx</p>
              <p><FaEnvelope className="me-2" /> infojerseyverse@gmail.com</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
