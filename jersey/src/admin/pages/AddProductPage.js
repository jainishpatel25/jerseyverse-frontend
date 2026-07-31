// AddProduct.js
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
const AddProductPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please select a product image.");
      return;
    }

    const productRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      categoryId: Number(formData.categoryId),
    };

    const multipartData = new FormData();

    multipartData.append(
      "product",
      new Blob([JSON.stringify(productRequest)], { type: "application/json" }),
    );

    multipartData.append("image", formData.image);

    try {
      await api.post("/api/v1/admin/products", multipartData);

      alert("Product added successfully!");

      navigate("/admin/products");
    } catch (err) {
      console.error(
        "Failed to create product:",
        err.response?.data || err.message,
      );

      alert(err.response?.data?.message || "Failed to add product.");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/v1/categories");

        setCategories(response.data || []);
      } catch (err) {
        console.error(
          "Failed to fetch categories:",
          err.response?.data || err.message,
        );
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="admin-content">
      <Container className="p-4">
        <h4 className="mb-4">Add New Product</h4>
        <Card className="shadow-sm p-4">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter jersey name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>

              <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* 
            <Form.Group className="mb-3">
              <Form.Label>Available Sizes</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <Form.Check
                    key={size}
                    type="checkbox"
                    label={size}
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                ))}
              </div>
            </Form.Group> */}

            {preview && (
              <div className="mb-4">
                <Form.Label>Preview:</Form.Label>
                <div>
                  <Image
                    src={preview}
                    alt="Preview"
                    width={150}
                    height={150}
                    thumbnail
                  />
                </div>
              </div>
            )}

            <Button type="submit" variant="primary">
              Add Product
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default AddProductPage;
