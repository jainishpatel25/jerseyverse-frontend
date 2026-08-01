import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Navbar, Container, Collapse, Nav } from "react-bootstrap";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  // Check if admin is logged in
  const isLoggedIn = !!localStorage.getItem("userInfo");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/admin/login");
  };

  return (
    <Navbar expand="md" className="bg-white border-bottom py-2 sticky-top">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center px-2 px-md-4"
      >
        <div className="d-flex align-items-center">
          <img
            src="/images/jslogoadmin.png"
            alt="Logo"
            className=" admin-logo me-2"
          />
          <div className="d-flex flex-column">
            <h6 className="m-0 fw-bold text-dark">Jersey Verse</h6>
            <small className="text-muted">Dashboard Panel</small>
          </div>
          <span className="ms-3 badge rounded-pill bg-light text-dark border">
            Admin
          </span>
        </div>

        {/* Logout Button only visible if admin is logged in */}
        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            variant="dark"
            className="rounded-pill px-3 py-1 d-none d-md-inline"
          >
            Logout
          </Button>
        )}

        {/* For small screens */}
        {isLoggedIn && (
          <div className="d-md-none">
            <Button
              onClick={handleLogout}
              variant="dark"
              className="rounded-pill px-3 py-1"
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
