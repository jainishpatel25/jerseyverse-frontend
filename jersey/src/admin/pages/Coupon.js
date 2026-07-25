// // Coupon.js (Updated with Buttons + Status Toggle)
// import React, { useState } from 'react';

// import { Card, Button, Table, Form, Row, Col, Modal } from 'react-bootstrap';

// const Coupon = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState(null);

//   const [formData, setFormData] = useState({
//     code: '',
//     type: 'flat',
//     value: '',
//     minOrder: '',
//     maxUses: '',
//     startDate: '',
//     endDate: '',
//   });

//   const handleShow = () => {
//     setShowModal(true);
//     setEditingCoupon(null);
//     setFormData({
//       code: '',
//       type: 'flat',
//       value: '',
//       minOrder: '',
//       maxUses: '',
//       startDate: '',
//       endDate: '',
//     });
//   };

//   const handleClose = () => {
//     setShowModal(false);
//     setEditingCoupon(null);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCreateOrUpdateCoupon = () => {
//     if (editingCoupon) {
//       const updated = coupons.map(coupon =>
//         coupon.id === editingCoupon.id ? { ...editingCoupon, ...formData } : coupon
//       );
//       setCoupons(updated);
//     } else {
//       setCoupons([
//         ...coupons,
//         { ...formData, id: Date.now(), status: 'Active', used: 0 },
//       ]);
//     }
//     handleClose();
//   };

//   const handleEdit = (coupon) => {
//     setEditingCoupon(coupon);
//     setFormData({ ...coupon });
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this coupon?");
//     if (confirm) {
//       setCoupons(coupons.filter(coupon => coupon.id !== id));
//     }
//   };

//   const toggleStatus = (id) => {
//     const updated = coupons.map(coupon =>
//       coupon.id === id
//         ? { ...coupon, status: coupon.status === 'Active' ? 'Disabled' : 'Active' }
//         : coupon
//     );
//     setCoupons(updated);
//   };

//   return (
//     <div className="p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="m-0">Coupons & Discounts</h4>
//         <Button variant="dark" onClick={handleShow}>+ Add Coupon</Button>
//       </div>

//       <Card className="shadow-sm">
//         <Card.Body>
//           <Table responsive bordered hover className="mb-0">
//             <thead>
//               <tr>
//                 <th>Code</th>
//                 <th>Type</th>
//                 <th>Value</th>
//                 <th>Min Order</th>
//                 <th>Max Uses</th>
//                 <th>Used</th>
//                 <th>Start</th>
//                 <th>End</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {coupons.length > 0 ? (
//                 coupons.map(coupon => (
//                   <tr key={coupon.id}>
//                     <td>{coupon.code}</td>
//                     <td>{coupon.type}</td>
//                     <td>{coupon.type === 'flat' ? `₹${coupon.value}` : `${coupon.value}%`}</td>
//                     <td>₹{coupon.minOrder}</td>
//                     <td>{coupon.maxUses}</td>
//                     <td>{coupon.used}</td>
//                     <td>{coupon.startDate}</td>
//                     <td>{coupon.endDate}</td>
//                     <td>
//                       <Button
//                         variant={coupon.status === 'Active' ? 'success' : 'secondary'}
//                         size="sm"
//                         onClick={() => toggleStatus(coupon.id)}
//                       >
//                         {coupon.status}
//                       </Button>
//                     </td>
//                     <td className="d-flex gap-2">
//                       <Button variant="info" size="sm" onClick={() => handleEdit(coupon)}>Edit</Button>
//                       <Button variant="danger" size="sm" onClick={() => handleDelete(coupon.id)}>Delete</Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="10" className="text-center text-muted">No coupons created yet</td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       {/* Modal for Create/Edit Coupon */}
//       <Modal show={showModal} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="formCode">
//                   <Form.Label>Coupon Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="code"
//                     value={formData.code}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="formType">
//                   <Form.Label>Discount Type</Form.Label>
//                   <Form.Select name="type" value={formData.type} onChange={handleChange}>
//                     <option value="flat">Flat (₹)</option>
//                     <option value="percentage">Percentage (%)</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="formValue">
//                   <Form.Label>Discount Value</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="value"
//                     value={formData.value}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="formMinOrder">
//                   <Form.Label>Minimum Order Amount</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="minOrder"
//                     value={formData.minOrder}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="formMaxUses">
//                   <Form.Label>Max Uses</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="maxUses"
//                     value={formData.maxUses}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group controlId="formStartDate">
//                   <Form.Label>Start Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group controlId="formEndDate">
//                   <Form.Label>End Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>Cancel</Button>
//           <Button variant="primary" onClick={handleCreateOrUpdateCoupon}>
//             {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Coupon;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "flat",
    value: "",
    minOrder: "",
    maxUses: "",
    startDate: "",
    endDate: "",
  });
  const API= process.env.REACT_APP_API_URL;

  const API_BASE = "/admin/coupons"; // adjust if needed

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${API}${API_BASE}`);
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  const handleShow = () => {
    setShowModal(true);
    setEditingCoupon(null);
    setFormData({
      code: "",
      type: "flat",
      value: "",
      minOrder: "",
      maxUses: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateCoupon = async () => {
    try {
      if (editingCoupon) {
        // Update
        await axios.put(`${API}${API_BASE}/${editingCoupon._id}`, formData);
      } else {
        // Create
        await axios.post(`${API}${API_BASE}/create`, formData);
      }
      fetchCoupons();
      handleClose();
    } catch (err) {
      console.error("Error saving coupon:", err);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({ code: coupon.code || "",
    type: coupon.type || "flat",
    value: coupon.value || "",
    minOrder: coupon.minOrder || "",
    maxUses: coupon.maxUses || "",
    startDate: coupon.startDate?.substring(0, 10) || "",
    endDate: coupon.endDate?.substring(0, 10) || "", });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (confirm) {
      try {
        await axios.delete(`${API}${API_BASE}/${id}`);
        fetchCoupons();
      } catch (err) {
        console.error("Error deleting coupon:", err);
      }
    }
  };

 
  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(
        `${API}/admin/coupons/${id}`,
        {
          status:
            coupons.find((c) => c._id === id).status === "Active"
              ? "Disabled"
              : "Active",
        }
      );

      const updatedCoupon = res.data.coupon;

      // ✅ Update the local coupons state
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: updatedCoupon.status } : c
        )
      );

      console.log("Status updated");
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="admin-content">
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Coupons & Discounts</h4>
          <Button variant="dark" onClick={handleShow}>
            + Add Coupon
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="d-none d-md-block">
          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive bordered hover className="mb-0">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Min Order</th>
                    <th>Max Uses</th>
                    <th>Used</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                      <tr key={coupon._id}>
                        <td>{coupon.code}</td>
                        <td>{coupon.type}</td>
                        <td>
                          {coupon.type === "flat"
                            ? `₹${coupon.value}`
                            : `${coupon.value}%`}
                        </td>
                        <td>₹{coupon.minOrder}</td>
                        <td>{coupon.maxUses}</td>
                        <td>{coupon.used}</td>
                        <td>{coupon.startDate?.substring(0, 10)}</td>
                        <td>{coupon.endDate?.substring(0, 10)}</td>
                        <td>
                          <Button
                            variant={
                              coupon.status === "Active"
                                ? "success"
                                : "secondary"
                            }
                            size="sm"
                            onClick={() => toggleStatus(coupon._id)}
                          >
                            {coupon.status}
                          </Button>
                        </td>
                        <td className="d-flex gap-2">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleEdit(coupon)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(coupon._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center text-muted">
                        No coupons created yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="d-block d-md-none">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <Card key={coupon._id} className="mb-3 shadow-sm">
                <Card.Body>
                  <p>
                    <strong>Code:</strong> {coupon.code}
                  </p>
                  <p>
                    <strong>Type:</strong> {coupon.type}
                  </p>
                  <p>
                    <strong>Value:</strong>{" "}
                    {coupon.type === "flat"
                      ? `₹${coupon.value}`
                      : `${coupon.value}%`}
                  </p>
                  <p>
                    <strong>Min Order:</strong> ₹{coupon.minOrder}
                  </p>
                  <p>
                    <strong>Max Uses:</strong> {coupon.maxUses}
                  </p>
                  <p>
                    <strong>Used:</strong> {coupon.used}
                  </p>
                  <p>
                    <strong>Start:</strong> {coupon.startDate?.substring(0, 10)}
                  </p>
                  <p>
                    <strong>End:</strong> {coupon.endDate?.substring(0, 10)}
                  </p>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    <Button
                      variant={
                        coupon.status === "Active" ? "success" : "secondary"
                      }
                      size="sm"
                      onClick={() => toggleStatus(coupon._id)}
                      className="flex-fill"
                    >
                      {coupon.status}
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                      className="flex-fill"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(coupon._id)}
                      className="flex-fill"
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted">No coupons created yet</div>
          )}
        </div>

        

        {/* Modal for Create/Edit Coupon (same as your code) */}
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>

            <Modal.Title>
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formCode">
                    <Form.Label>Coupon Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formType">
                    <Form.Label>Discount Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="flat">Flat (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formValue">
                    <Form.Label>Discount Value</Form.Label>
                    <Form.Control
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formMinOrder">
                    <Form.Label>Minimum Order Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="minOrder"
                      value={formData.minOrder}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formMaxUses">
                    <Form.Label>Max Uses</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxUses"
                      value={formData.maxUses}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateOrUpdateCoupon}>
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Coupon;
