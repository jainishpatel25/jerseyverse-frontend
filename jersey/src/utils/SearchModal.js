import React, { useState, useEffect } from "react";
import { Modal, Form, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../components/styles/serachmodal.css";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/productSlice";
import api from "./api";

const SearchModal = ({ show, onHide }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = process.env.REACT_APP_API_URL;

  // Fetch products as user types (basic debounce)
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const { data } = await api.get("/api/v1/products", {
          params: {
            search: query.trim(),
            page: 0,
            size: 5,
          },
        });

        setResults(data.content || []);
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    const timeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (product) => {
    onHide(); // close modal
    dispatch(setSelectedProduct(product)); // 👈 same as Shop.js
    navigate(`/product/${product.id}`);
  };

  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${API}${imageUrl}`;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard
      dialogClassName="search-modal-dialog"
    >
      <Modal.Header closeButton>
        <Form.Control
          type="text"
          placeholder="Search for jerseys..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
        {results.length === 0 && query && (
          <p className="text-center text-muted">No products found</p>
        )}
        <ListGroup>
          {results.map((product) => (
            <ListGroup.Item
              key={product.id}
              action
              onClick={() => handleSelect(product)}
              className="d-flex align-items-center gap-3"
            >
              <img
                src={getProductImageUrl(product.imageUrl)}
                alt={product.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div>
                <div className="fw-semibold">{product.name}</div>
                <div className="text-muted small">₹{product.price}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
