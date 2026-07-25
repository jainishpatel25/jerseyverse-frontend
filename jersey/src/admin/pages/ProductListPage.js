import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: 0,
    countInStock: 0,
    image: "",
    _id: "",
    sizes: [],
  });

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
 
  const API= process.env.REACT_APP_API_URL;

  // Fetch products from backend
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/admin/products');
  //       const data = await res.json();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error('Failed to fetch products:', error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);
  const fetchProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API}/admin/products?page=${page}&limit=5`
      );
      setProducts(response.data.products);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Open edit modal
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEdit(true);
  };

  const handleSizeChange = (size) => {
    setCurrentProduct((prev) => {
      if (prev.sizes.includes(size)) {
        return { ...prev, sizes: prev.sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const updateProduct = async (currentProduct, updatedData) => {
    try {
      const res = await axios.put(
        `${API}/admin/products/${currentProduct._id}`,
        updatedData
      );
      console.log("Product updated:", res.data);

      // ✅ Close modal
      setShowEdit(false);

      // ✅ Update local product list
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === currentProduct._id ? { ...prod, ...updatedData } : prod
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Open delete modal
  const handleDelete = (product) => {
    setCurrentProduct(product);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `/admin/products/${currentProduct._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setProducts((prev) =>
          prev.filter((prod) => prod._id !== currentProduct._id)
        );
        setShowDelete(false);
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="admin-content">
  <div className="container mt-4">
    <h3 className="mb-4">Product List</h3>

    {/* Desktop Table */}
    <div className="d-none d-md-block">
      <Table bordered hover className="shadow-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sizes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>{prod._id}</td>
              <td>{prod.name}</td>
              <td>
                <img
                  src={`${API}/uploads/${prod.image}`}
                  alt={prod.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
              </td>
              <td>₹{prod.price}</td>
              <td>{prod.countInStock}</td>
              <td>{prod.sizes}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(prod)}
                  className="me-1"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(prod)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    {/* Mobile Stacked Cards */}
    <div className="d-block d-md-none">
      {products.map((prod) => (
        <div
          key={prod._id}
          className="product-card mb-3 p-3 shadow-sm rounded"
        >
          <p><strong>ID:</strong> {prod._id}</p>
          <p><strong>Name:</strong> {prod.name}</p>
          <p>
            <strong>Image:</strong> <br />
            <img
              src={`${API}/uploads/${prod.image}`}
              alt={prod.name}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </p>
          <p><strong>Price:</strong> ₹{prod.price}</p>
          <p><strong>Stock:</strong> {prod.countInStock}</p>
          <p><strong>Sizes:</strong>  {prod.sizes.map(size => (
    <span key={size} className="badge bg-secondary me-1">{size}</span>
  ))}</p>
          <div className="d-flex gap-2 mt-2">
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleEdit(prod)}
              className="flex-fill"
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(prod)}
              className="flex-fill"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination (keep as is) */}
    <div className="d-flex justify-content-center mt-3">
      <Button
        variant="secondary"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="mx-3 align-self-center">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
          {/* Edit Modal */}
      <Modal className="modal"show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice" className="mt-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStock" className="mt-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct.countInStock}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    countInStock: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Available Sizes</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <Form.Check
                    key={size}
                    type="checkbox"
                    label={size}
                    checked={currentProduct.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              updateProduct(currentProduct, {
                name: currentProduct.name,
                price: currentProduct.price,
                countInStock: currentProduct.countInStock,
                 sizes: currentProduct.sizes
              })
            }
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{currentProduct.name}</strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
</div>

  );
};

export default ProductListPage;
