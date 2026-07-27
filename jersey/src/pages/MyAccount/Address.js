import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Modal,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import AddressAdd from "./AddressAdd";
import api from "../../utils/api";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Open Add Address modal
  const handleAddClick = () => {
    setShowForm(true);
  };

  // Close modal
  const handleFormClose = () => {
    setShowForm(false);
  };

  // Called after POST /addresses succeeds
  const handleFormSuccess = () => {
    setShowForm(false);

    // Changing refresh causes the GET request to run again
    setRefresh((prev) => !prev);
  };

  // Load all addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/v1/addresses");

        console.log("Addresses:", res.data);

        setAddresses(res.data || []);
      } catch (err) {
        console.error("Failed to load addresses:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load addresses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [refresh]);

  return (
    <Container className="py-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="#">
          <i className="bi bi-house-door"></i>
        </Breadcrumb.Item>

        <Breadcrumb.Item active>
          Addresses
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Your Addresses</h5>
      </div>

      {loading ? (
        <p>Loading addresses...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Row className="g-3">

          {/* Existing addresses */}
          {addresses.map((address) => (
            <Col md={6} key={address.id}>
              <div className="p-3 border rounded bg-light h-100">

                <div className="d-flex justify-content-between align-items-start">
                  <p className="fw-semibold mb-1">
                    {address.fullName}
                  </p>

                  {address.default && (
                    <span className="badge bg-dark">
                      Default
                    </span>
                  )}
                </div>

                <p className="mb-1">
                  {address.addressLine1}
                </p>

                {address.addressLine2 && (
                  <p className="mb-1">
                    {address.addressLine2}
                  </p>
                )}

                <p className="mb-1">
                  {address.city}, {address.postalCode}
                </p>

                <p className="mb-1">
                  {address.state}, {address.country}
                </p>

                <p className="mb-0">
                  {address.phoneNumber}
                </p>

              </div>
            </Col>
          ))}

          {/* Add Address card */}
          <Col md={6}>
            <div
              className="p-3 border rounded text-center d-flex flex-column justify-content-center align-items-center h-100 dashed-border"
              style={{
                cursor: "pointer",
                minHeight: "180px",
              }}
              onClick={handleAddClick}
            >
              <FaPlus
                size={28}
                className="text-muted mb-2"
              />

              <p className="mb-0 text-muted">
                Add Address
              </p>
            </div>
          </Col>

        </Row>
      )}

      {/* Add Address Modal */}
      <Modal
        show={showForm}
        onHide={handleFormClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Address
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AddressAdd
            onSuccess={handleFormSuccess}
          />
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default Address;