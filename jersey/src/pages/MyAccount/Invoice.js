import React, { useEffect, useState } from 'react';
import { Container, Table, Breadcrumb, Button } from 'react-bootstrap';
import axios from 'axios';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);

  const API= process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get(`${API}/api/invoices`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setInvoices(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoices();
  }, []);

 const handleView = async (id) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  try {
    const response = await axios.get(`${API}/api/invoices/${id}/pdf`, {
      headers: { Authorization: `Bearer ${user.token}` },
      responseType: 'blob'
    });

    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    console.error('Error fetching PDF:', error);
  }
};


  return (
    <Container className="py-4">
       <Breadcrumb>
        <Breadcrumb.Item href="#"><i className="bi bi-house-door"></i></Breadcrumb.Item>
        <Breadcrumb.Item active>Invoice & Bills</Breadcrumb.Item>
      </Breadcrumb>

      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <Table striped bordered hover responsive className="text-center">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv._id.slice(-6).toUpperCase()}</td>
                <td>{new Date(inv.createdAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge px-2 py-1 rounded-pill ${
                      inv.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td>₹ {inv.totalAmount?.toLocaleString('en-IN')}.00</td>
                <td>
                  <Button variant="outline-dark" size="sm" onClick={() => handleView(inv._id)}>
                    View / Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Invoice;
