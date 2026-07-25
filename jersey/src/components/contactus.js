import React from "react";
import "./styles/contactus.css";
import {  Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Contactus() {
  const navigate = useNavigate();

  return (
    <div className="decorative-section">
      {/* Floating custom icons */}
      <img
        src="/images/iconk.png"
        alt="Football Icon"
        className="floating-icon icon1"
      />
      <img
        src="/images/icont.png"
        alt="Jersey Icon"
        className="floating-icon icon2"
      />
      <img
        src="/images/icong.png"
        alt="Trophy Icon"
        className="floating-icon icon3"
      />
      <img
        src="/images/icongoal.png"
        alt="Trophy Icon"
        className="floating-icon icon4"
      />
      <img
        src="/images/iconcup.png"
        alt="Trophy Icon"
        className="floating-icon icon5"
      />

      <div className="decorative-background">
        <h2>
          2,000 satisfied customers
          <br />
          have shopped with us.
        </h2>
        <p>
          Trusted by 2,000+ fans for quality kits, secure checkout, and quick
          support.
        </p>
        <Button
          className="contact-button"
          onClick={() => navigate("/contactus")}
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
}

export default Contactus;
