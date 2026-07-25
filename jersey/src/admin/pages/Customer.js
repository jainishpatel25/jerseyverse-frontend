// import React, { useState } from 'react';
// import { Table, Form, InputGroup, Button, Pagination } from 'react-bootstrap';

// const dummyUsers = [
//   { id: 1, name: 'John Doe', email: 'john@example.com', totalOrders: 3, signupDate: '2024-05-01' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com', totalOrders: 5, signupDate: '2024-06-01' },
//   { id: 3, name: 'Alice Brown', email: 'alice@example.com', totalOrders: 1, signupDate: '2024-06-10' },
//   { id: 4, name: 'Mark Tailor', email: 'mark@example.com', totalOrders: 2, signupDate: '2024-06-15' },
//   { id: 5, name: 'Ravi Patel', email: 'ravi@example.com', totalOrders: 8, signupDate: '2024-06-20' },
//   { id: 6, name: 'Priya Mehta', email: 'priya@example.com', totalOrders: 4, signupDate: '2024-06-21' },
//   { id: 7, name: 'Amit Sharma', email: 'amit@example.com', totalOrders: 6, signupDate: '2024-06-22' },
//   { id: 8, name: 'Sara Khan', email: 'sara@example.com', totalOrders: 2, signupDate: '2024-06-23' },
//   { id: 9, name: 'Tom Cruise', email: 'tom@example.com', totalOrders: 3, signupDate: '2024-06-24' },
//   { id: 10, name: 'Bruce Lee', email: 'bruce@example.com', totalOrders: 9, signupDate: '2024-06-24' },
// ];

// const Customers = () => {
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 5;

//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//   const handleSort = (key) => {
//     if (sortConfig.key === key) {
//       // Toggle direction
//       setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
//     } else {
//       setSortConfig({ key, direction: 'asc' });
//     }
//   };

//   const getSortedUsers = (users) => {
//     if (!sortConfig.key) return users;

//     return [...users].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];

//       // Parse dates
//       if (sortConfig.key === 'signupDate') {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }

//       if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//   };

//   const filteredUsers = dummyUsers.filter(
//     (user) =>
//       user.name.toLowerCase().includes(search.toLowerCase()) ||
//       user.email.toLowerCase().includes(search.toLowerCase())
//   );

//   const sortedUsers = getSortedUsers(filteredUsers);

//   const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
//   const paginatedUsers = sortedUsers.slice(
//     (currentPage - 1) * usersPerPage,
//     currentPage * usersPerPage
//   );

//   return (
//     <div className="p-4">
//       <h4 className="mb-4">Customers</h4>

//       <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
//         <Form.Control
//           placeholder="Search by name or email..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </InputGroup>

//       <Table bordered hover responsive>
//         <thead className="table-light">
//           <tr>
//             <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
//               Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//             </th>
//             <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
//               Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//             </th>
//             <th onClick={() => handleSort('totalOrders')} style={{ cursor: 'pointer' }}>
//               Total Orders {sortConfig.key === 'totalOrders' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//             </th>
//             <th onClick={() => handleSort('signupDate')} style={{ cursor: 'pointer' }}>
//               Signup Date {sortConfig.key === 'signupDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//             </th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedUsers.length > 0 ? (
//             paginatedUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.totalOrders}</td>
//                 <td>{user.signupDate}</td>
//                 <td>
//                   <Button size="sm" variant="outline-primary">View Orders</Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center text-muted">No matching users found</td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       <Pagination>
//         {[...Array(totalPages)].map((_, i) => (
//           <Pagination.Item
//             key={i + 1}
//             active={i + 1 === currentPage}
//             onClick={() => setCurrentPage(i + 1)}
//           >
//             {i + 1}
//           </Pagination.Item>
//         ))}
//       </Pagination>
//     </div>
//   );
// };

// export default Customers;
// Updated Customers.js with slide-in panel for View Orders
import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import {Table,
  Form,
  InputGroup,
  Button,
  Pagination,
  Offcanvas,
  ListGroup
} from 'react-bootstrap';

const Customers = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showOrders, setShowOrders] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);

  const API= process.env.REACT_APP_API_URL;
  
  

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const getSortedUsers = (users) => {
    if (!sortConfig.key) return users;
    return [...users].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === 'signupDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = getSortedUsers(filteredUsers);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

const handleViewOrders = async (user) => {
  setSelectedUser(user);
  setShowOrders(true);
  try {
    const res = await axios.get(`${API}/admin/orders/user/${user._id}`);
    setUserOrders(res.data);
  } catch (err) {
    console.error('Error fetching orders:', err);
    setUserOrders([]);
  }
};

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/admin/users`);
        // Filter out blocked users if needed (assuming there's a `blocked` boolean field)
        const filtered = res.data.filter(user => !user.blocked); // Optional if backend already excludes
        setUsers(filtered);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
//     <div className="admin-content">
//     <div className="p-4">
//       <h4 className="mb-4">Customers</h4>

//       <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
//         <Form.Control
//           placeholder="Search by name or email..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </InputGroup>

//       <Table bordered hover responsive>
//         <thead className="table-light">
//           <tr>
//             <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
//             <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
//             <th onClick={() => handleSort('totalOrders')} style={{ cursor: 'pointer' }}>Total Orders {sortConfig.key === 'totalOrders' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
//             <th onClick={() => handleSort('signupDate')} style={{ cursor: 'pointer' }}>Signup Date {sortConfig.key === 'signupDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedUsers.length > 0 ? (
//             paginatedUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.totalOrders}</td>
//                 <td>{new Date(user.createdAt).toLocaleDateString()}</td>
//                 <td>
//                   <Button size="sm" variant="primary" onClick={() => handleViewOrders(user)}>
//                     View Orders
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center text-muted">No matching users found</td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       <Pagination>
//         {[...Array(totalPages)].map((_, i) => (
//           <Pagination.Item
//             key={i + 1}
//             active={i + 1 === currentPage}
//             onClick={() => setCurrentPage(i + 1)}
//           >
//             {i + 1}
//           </Pagination.Item>
//         ))}
//       </Pagination>

//       {/* Slide panel for user orders */}
//       <Offcanvas show={showOrders} onHide={() => setShowOrders(false)} placement="end">
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>{selectedUser?.name}'s Orders</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <p>Email: {selectedUser?.email}</p>
//           <p>Total Orders: {selectedUser?.totalOrders}</p>
//           <h6>Order History:</h6>
//           <ListGroup>
//   {userOrders.length > 0 ? userOrders.map((order, idx) => (
//     <ListGroup.Item key={order._id}>
//       Order #{idx + 1} - ₹{order.totalAmount} - Status: {order.status}
//     </ListGroup.Item>
//   )) : (
//     <div className="text-muted">No orders found</div>
//   )}
// </ListGroup>

//         </Offcanvas.Body>
//       </Offcanvas>
//     </div>
//     </div>
<div className="admin-content">
  <div className="p-4">
    <h4 className="mb-4">Customers</h4>

    <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
      <Form.Control
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
    </InputGroup>

    {/* Desktop Table */}
    <div className="d-none d-md-block">
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('totalOrders')} style={{ cursor: 'pointer' }}>Total Orders {sortConfig.key === 'totalOrders' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('signupDate')} style={{ cursor: 'pointer' }}>Signup Date {sortConfig.key === 'signupDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.totalOrders}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button size="sm" variant="primary" onClick={() => handleViewOrders(user)}>
                    View Orders
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">No matching users found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>

    {/* Mobile Cards */}
    <div className="d-block d-md-none">
      {paginatedUsers.length > 0 ? (
        paginatedUsers.map((user) => (
          <div key={user.id} className="customer-card mb-3 p-3 shadow-sm rounded">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Total Orders:</strong> {user.totalOrders}</p>
            <p><strong>Signup Date:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <Button size="sm" variant="primary" onClick={() => handleViewOrders(user)} className="w-100 mt-2">
              View Orders
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center text-muted">No matching users found</div>
      )}
    </div>

    {/* Pagination (same for both layouts) */}
    <Pagination>
      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
    </Pagination>

    {/* Slide panel for user orders */}
    <Offcanvas show={showOrders} onHide={() => setShowOrders(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{selectedUser?.name}'s Orders</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p>Email: {selectedUser?.email}</p>
        <p>Total Orders: {selectedUser?.totalOrders}</p>
        <h6>Order History:</h6>
        <ListGroup>
          {userOrders.length > 0 ? userOrders.map((order, idx) => (
            <ListGroup.Item key={order._id}>
              Order #{idx + 1} - ₹{order.totalAmount} - Status: {order.status}
            </ListGroup.Item>
          )) : (
            <div className="text-muted">No orders found</div>
          )}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  </div>
</div>

  );
};

export default Customers;
