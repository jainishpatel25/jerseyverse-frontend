import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  Table,
  Form,
  InputGroup,
  Button,
  Pagination,
  Offcanvas,
  ListGroup,
} from "react-bootstrap";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showOrders, setShowOrders] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const usersPerPage = 5;

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const getSortedUsers = (users) => {
    if (!sortConfig.key) return users;
    return [...users].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "signupDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleViewOrders = async (user) => {
    try {
      setShowOrders(true);
      setSelectedUser(null);
      setUserOrders([]);

      const response = await api.get(`/api/v1/admin/customer/${user.id}`);

      const customer = response.data;

      setSelectedUser(customer);
      setUserOrders(customer.orders || []);
    } catch (err) {
      console.error(
        "Error fetching customer details:",
        err.response?.data || err.message,
      );

      setUserOrders([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/v1/admin/customer", {
        params: {
          page: currentPage,
          size: usersPerPage,
          search: search.trim(),
        },
      });

      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error(
        "Error fetching customers:",
        err.response?.data || err.message,
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="p-4">
        <h4 className="mb-4">Customers</h4>

        <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
          <Form.Control
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
          />
        </InputGroup>

        {/* Desktop Table */}
        <div className="d-none d-md-block">
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email{" "}
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("totalOrders")}
                  style={{ cursor: "pointer" }}
                >
                  Total Orders{" "}
                  {sortConfig.key === "totalOrders" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("signupDate")}
                  style={{ cursor: "pointer" }}
                >
                  Signup Date{" "}
                  {sortConfig.key === "signupDate" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.totalOrders}</td>
                    <td>{new Date(user.signupDate).toLocaleDateString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewOrders(user)}
                      >
                        View Orders
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No matching users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="d-block d-md-none">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="customer-card mb-3 p-3 shadow-sm rounded"
              >
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Total Orders:</strong> {user.totalOrders}
                </p>
                <p>
                  <strong>Signup Date:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  // onClick={() => handleViewOrders(user)}
                  className="w-100 mt-2"
                >
                  View Orders
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">
              No matching users found
            </div>
          )}
        </div>

        {/* Pagination (same for both layouts) */}
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index === currentPage}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>

        {/* Slide panel for user orders */}
        <Offcanvas
          show={showOrders}
          onHide={() => setShowOrders(false)}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{selectedUser?.name}'s Orders</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {selectedUser && (
              <>
                <p>Email: {selectedUser.email}</p>
                <p>Total Orders: {selectedUser.totalOrders}</p>

                <h6>Order History:</h6>

                <ListGroup>
                  {userOrders.length > 0 ? (
                    userOrders.map((order) => (
                      <ListGroup.Item key={order.orderNumber}>
                        <div className="fw-semibold">{order.orderNumber}</div>

                        <div>
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </div>

                        <div>Status: {order.status}</div>

                        <small className="text-muted">
                          {new Date(order.orderDate).toLocaleString()}
                        </small>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <div className="text-muted">No orders found</div>
                  )}
                </ListGroup>
              </>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default Customers;
