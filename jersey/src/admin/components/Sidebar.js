// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { Link} from 'react-router-dom';
// import { BsHouseDoor, BsListCheck, BsPlusCircle, BsPeople } from 'react-icons/bs';

// const Sidebar = () => {
//   return (
//     <div style={{
//   width: '240px',
//   minHeight: '100%',
//   backgroundColor: '#fff',
//   borderRight: '1px solid #dee2e6',
// }}>
//       <Nav className="flex-column p-3">
//         <Nav.Link as={Link} to="/admin/dashboard" className="d-flex align-items-center gap-2 text-dark">
//           <BsHouseDoor /> Dashboard
//         </Nav.Link>
//         <Nav.Link as={Link} to="/admin/orders" className="d-flex align-items-center gap-2 text-dark">
//           <BsListCheck /> Orders
//         </Nav.Link>
//         <Nav.Link as={Link} to="/admin/add-product" className="d-flex align-items-center gap-2 text-dark">
//           <BsPlusCircle /> Add Product
//         </Nav.Link>
//         <Nav.Link as={Link} to="/admin/products" className="d-flex align-items-center gap-2 text-dark">
//           <BsPeople /> Products List
//         </Nav.Link>
//         <Nav.Link as={Link} to="/admin/customer" className="d-flex align-items-center gap-2 text-dark">
//           <BsPeople /> Customers
//         </Nav.Link>
//         <Nav.Link as={Link} to="/admin/coupon" className="d-flex align-items-center gap-2 text-dark">
//           <BsPeople /> Coupons
//         </Nav.Link>
//       </Nav>

//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import {
  BsHouseDoor,
  BsListCheck,
  BsPlusCircle,
  BsPeople,
  BsX,
} from "react-icons/bs";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger */}
      <Button className={`hamburger-btn d-md-none ${isOpen ? "hidden" : ""}`} onClick={toggleSidebar}>
        ☰
      </Button>

      <div
        className={`sidebar ${isOpen ? "open" : ""}`}
        onClick={() => isOpen && toggleSidebar()}
      >
        <Button className="close-btn" onClick={toggleSidebar}>
          <BsX size={30} />
        </Button>
        <div className="adjust">
        <Nav className="flex-column p-3" >
          <Nav.Link
            as={Link}
            to="/admin/dashboard"
            className="d-flex align-items-center gap-2 text-dark"
          >
            <BsHouseDoor /> Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/orders"
            className="d-flex align-items-center gap-2 text-dark"
          >
            <BsListCheck /> Orders
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/add-product"
            className="d-flex align-items-center gap-2 text-dark"
          >
            <BsPlusCircle /> Add Product
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/products"
            className="d-flex align-items-center gap-2 text-dark"
          >
            <BsPeople /> Products List
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/customer"
            className="d-flex align-items-center gap-2 text-dark"
          >
            <BsPeople /> Customers
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/coupon"
            className="d-flex align-items-center gap-2 text-dark"
          >
            <BsPeople /> Coupons
          </Nav.Link>
        </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
