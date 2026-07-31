import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import api from "../../utils/api";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newImage, setNewImage] = useState(null);

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    variants: [],
  });

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const API = process.env.REACT_APP_API_URL;

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/v1/admin/products");

      setProducts(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error.response?.data || error.message
      );

      setProducts([]);
    }
  };

  // --------------------------------------------------
  // Fetch Categories
  // --------------------------------------------------

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------

  const handleEdit = async (product) => {
    try {
      const response = await api.get(
        `/api/v1/admin/products/${product.id}`
      );

      setCurrentProduct(response.data);
      setNewImage(null);
      setShowEdit(true);
    } catch (error) {
      console.error(
        "Failed to fetch product details:",
        error.response?.data || error.message
      );
    }
  };

  // --------------------------------------------------
  // Total Stock
  // --------------------------------------------------

  const totalStock =
    currentProduct.variants?.reduce(
      (total, variant) =>
        total + Number(variant.stock || 0),
      0
    ) || 0;

  // --------------------------------------------------
  // Update Variant Stock
  // --------------------------------------------------

  const handleVariantStockChange = (index, value) => {
    const updatedVariants = [...currentProduct.variants];

    updatedVariants[index] = {
      ...updatedVariants[index],
      stock: value,
    };

    setCurrentProduct({
      ...currentProduct,
      variants: updatedVariants,
    });
  };

  // --------------------------------------------------
  // Add Variant
  // --------------------------------------------------

  const handleAddVariant = (size) => {
    if (!size) {
      return;
    }

    const exists = currentProduct.variants.some(
      (variant) => variant.size === size
    );

    if (exists) {
      return;
    }

    setCurrentProduct({
      ...currentProduct,
      variants: [
        ...currentProduct.variants,
        {
          size: size,
          stock: 0,
        },
      ],
    });
  };

  // --------------------------------------------------
  // Remove Variant
  // --------------------------------------------------

  const handleRemoveVariant = (size) => {
    setCurrentProduct({
      ...currentProduct,
      variants: currentProduct.variants.filter(
        (variant) => variant.size !== size
      ),
    });
  };

  // --------------------------------------------------
  // Save Product
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      if (!currentProduct.id) {
        console.error("Product ID is missing.");
        return;
      }

      const updateRequest = {
        name: currentProduct.name.trim(),
        description: currentProduct.description.trim(),
        price: Number(currentProduct.price),
        categoryId: Number(currentProduct.categoryId),

        variants: currentProduct.variants.map((variant) => ({
          size: variant.size,
          stock: Number(variant.stock),
        })),
      };

      const formData = new FormData();

      formData.append(
        "product",
        new Blob(
          [JSON.stringify(updateRequest)],
          {
            type: "application/json",
          }
        )
      );

      // Image is optional during update
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await api.put(
        `/api/v1/admin/products/${currentProduct.id}`,
        formData
      );

      console.log("Product updated:", response.data);

      setShowEdit(false);
      setNewImage(null);

      await fetchProducts();
    } catch (error) {
      console.error(
        "Failed to update product:",
        error.response?.data || error.message
      );
    }
  };

  // --------------------------------------------------
  // Open Delete Modal
  // --------------------------------------------------

  const handleDelete = (product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: "",
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: "",
      variants: [],
    });

    setShowDelete(true);
  };

  // --------------------------------------------------
  // Delete Product
  // --------------------------------------------------

  const handleDeleteConfirm = async () => {
    try {
      if (!currentProduct.id) {
        return;
      }

      await api.delete(
        `/api/v1/admin/products/${currentProduct.id}`
      );

      setShowDelete(false);

      await fetchProducts();
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="admin-content">
      <div className="container mt-4">
        <h3 className="mb-4">Product List</h3>

        {/* ================= DESKTOP TABLE ================= */}

        <div className="d-none d-md-block">
          <Table bordered hover className="shadow-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Total Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>{product.name}</td>

                    <td>
                      <img
                        src={`${API}${product.imageUrl}`}
                        alt={product.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </td>

                    <td>
                      ₹
                      {Number(product.price).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>{product.totalStock}</td>

                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-muted"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* ================= MOBILE CARDS ================= */}

        <div className="d-block d-md-none">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="product-card mb-3 p-3 shadow-sm rounded"
              >
                <p>
                  <strong>ID:</strong> {product.id}
                </p>

                <p>
                  <strong>Name:</strong> {product.name}
                </p>

                <img
                  src={`${API}${product.imageUrl}`}
                  alt={product.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                <p className="mt-2">
                  <strong>Price:</strong>{" "}
                  ₹
                  {Number(product.price).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  <strong>Total Stock:</strong>{" "}
                  {product.totalStock}
                </p>

                <div className="d-flex gap-2 mt-2">
                  <Button
                    variant="warning"
                    size="sm"
                    className="flex-fill"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-fill"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">
              No products found.
            </p>
          )}
        </div>

        {/* ================= EDIT MODAL ================= */}

        <Modal
          show={showEdit}
          onHide={() => {
            setShowEdit(false);
            setNewImage(null);
          }}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              {/* Name */}

              <Form.Group>
                <Form.Label>Name</Form.Label>

                <Form.Control
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Description */}

              <Form.Group className="mt-3">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Price */}

              <Form.Group className="mt-3">
                <Form.Label>Price</Form.Label>

                <Form.Control
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Category */}

              <Form.Group className="mt-3">
                <Form.Label>Category</Form.Label>

                <Form.Select
                  value={currentProduct.categoryId}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      categoryId: Number(e.target.value),
                    })
                  }
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Total Stock */}

              <Form.Group className="mt-3">
                <Form.Label>Total Stock</Form.Label>

                <Form.Control
                  type="number"
                  value={totalStock}
                  disabled
                />

                <Form.Text className="text-muted">
                  Total stock is calculated from all size
                  variants.
                </Form.Text>
              </Form.Group>

              {/* Variants */}

              <Form.Group className="mt-3">
                <Form.Label>
                  Size Variants / Stock
                </Form.Label>

                {currentProduct.variants?.length > 0 ? (
                  currentProduct.variants.map(
                    (variant, index) => (
                      <div
                        key={variant.size}
                        className="d-flex align-items-center gap-2 mb-2"
                      >
                        <Form.Control
                          type="text"
                          value={variant.size}
                          disabled
                          style={{
                            maxWidth: "100px",
                          }}
                        />

                        <Form.Control
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantStockChange(
                              index,
                              e.target.value
                            )
                          }
                          style={{
                            maxWidth: "150px",
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            handleRemoveVariant(
                              variant.size
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-muted">
                    No variants added yet.
                  </p>
                )}

                {/* Add Variant */}

                <Form.Select
                  className="mt-2"
                  value=""
                  onChange={(e) =>
                    handleAddVariant(e.target.value)
                  }
                >
                  <option value="">
                    Add Size
                  </option>

                  {sizeOptions
                    .filter(
                      (size) =>
                        !currentProduct.variants?.some(
                          (variant) =>
                            variant.size === size
                        )
                    )
                    .map((size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              {/* Current Image */}

              {currentProduct.imageUrl && (
                <div className="mt-3">
                  <Form.Label>
                    Current Image
                  </Form.Label>

                  <div>
                    <img
                      src={`${API}${currentProduct.imageUrl}`}
                      alt={currentProduct.name}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Replace Image */}

              <Form.Group className="mt-3">
                <Form.Label>
                  Replace Image (Optional)
                </Form.Label>

                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewImage(
                      e.target.files?.[0] || null
                    )
                  }
                />

                {newImage && (
                  <Form.Text className="text-muted">
                    Selected: {newImage.name}
                  </Form.Text>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEdit(false);
                setNewImage(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ================= DELETE MODAL ================= */}

        <Modal
          show={showDelete}
          onHide={() => setShowDelete(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Delete Confirmation
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete{" "}
            <strong>{currentProduct.name}</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ProductListPage;