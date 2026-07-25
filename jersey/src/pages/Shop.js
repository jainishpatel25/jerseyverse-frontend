import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import "../components/styles/ShopPage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/productSlice";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jerseys, setJerseys] = useState([]);
  // const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 500, max: 2500 });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API= process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        const res = await axios.get(`${API}/api/jerseys`);
        setProducts(res.data);
      } catch (err) {
        setError("Failed to fetch jerseys");
      } finally {
        setLoading(false);
      }
    };

    fetchJerseys();
  }, []);

  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        const query = `?search=${searchTerm}&min=${minPrice}&max=${maxPrice}&sort=${sortOrder}&page=${page}&limit=5`;
        const res = await axios.get(
          `${API}/api/jerseys${query}`
        );
        setJerseys(res.data.jerseys || []);
        setTotalPages(res.data.totalPages);
  
    setPriceRange((prev) => {
        if (prev.min === 500 && prev.max === 2500) {
          return { min: res.data.minPrice, max: res.data.maxPrice };
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to fetch jerseys:", err);
    }
  };

    fetchJerseys();
  }, [searchTerm, minPrice, maxPrice, sortOrder, page]);

  return (
    <Container fluid className="p-0 m-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar px-3">
          <div className="price-filter px-2 pt-4">
            <h6 className="fw-bold">Price Range</h6>
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>₹ {priceRange.min}</span>
              <span>₹ {maxPrice}</span>
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="form-range"
            />
          </div>
        </Col>
        {/* Main Content */}
        <Col md={10} className="px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Control
              className="mt-3"
              type="text"
              placeholder="Search..."
              style={{ width: "300px" }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
            />

            <div className="d-flex align-items-center">
              <span className="me-2 mt-3">Sort By:</span>
              <Form.Select
                size="sm mt-3"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ width: "150px" }}
              >
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </Form.Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Row className="g-4">
              {jerseys?.map((product) => (
                <Col key={product._id} md={3} sm={6} xs={12}>
                  <div
                    className="product-box"
                    onClick={() => {
                      dispatch(setSelectedProduct(product));
                      navigate(`/product/${product._id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {/* <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="product-img" /> */}
                    <div className="position-relative">
                      <img
                        src={`${API}/uploads/${product.image}`}
                        alt={product.name}
                        className="product-img"
                      />
                      {product.countInStock === 0 && (
                        <span
                          className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small"
                          style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="product-info">
                      <h6>{product.name}</h6>
                      <p>₹ {product.price.toLocaleString("en-IN")}.00</p>
                      <hr />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
      <div className="d-flex justify-content-center my-4">
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant={page === index + 1 ? "dark" : "light"}
            onClick={() => setPage(index + 1)}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </Container>
  );
};

export default Shop;
