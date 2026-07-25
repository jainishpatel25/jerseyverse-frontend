import React ,{useState,useEffect}from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaCreditCard } from 'react-icons/fa';
import { Breadcrumb } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import AddressAdd from './AddressAdd';
import axios from 'axios';

const Address = () => {

const [sameAsDelivery, setSameAsDelivery] = useState(true);
const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
const [editMode, setEditMode] = useState(false); // false = add, true = edit
const [refresh, setRefresh] = useState(false);

  const API= process.env.REACT_APP_API_URL;

// const handleAddClick = () => {
//   setEditMode(false);
//   setShowForm(true);
// };

const handleEditClick = () => {
  setEditMode(true);
  setShowForm(true);
};

const handleFormClose = () => {
  setShowForm(false);
};

const handleFormSuccess = () => {
  setShowForm(false);
  setRefresh((prev) => !prev);

  const user = JSON.parse(localStorage.getItem('userInfo'));

  axios.get(`${API}/api/address`, {
    headers: { Authorization: `Bearer ${user.token}` },
  }).then((res) => {
    setAddress(res.data);
    localStorage.setItem('userAddress', JSON.stringify(res.data));  // ✅ update localStorage
  });
};

 
    useEffect(() => {
    const fetchAddress = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const res = await axios.get(`${API}/api/address`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setAddress(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load address');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [refresh]);



  const handleToggle = () => setSameAsDelivery(!sameAsDelivery);

  const AddressBox = () => (
    <Row className="mb-5">
      <Col md={6}>
        <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-between">
          <div>
            <p className="mb-1 fw-semibold">{address?.company}, {address?.email}</p>
            <p className="mb-1">{address?.street}</p>
            <p className="mb-1">{address?.apartment}</p>
            <p className="mb-1">{address?.city} {address?.zip}</p>
            <p className="mb-1">{address?.state}</p>
            <p className="mb-3">{address?.country}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <FaCreditCard className="me-2" />
            <Button variant="outline-dark" size="sm" onClick={handleEditClick}>
              <FaEdit className="me-1" /> Edit
            </Button>
          </div>
        </div>
      </Col>
 <Col md={6}>
        <div className="p-3 border rounded text-center d-flex flex-column justify-content-center align-items-center h-100 dashed-border"
        //  onClick={handleAddClick}
         style={{ cursor: 'pointer' }}
        
        >
          <FaPlus size={28} className="text-muted mb-2" />
          <p className="mb-0 text-muted">Add Address</p>
        </div>
      </Col>
    </Row>
  );

  return (
    <Container className="py-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="#"><i className="bi bi-house-door"></i></Breadcrumb.Item>
        <Breadcrumb.Item active>Addresses</Breadcrumb.Item>
      </Breadcrumb>

      <h5 className="mb-4">Delivery address</h5>
      <Row className="mb-5">
        <Col md={6}>
          <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-between">
            <div>
             <p className="mb-1 fw-semibold">{address?.company}, {address?.email}</p>
            <p className="mb-1">{address?.street}</p>
            <p className="mb-1">{address?.apartment}</p>
            <p className="mb-1">{address?.city} {address?.zip}</p>
            <p className="mb-1">{address?.state}</p>
            <p className="mb-3">{address?.country}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <FaCreditCard className="me-2" />
              <Button variant="outline-dark" size="sm" onClick={handleEditClick}>
                <FaEdit className="me-1" /> Edit
              </Button>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="p-3 border rounded text-center d-flex flex-column justify-content-center align-items-center h-100 dashed-border"
          //  onClick={handleAddClick}
           style={{ cursor: 'pointer' }}

          >
            <FaPlus size={28} className="text-muted mb-2" />
            <p className="mb-0 text-muted">Add Address</p>
          </div>
        </Col>
      </Row>

      <h5 className="mb-3">Billing address</h5>
      <Form.Check
        type="switch"
        id="same-address-switch"
        label="Same as delivery address"
        checked={sameAsDelivery}
        onChange={handleToggle}
        className="mb-4"
      />
      {!sameAsDelivery && <AddressBox />}

      <Modal show={showForm} onHide={handleFormClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>{editMode ? 'Edit Address' : 'Add Address'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <AddressAdd
      initialData={editMode ? address : null}
      onSuccess={handleFormSuccess}
    />
  </Modal.Body>
</Modal>


    </Container>
  );
};

export default Address;
