// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaPhone, FaEnvelope } from 'react-icons/fa6';
import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container>
        <Row className="justify-content-center text-center">
          <Col xs="auto" className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
          </Col>
        </Row>

        <Row className="text-center mt-3">
          <Col>
            <p className="address">
              Chala Vapi · Valsad GUJ 396191 · India
            </p>
            <p className="contact">
              <FaPhone className="icon" /> +91 9409025xxx &nbsp;&nbsp;
              <FaEnvelope className="icon" /> infojerseyverse@gmail.com
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col xs="auto">
            <img src="/images/jslogo.png" alt="Your Logo" className="footer-logo" />
          </Col>
        </Row>
      </Container>

      <div className="footer-bottom text-center mt-4">
        <p>Copyright © JerseyVerse</p>
      </div>
    </footer>
  );
};

export default Footer;
