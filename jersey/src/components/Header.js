import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import showToast from "../utils/showToast";
import SearchModal from "../utils/SearchModal";
import "./styles/serachmodal.css";

import { resetCart } from "../redux/cartSlice";

import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useState } from "react";
import "./styles/header.css";
function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart);

  const totalQty = (cart.items || []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(resetCart());

    showToast("Logged out successfully", "success");
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      style={{ backgroundColor: "#2c2c2c" }}
      className="py-0 px-4"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src="/images/jslogo.png" alt="Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav className="me-auto gap-3">
            <Nav.Link as={Link} to="/" active>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/shop">
              Shop
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contactus">
              Contact Us
            </Nav.Link>
          </Nav>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Search icon only */}
            <Button
              variant="light"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
              onClick={() => setShowSearch(true)}
            >
              <FaSearch />
            </Button>

            <SearchModal
              show={showSearch}
              onHide={() => setShowSearch(false)}
            />

            {/* Cart icon */}
            <Button
              as={Link}
              to="/cart"
              variant="light"
              className="rounded-circle position-relative d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
            >
              <FaShoppingCart />
              {totalQty > 0 && (
                <Badge
                  bg="dark"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: "0.7rem" }}
                >
                  {totalQty}
                </Badge>
              )}
            </Button>

            {/* User Icon or Auth Buttons */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: "38px", height: "38px" }}
                  id="user-dropdown"
                >
                  <FaUser />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Hi, {user.name}
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile/orders">
                    Orders
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={logoutHandler}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="light" size="sm">
                  Register
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
