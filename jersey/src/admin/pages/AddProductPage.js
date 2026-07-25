// AddProduct.js
import React, { useState } from "react";
import { Form, Button, Card, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    // stock: '',
    image: null,
    sizes: [],
  });

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
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

  const handleSizeChange = (size) => {
    setFormData((prev) => {
      if (prev.sizes.includes(size)) {
        // remove size if unchecked
        return { ...prev, sizes: prev.sizes.filter((s) => s !== size) };
      } else {
        // add size if checked
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("image", formData.image);
    form.append('sizes', JSON.stringify(formData.sizes)); // ✅ send sizes as JSON string

    try {
      const res = await fetch("/admin/products/add", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product added successfully!");
        navigate("/admin/products");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Server error");
    }
  };

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
          </Form.Group>

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
