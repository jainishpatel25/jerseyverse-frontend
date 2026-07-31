import React, { useEffect, useState } from "react";
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

import api from "../utils/api";

const Shop = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jerseys, setJerseys] = useState([]);
  // const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState("");

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 0,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: page - 1,
          size: 5,
        };

        if (debouncedSearchTerm.trim()) {
          params.search = debouncedSearchTerm.trim();
        }

        if (minPrice !== "") {
          params.minPrice = minPrice;
        }

        if (debouncedMaxPrice !== "") {
          params.maxPrice = debouncedMaxPrice;
        }

        if (sortOrder) {
          params.sort = sortOrder;
        }

        const res = await api.get("/api/v1/products", { params });

        setJerseys(res.data.content || []);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchJerseys();
  }, [debouncedSearchTerm, minPrice, debouncedMaxPrice, sortOrder, page]);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const res = await api.get("/api/v1/products/price-range");

        const min = res.data.minPrice;
        const max = res.data.maxPrice;

        setPriceRange({
          min,
          max,
        });

        setMinPrice(min);
        setMaxPrice(max);
      } catch (err) {
        console.error("Failed to fetch price range:", err);
      }
    };

    fetchPriceRange();
  }, []);

  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${API}${imageUrl}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [maxPrice, searchTerm]);
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
            {/* <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(Number(e.target.value));
                setPage(1);
              }}
              className="form-range"
            /> */}
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
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
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                style={{ width: "150px" }}
              >
                <option value="">Featured</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="name,asc">Name: A to Z</option>
                <option value="name,desc">Name: Z to A</option>
              </Form.Select>
            </div>
          </div>

          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              {/* Full spinner only when there are no products yet */}
              {loading && jerseys.length === 0 ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "400px" }}
                >
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  {/* Small loader during search/filter/sort */}
                  {loading && (
                    <div className="text-center mb-3">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2 text-muted">
                        Updating products...
                      </span>
                    </div>
                  )}

                  <Row className="g-4">
                    {jerseys?.map((product) => (
                      <Col key={product.id} md={3} sm={6} xs={12}>
                        <div
                          className="product-box"
                          onClick={() => {
                            dispatch(setSelectedProduct(product));
                            navigate(`/product/${product.id}`);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="position-relative">
                            <img
                              src={getProductImageUrl(product.imageUrl)}
                              alt={product.name}
                              className="product-img"
                            />

                            {product.stockStatus === "OUT_OF_STOCK" && (
                              <span
                                className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small"
                                style={{
                                  borderRadius: "0 0.5rem 0.5rem 0",
                                }}
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
                </>
              )}
            </>
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
