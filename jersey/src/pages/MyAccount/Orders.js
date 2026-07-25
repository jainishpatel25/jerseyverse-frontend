// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Table, Breadcrumb, Spinner, Alert } from 'react-bootstrap';

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

//         const res = await axios.get('http://localhost:5000/api/orders/my', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setOrders(res.data);
//      } catch (err) {
//   console.error(err);
//   setOrders([]); // fallback to empty array
//   setError('');  // remove error if it was a 404 or empty
// } finally {
//   setLoading(false);
// }

//     };

//     fetchOrders();
//   }, []);

//   return (
//     <Container className="py-4">
//       <Breadcrumb>
//         <Breadcrumb.Item href="#"><i className="bi bi-house-door"></i></Breadcrumb.Item>
//         <Breadcrumb.Item active>Sales Orders</Breadcrumb.Item>
//       </Breadcrumb>

//       <h5 className="mb-4">Sales Orders</h5>

//       {loading ? (
//         <Spinner animation="border" />
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : orders.length === 0 ? (
//        <Alert variant="info">No orders found.</Alert>
//       ) : (
//         <Table striped bordered hover responsive className="order-table">
//           <thead>
//             <tr>
//               <th>Sales Order #</th>
//               <th className="text-center">Order Date</th>
//               <th className="text-end">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, index) => {
//               const date = new Date(order.createdAt);
//               return (
//                 <tr key={order._id}>
//                   <td>SO{String(index + 1).padStart(4, '0')}</td>
//                   <td className="text-center">
//                     {date.toLocaleDateString()} &nbsp;
//                     {date.toLocaleTimeString()}
//                   </td>
//                   <td className="text-end">₹ {order.totalAmount.toLocaleString('en-IN')}.00</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default Order;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Breadcrumb,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API= process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        const res = await axios.get(`${API}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setOrders([]);
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Shipped":
        return "info";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "dark";
    }
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <i className="bi bi-house-door"></i>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Sales Orders</Breadcrumb.Item>
      </Breadcrumb>

      <h5 className="mb-4">Sales Orders</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="order-table">
          <thead>
            <tr>
              <th>Sales Order #</th>
              <th className="text-center">Order Date</th>
              <th className="text-end">Total</th>
              <th className="text-center">Status</th> {/* NEW COLUMN */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const date = new Date(order.createdAt);
              return (
                <tr key={order._id}>
                  <td>SO{String(index + 1).padStart(4, "0")}</td>
                  <td className="text-center">
                    {date.toLocaleDateString()} &nbsp;
                    {date.toLocaleTimeString()}
                  </td>
                  <td className="text-end">
                    ₹ {order.totalAmount.toLocaleString("en-IN")}.00
                  </td>
                  <td className="text-center">
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Order;
