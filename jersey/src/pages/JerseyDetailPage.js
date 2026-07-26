import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaStar, FaShoppingCart, FaBolt } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../components/styles/JerseyDetailPage.css";

const JerseyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); 
  const dispatch = useDispatch();



  const API= process.env.REACT_APP_API_URL;


  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert("Please select a size before adding to cart.");
      return;
    }
    const productWithQty = { ...product, qty: quantity, size: selectedSize };
    dispatch(addToCart(productWithQty));
  };

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert("Please select a size before proceeding.");
      return;
    }
    const productWithQty = { ...product, qty: quantity, size: selectedSize };
    dispatch(addToCart(productWithQty));
    navigate("/cart");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/api/jerseys/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        setError("Product not found");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h5>Loading...</h5>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5 text-center">
        <h5>{error || "Product not found"}</h5>
        <p className="text-muted">Go back to the Shop and select a product.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-muted mb-3">
        <small>
          All Products / <strong>{product.name}</strong>
        </small>
      </div>

      <Row>
        {/* Left: Product Image */}
        <Col md={6} className="text-center">
          <img
            src={`${API}/uploads/${product.image}`}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "500px", objectFit: "contain" }}
          />
        </Col>

        {/* Right: Product Info */}
        <Col md={6}>
          <h3>{product.name}</h3>

          <div className="d-flex align-items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-warning me-1" />
            ))}
            <span className="text-muted ms-2">(No reviews yet)</span>
          </div>

          <h4 className="fw-bold mb-4">
            ₹ {product.price.toLocaleString("en-IN")}.00
          </h4>

          {/* ✅ Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded-circle px-3 py-2 ${
                      selectedSize === size
                        ? "bg-dark text-white"
                        : "bg-light text-dark"
                    }`}
                    style={{
                      minWidth: "45px",
                      transition: "0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedSize !== size) {
                        e.target.style.backgroundColor = "#e9ecef";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSize !== size) {
                        e.target.style.backgroundColor = "#f8f9fa";
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="d-flex align-items-center mb-3">
            <Button variant="light" onClick={handleDecrease}>
              −
            </Button>
            <Form.Control
              type="text"
              value={quantity}
              readOnly
              className="mx-2 text-center"
              style={{ width: "60px" }}
            />
            <Button variant="light" onClick={handleIncrease}>
              +
            </Button>
          </div>

          {/* Cart / Buy Buttons */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {product.countInStock === 0 ? (
              <span className="text-danger fw-bold">Out of Stock</span>
            ) : (
              <>
                <Button variant="dark" onClick={handleAddToCart}>
                  <FaShoppingCart className="me-2" /> Add to cart
                </Button>
                <Button variant="outline-dark" onClick={handleBuyNow}>
                  <FaBolt className="me-2" /> Buy now
                </Button>
              </>
            )}
          </div>

          <div>
            <p className="mb-1">
              <a href="#" className="text-decoration-underline">
                Terms and Conditions
              </a>
            </p>
            <small className="text-muted">30-day money-back guarantee</small>
            <br />
            <small className="text-muted">Shipping: 2-3 Business Days</small>
            <br />
            <small className="text-muted">{product.description}</small>
          </div>
        </Col>
      </Row>

      <hr className="mt-5" />
      <h5>Customer Reviews</h5>
      <p className="text-muted">No reviews yet. Be the first to review!</p>
    </Container>
  );
};

export default JerseyDetailPage;
