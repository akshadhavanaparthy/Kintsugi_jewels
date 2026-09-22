import { useState } from "react";
import axios from "axios";

function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please select a product image.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category_id", formData.category_id);
      data.append("image", image);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response.data);

      setMessage("✅ Jewellery added successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: ""
      });

      setImage(null);
      setPreview(null);

    } catch (error) {
  console.error("FULL ERROR:", error);
  console.log("SERVER RESPONSE:", error.response?.data);

  setMessage(
    error.response?.data?.error ||
    error.response?.data?.message ||
    "Failed to add jewellery."
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-page">

      <div className="admin-add-container">

        <div className="admin-heading">
          <p>ADMIN PANEL</p>
          <h1>Add New Jewellery</h1>
          <span>
            Add a new jewellery product to your collection.
          </span>
        </div>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}
          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              placeholder="Example: Diamond Necklace"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>


          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Describe the jewellery..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>


          {/* PRICE + STOCK */}
          <div className="form-row">

            <div className="form-group">
              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                placeholder="50000"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>


            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                placeholder="10"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

          </div>


          {/* CATEGORY */}
          <div className="form-group">
            <label>Category ID</label>

            <input
              type="number"
              name="category_id"
              placeholder="Example: 1"
              value={formData.category_id}
              onChange={handleChange}
              min="1"
              required
            />

            <small>
              Use the ID of the category from your database.
            </small>
          </div>


          {/* IMAGE */}
          <div className="form-group">

            <label>Product Image</label>

            <div className="image-upload">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

              {preview && (
                <div className="image-preview">
                  <img
                    src={preview}
                    alt="Product preview"
                  />
                </div>
              )}

            </div>

          </div>


          {/* MESSAGE */}
          {message && (
            <div className="form-message">
              {message}
            </div>
          )}


          {/* SUBMIT */}
          <button
            type="submit"
            className="add-product-button"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Add Jewellery"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminAddProduct;